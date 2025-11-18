import express from "express";
import { sendEmail } from "../sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { toEmail, subject, htmlContent } = req.body;

  try {
    await sendEmail(toEmail, subject, htmlContent);
    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
