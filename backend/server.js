import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import chatRoute from "./routes/chatRoute.js";
import claimRoutes from "./routes/claimRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import requestRoutes from "./routes/request.js";

// ⛔ Import the Donation model from models folder (do NOT redefine it)
import Donation from "./models/Donation.js";

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

app.use("/api/chat", chatRoute);
app.use("/api", claimRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/request", requestRoutes);

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

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Create donation
app.post("/api/donations", async (req, res) => {
  try {
    const data = req.body;
    console.log("POST /api/donations payload keys:", Object.keys(data || {}));
    const donation = new Donation(data);
    const saved = await donation.save();
    console.log("Donation saved with _id=", saved._id);
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving donation:", err);
    return res.status(500).json({ error: "Failed to save donation" });
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


