import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import User from "./models/User.js";
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
// Accept larger payloads for base64 images
app.use(express.json({ limit: '20mb' }));

// Simple request logger to help diagnose incoming requests
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Connect to MongoDB with proper options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
  // Test the connection by checking database stats
  return mongoose.connection.db.stats();
})
.then((stats) => {
  console.log("📊 Database stats:", {
    collections: stats.collections,
    indexes: stats.indexes,
    documents: stats.objects
  });
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  // Exit process on failed connection
  process.exit(1);
});

// User Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or account does not exist' });
    }

    // Check password (in a real app, you would hash the password)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Send success response
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Attempting to register new user:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Registration failed: Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({ name, email, password });
    
    // Save the user to database
    const savedUser = await user.save();
    console.log('New user registered successfully:', { id: savedUser._id, email: savedUser.email });

    res.status(201).json({ 
      success: true, 
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    // Check for specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

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
    console.log('POST /api/donations payload keys:', Object.keys(data || {}));
    const donation = new Donation(data);
    const saved = await donation.save();
    console.log('Donation saved with _id=', saved._id);
    return res.status(201).json(saved);
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

// Bulk upload endpoint (used by client offline sync)
app.post('/api/donations/bulk', async (req, res) => {
  try {
    const { donations } = req.body || {};
    if (!Array.isArray(donations) || donations.length === 0) {
      return res.status(400).json({ error: 'No donations provided' });
    }
    const docs = donations.map(d => new Donation(d));
    const saved = await Donation.insertMany(docs, { ordered: false });
    console.log('Bulk upload: saved ${saved.length} donations');
    return res.status(201).json({ savedCount: saved.length });
  } catch (err) {
    console.error('Bulk upload error:', err);
    return res.status(500).json({ error: 'Bulk upload failed' });
  }
});

// Start server
const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, '0.0.0.0', function (err) {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  const addr = this.address();
  console.log('🚀 Server running and listening on ${addr.address}:${addr.port}');
});