import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"]
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"]
    },
    category: {
      type: String,
      enum: ["general", "order", "donation", "cats", "technical", "feedback"],
      default: "general"
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new"
    },
    adminReply: {
      type: String,
      trim: true,
      maxlength: [5000, "Reply cannot exceed 5000 characters"]
    },
    repliedAt: {
      type: Date
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

contactSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Contact", contactSchema);
