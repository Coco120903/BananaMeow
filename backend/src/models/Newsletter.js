import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    unsubscribeToken: {
      type: String,
      unique: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

newsletterSchema.index({ isActive: 1 });

export default mongoose.model("Newsletter", newsletterSchema);
