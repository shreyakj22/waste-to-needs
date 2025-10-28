import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
}, {
  // Enable timestamps to automatically track createdAt and updatedAt
  timestamps: true,
  // Ensure Mongoose includes virtual properties when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for better query performance
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;