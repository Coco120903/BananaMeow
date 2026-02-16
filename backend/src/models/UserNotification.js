import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure one record per user-notification pair
userNotificationSchema.index({ user: 1, notification: 1 }, { unique: true });
userNotificationSchema.index({ user: 1, isRead: 1 });
userNotificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("UserNotification", userNotificationSchema);
