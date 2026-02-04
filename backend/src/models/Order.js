import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "pending" },
    stripeSessionId: { type: String },
    email: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
