import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemTitle: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  contactInformation: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // ✅ Added owner field
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
export default Item;