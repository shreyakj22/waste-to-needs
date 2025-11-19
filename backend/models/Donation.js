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

// Add GeoJSON location field for geospatial queries (Point: [lng, lat])
DonationSchema.add({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  },
  // When a donation is requested, track who requested and when
  requestedBy: String,
  requestDate: Date
});

// 2dsphere index for efficient geospatial queries
DonationSchema.index({ location: '2dsphere' });

// ✅ Prevent OverwriteModelError
export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
