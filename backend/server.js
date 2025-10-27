import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
// Accept larger payloads for base64 images
app.use(express.json({ limit: '20mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Donation schema and model
const donationSchema = new mongoose.Schema({
  itemTitle: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  contactInformation: { type: String, required: true },
  photos: { type: [String], default: [] }, // store base64 data or image URLs
  status: { type: String, default: 'available' },
  datePosted: { type: Date, default: Date.now },
  donorEmail: { type: String }
});

const Donation = mongoose.model('Donation', donationSchema);

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Create a donation
app.post('/api/donations', async (req, res) => {
  try {
    const data = req.body;
    const donation = new Donation(data);
    await donation.save();
    return res.status(201).json(donation);
  } catch (err) {
    console.error('Error saving donation:', err);
    return res.status(500).json({ error: 'Failed to save donation' });
  }
});

// List donations
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ datePosted: -1 });
    return res.json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    return res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});