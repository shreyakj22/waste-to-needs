import express from "express";
import Donation from "../models/Donation.js";
import { sendEmail } from "../sendEmail.js";

const router = express.Router();

// ============================
// 1️⃣ Request a donation
// ============================
router.put("/:itemId/request", async (req, res) => {
  try {
    const { receiverEmail, receiverName } = req.body; // Who is requesting
    const itemId = req.params.itemId;

    const item = await Donation.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // Update item status to requested
    item.status = "requested";
    item.requestedBy = receiverEmail;
    item.requestDate = new Date();
    await item.save();

    // Notify the donor
    const donorEmail = item.donorEmail;
    const htmlContent = `
      <h2>📢 Your Item Has Been Requested!</h2>
      <p><strong>${receiverName || "Someone"}</strong> (${receiverEmail}) has requested your item.</p>

      <h3>📝 Item Details</h3>
      <ul>
        <li><strong>Title:</strong> ${item.itemTitle}</li>
        <li><strong>Description:</strong> ${item.description}</li>
        <li><strong>Category:</strong> ${item.category}</li>
      </ul>

      <p>Please review and accept the donation if you wish to proceed.</p>
      <br/>
      <p style="color: gray;">Waste2Needs</p>
    `;
    await sendEmail(donorEmail, "Your item has been requested!", htmlContent);

    return res.json({ success: true, donation: item, message: "Donor notified successfully!" });
  } catch (error) {
    console.error("Error in request route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ============================
// 2️⃣ Accept a donation
// ============================
router.put("/:itemId/accept", async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Donation.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    if (!item.requestedBy) return res.status(400).json({ success: false, message: "No request found for this item" });

    // Update status to accepted
    item.status = "accepted";
    await item.save();

    // Notify the receiver
    const receiverEmail = item.requestedBy;
    const htmlContent = `
      <h2>🎉 Your request has been approved!</h2>
      <p>Your request for <strong>${item.itemTitle}</strong> has been accepted by the donor.</p>
      <p>Please contact the donor at: <strong>${item.donorEmail}</strong></p>
      <br/>
      <p style="color: gray;">Waste2Needs</p>
    `;

    await sendEmail(receiverEmail, "Your request has been approved!", htmlContent);

    return res.json({ success: true, donation: item, message: "Donation accepted and receiver notified!" });
  } catch (error) {
    console.error("Error accepting donation:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
