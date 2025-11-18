import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  itemTitle: String,
  description: String,
  category: String,
  condition: String,
  pickupLocation: String,
  contactInformation: String,
  photos: [String],
  status: { type: String, default: "available" },
  donorEmail: String,
  datePosted: { type: Date, default: Date.now }
});

// ✅ Prevent OverwriteModelError
export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
