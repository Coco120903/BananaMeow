import express from "express";
import {
  getApprovedReviews,
  submitReview,
  getAdminReviews,
  approveReview,
  rejectReview,
  deleteReview
} from "../controllers/siteReviewController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// ─── Public routes ──────────────────────────────
router.get("/approved", getApprovedReviews);

// ─── User routes (must be logged in) ────────────
router.post("/", protect, submitReview);

// ─── Admin routes ───────────────────────────────
router.get("/admin", requireAdmin, getAdminReviews);
router.patch("/admin/:id/approve", requireAdmin, approveReview);
router.patch("/admin/:id/reject", requireAdmin, rejectReview);
router.delete("/admin/:id", requireAdmin, deleteReview);

export default router;
