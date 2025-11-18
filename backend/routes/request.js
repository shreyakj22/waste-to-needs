import express from "express";
import Donation from "../models/Donation.js";
import { sendEmail } from "../sendEmail.js";

const router = express.Router();

router.post("/:itemId", async (req, res) => {
  try {
    const { userEmail, userName } = req.body;
    const itemId = req.params.itemId;

    // Get item details
    const item = await Donation.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const donorEmail = item.donorEmail;

    // Email HTML
    const htmlContent = `
      <h2>📢 Your Item Has Been Requested!</h2>
      <p><strong>${userName}</strong> (${userEmail}) has requested your item.</p>

      <h3>📝 Item Details</h3>
      <ul>
        <li><strong>Title:</strong> ${item.itemTitle}</li>
        <li><strong>Description:</strong> ${item.description}</li>
        <li><strong>Category:</strong> ${item.category}</li>
      </ul>

      <p>Please reach out to the user to proceed with the donation.</p>

      <br/>
      <p style="color: gray;">Waste2Needs</p>
    `;

    // Send Email
    await sendEmail(donorEmail, "Your item has been requested!", htmlContent);

    return res.json({
      success: true,
      message: "Email sent to donor successfully!",
    });
  } catch (error) {
    console.error("Error in request route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
