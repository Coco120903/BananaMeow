import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    inventory: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
