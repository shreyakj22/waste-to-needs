import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    // Log for debugging
    console.log("Received message:", message);
    console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);

    const reply = result?.response?.text?.();
    if (!reply) {
      console.error("No reply from Gemini:", result);
      return res.status(500).json({ error: "Gemini returned no response" });
    }

    console.log("Gemini Reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

export default router;