import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import claimRoutes from "./routes/claimRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import requestRoutes from "./routes/request.js";
import creditsRoutes from "./routes/creditsRoutes.js";

// ⛔ Import the Donation model from models folder (do NOT redefine it)
import Donation from "./models/Donation.js";
import User from "./models/User.js";
import { sendEmail } from "./sendEmail.js";
import fetch from 'node-fetch';

dotenv.config();
const app = express();

// Middlewares
// Allow local dev frontend and deployed origin
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000", "https://waste-to-needs-kzel.vercel.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed.'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Increase payload limits to accept base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.use("/api", claimRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/credits", creditsRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    return mongoose.connection.db.stats();
  })
  .then((stats) => {
    console.log("📊 Database stats:", {
      collections: stats.collections,
      indexes: stats.indexes,
      documents: stats.objects,
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Continuing without DB connection (development mode). Some routes will fail until MongoDB is available.");
    // Do not exit process so frontend can still reach the server for debugging
  });

// Auth Routes
app.use("/api/auth", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Create donation
app.post("/api/donations", async (req, res) => {
  try {
    const data = req.body;
    console.log("POST /api/donations payload keys:", Object.keys(data || {}));
    // If client provided explicit location.coordinates use it (expect [lng, lat])
    let location = undefined;
    if (data?.location && Array.isArray(data.location.coordinates) && data.location.coordinates.length === 2) {
      location = { type: 'Point', coordinates: data.location.coordinates };
    } else if (data?.pickupLocation) {
      // Try to geocode pickupLocation via Nominatim (OpenStreetMap)
      try {
        const coords = await geocodeAddress(data.pickupLocation);
        if (coords) location = { type: 'Point', coordinates: coords };
      } catch (gErr) {
        console.warn('Geocoding failed, saving donation without coordinates', gErr && gErr.message ? gErr.message : gErr);
      }
    }

    const donationPayload = { ...data };
    if (location) donationPayload.location = location;

    const donation = new Donation(donationPayload);
    const saved = await donation.save();
    console.log("Donation saved with _id=", saved._id);
    // Award 1 credit to the donor (if donorEmail present)
    try {
      const donorEmail = saved.donorEmail || donationPayload.donorEmail;
      if (donorEmail) {
        const updated = await User.findOneAndUpdate(
          { email: donorEmail },
          { $inc: { credits: 1 } },
          { new: true }
        ).select('email credits');
        if (updated) console.log(`Awarded 1 credit to ${updated.email} (credits=${updated.credits})`);
        else console.log(`Donor ${donorEmail} not found; credits not updated.`);
      }
    } catch (creditErr) {
      console.error('Failed to award donor credits:', creditErr);
    }
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving donation:", err);
    return res.status(500).json({ error: "Failed to save donation" });
  }
});

// Helper: geocode an address string via Nominatim (OpenStreetMap)
async function geocodeAddress(address) {
  if (!address) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  // Nominatim requires a valid User-Agent; include a short app id
  const res = await fetch(url, { headers: { 'User-Agent': 'waste2need/1.0 (contact@localhost)' } });
  if (!res.ok) throw new Error(`geocode failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0];
  const lat = parseFloat(first.lat);
  const lon = parseFloat(first.lon);
  if (!isFinite(lat) || !isFinite(lon)) return null;
  // return [lng, lat]
  return [lon, lat];
}

// Mark a donation as requested by a receiver
app.put("/api/donations/:id/request", async (req, res) => {
  try {
    const id = req.params.id;
    const { receiverEmail } = req.body || {};
    if (!receiverEmail) return res.status(400).json({ error: "receiverEmail is required" });

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });
    if (donation.status && donation.status !== 'available') return res.status(409).json({ error: "Donation is not available" });

    // Enforce monthly limit: max 3 requests per receiver per calendar month
    const MAX_REQUESTS_PER_MONTH = 3;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const recentCount = await Donation.countDocuments({
      requestedBy: receiverEmail,
      requestDate: { $gte: startOfMonth, $lt: startOfNextMonth }
    });

    if (recentCount >= MAX_REQUESTS_PER_MONTH) {
      return res.status(429).json({ error: `Monthly request limit reached (${MAX_REQUESTS_PER_MONTH}). Please try next month.` });
    }

    donation.status = 'requested';
    donation.requestedBy = receiverEmail;
    donation.requestDate = new Date();
    await donation.save();

    // Attempt to notify the donor by email
    try {
      const donorEmail = donation.donorEmail;
      const receiver = await User.findOne({ email: receiverEmail });
      const receiverName = receiver?.name || receiverEmail;

        if (donorEmail) {
          const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color:#16a34a;">Your item has been requested</h2>
              <p>Hello,</p>
              <p>Your item <strong>${donation.itemTitle}</strong> has been requested by <strong>${receiverName}</strong> (${receiverEmail}).</p>
              <p>Please contact them to arrange pickup: <strong>${receiverEmail}</strong></p>
              <p>Thank you for supporting Waste2Need 🌱</p>
            </div>`;

          await sendEmail(donorEmail, `Your item has been requested — ${donation.itemTitle}`, html);
        }

        // Send confirmation email to receiver
        try {
          const receiverHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color:#16a34a;">Request Received</h2>
              <p>Hi ${receiverName},</p>
              <p>You have successfully requested the item <strong>${donation.itemTitle}</strong> from ${donation.donorEmail}.</p>
              <p>Please contact the donor to arrange pickup: <strong>${donation.donorEmail}</strong></p>
              <p>Thank you for using Waste2Need 🌱</p>
            </div>`;

          await sendEmail(receiverEmail, `Request confirmed — ${donation.itemTitle}`, receiverHtml);
        } catch (recvMailErr) {
          console.error('Failed to send receiver confirmation email:', recvMailErr);
        }
    } catch (mailErr) {
      console.error('Failed to send donor notification email:', mailErr);
    }

    console.log(`Donation ${id} requested by ${receiverEmail}`);
    return res.json({ success: true, donation });
  } catch (err) {
    console.error('Error requesting donation:', err);
    return res.status(500).json({ error: 'Failed to request donation' });
  }
});

// Nearby donations: returns available donations near given lat/lng (meters)
// GET /api/donations/nearby?lat=..&lng=..&radius=10000
app.get('/api/donations/nearby', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = Math.min(parseInt(req.query.radius || '10000', 10), 50000); // cap 50km
    if (!isFinite(lat) || !isFinite(lng)) return res.status(400).json({ error: 'lat & lng required' });

    // Use $near query; requires 2dsphere index on Donation.location
    const docs = await Donation.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius
        }
      },
      status: 'available'
    }).limit(200).lean();

    return res.json({ donations: docs });
  } catch (err) {
    console.error('Nearby search failed:', err);
    return res.status(500).json({ error: 'Nearby search failed' });
  }
});

// List donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().sort({ datePosted: -1 });
    return res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// Bulk upload
app.post("/api/donations/bulk", async (req, res) => {
  try {
    const { donations } = req.body || {};
    if (!Array.isArray(donations) || donations.length === 0) {
      return res.status(400).json({ error: "No donations provided" });
    }

    const docs = donations.map((d) => new Donation(d));
    const saved = await Donation.insertMany(docs, { ordered: false });

    console.log(`Bulk upload: saved ${saved.length} donations`);
    return res.status(201).json({ savedCount: saved.length });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return res.status(500).json({ error: "Bulk upload failed" });
  }
});

// Start server
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
