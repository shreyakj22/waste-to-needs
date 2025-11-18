// routes/itemRoutes.js
import express from "express";
import Item from "../models/Item.js";
import User from "../models/User.js";
import { sendEmail } from "../sendEmail.js";

const router = express.Router();

// 📩 When receiver requests an item
router.post("/request/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { receiverEmail } = req.body;

    // Find the item
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Get donor email from item
    const donorEmail = item.donorEmail;
    if (!donorEmail)
      return res.status(400).json({ error: "No donor email found for this item" });

    // Get receiver details
    const receiver = await User.findOne({ email: receiverEmail });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#1e40af;">Item Request Notification</h2>
        <p>Hello,</p>
        <p>Your item <strong>${item.itemTitle}</strong> has been requested by ${
          receiver?.name || "a receiver"
        } (${receiverEmail}).</p>
        <p>Please check your Waste2Needs dashboard for more details.</p>
        <br/>
        <p>Thank you for supporting sustainability 🌱</p>
      </div>
    `;

    // Send email to donor
    await sendEmail(
      donorEmail,
      "Your Item Has Been Requested",
      htmlContent
    );

    res.status(200).json({ success: true, message: "Email sent to donor" });
  } catch (err) {
    console.error("❌ Error in request route:", err);
    res.status(500).json({ error: "Server error while sending email" });
  }
});

export default router;