import express from "express";
import User from "../models/User.js"; // ✅ Capital "U" to match your file name
import { sendVerificationEmail } from "../sendEmail.js";

const router = express.Router();

// 📩 Register route (creates user and sends verification code)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // create new user with code
    const newUser = new User({
      name,
      email,
      password,
      verificationCode,
      isVerified: false,
    });

    await newUser.save();

    // send email with code
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Verify route (user submits code)
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null; // clear code after success
      await user.save();

      return res.json({
        success: true,
        message: "✅ Email verified successfully!",
      });
    } else {
      return res.status(400).json({ message: "❌ Invalid verification code" });
    }
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
});

export default router;