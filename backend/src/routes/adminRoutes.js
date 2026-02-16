import express from "express";
import {
  getDashboardStats,
  getAnalytics,
  getUsers,
  getUserById,
  updateUserRole,
  archiveUser,
  unlockUser,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  deleteAdminOrder,
  getAdminDonations,
  updateDonationStatus
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Dashboard & Analytics
router.get("/dashboard", requireAdmin, getDashboardStats);
router.get("/analytics", requireAdmin, getAnalytics);

// User Management
router.get("/users", requireAdmin, getUsers);
router.get("/users/:id", requireAdmin, getUserById);
router.put("/users/:id/role", requireAdmin, updateUserRole);
router.put("/users/:id/archive", requireAdmin, archiveUser);
router.put("/users/:id/unlock", requireAdmin, unlockUser);

// Order Management
router.get("/orders", requireAdmin, getAdminOrders);
router.get("/orders/:id", requireAdmin, getAdminOrderById);
router.put("/orders/:id/status", requireAdmin, updateOrderStatus);
router.delete("/orders/:id", requireAdmin, deleteAdminOrder);

// Donation Management
router.get("/donations", requireAdmin, getAdminDonations);
router.put("/donations/:id/status", requireAdmin, updateDonationStatus);

export default router;
