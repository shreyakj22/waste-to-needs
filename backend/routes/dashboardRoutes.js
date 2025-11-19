import express from "express";
import User from "../models/User.js";
import Donation from "../models/Donation.js";

const router = express.Router();

// GET /api/dashboard/:email
// Returns profile + statistics for the given user email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email }).select("name email dateCreated credits");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Donations donated by this user
    const donated = await Donation.find({ donorEmail: email }).sort({ datePosted: -1 }).limit(200).lean();

    // Donations received/requested by this user
    const received = await Donation.find({ requestedBy: email }).sort({ requestDate: -1 }).limit(200).lean();

    // Aggregate stats
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const availableDonations = await Donation.countDocuments({ status: "available" });

    // Average time from posting to request (in days) for items donated by this user
    const times = donated
      .filter(d => d.requestDate && d.datePosted)
      .map(d => (new Date(d.requestDate) - new Date(d.datePosted)) / (1000 * 60 * 60 * 24));
    const avgRequestDays = times.length ? times.reduce((s, v) => s + v, 0) / times.length : null;

    return res.json({
      profile: user,
      stats: {
        totalUsers,
        totalDonations,
        availableDonations,
        donatedCount: donated.length,
        receivedCount: received.length,
        avgRequestDays: avgRequestDays === null ? null : Number(avgRequestDays.toFixed(2)),
      },
      donated: donated.slice(0, 50),
      received: received.slice(0, 50),
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    return res.status(500).json({ error: "Failed to load dashboard" });
  }
});

export default router;
