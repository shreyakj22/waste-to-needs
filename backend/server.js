import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

app.listen(process.env.PORT || 5000, () => {
console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});