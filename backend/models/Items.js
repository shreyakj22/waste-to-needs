// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemTitle: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  contactInformation: { type: String, required: true },
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("Item", itemSchema);