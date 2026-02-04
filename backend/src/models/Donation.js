import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    frequency: { type: String, required: true },
    amount: { type: Number, required: true },
    cat: { type: String, required: true },
    status: { type: String, default: "pending" },
    stripeSessionId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
