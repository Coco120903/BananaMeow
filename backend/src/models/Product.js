import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    inventory: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);
