import mongoose from "mongoose";

const siteReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"]
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    message: {
      type: String,
      required: [true, "Please provide a review message"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    reviewedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Index for efficient queries
siteReviewSchema.index({ status: 1, createdAt: -1 });
siteReviewSchema.index({ isApproved: 1, createdAt: -1 });
siteReviewSchema.index({ user: 1 });

export default mongoose.model("SiteReview", siteReviewSchema);
