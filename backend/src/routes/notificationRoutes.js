import express from "express";
import {
  createNotification,
  getAllNotifications,
  toggleNotification,
  deleteNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// ─── Admin routes ───────────────────────────────
router.post("/admin", requireAdmin, createNotification);
router.get("/admin", requireAdmin, getAllNotifications);
router.patch("/admin/:id/toggle", requireAdmin, toggleNotification);
router.delete("/admin/:id", requireAdmin, deleteNotification);

// ─── User routes (must be logged in) ───────────
router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id/read", protect, markAsRead);

export default router;
