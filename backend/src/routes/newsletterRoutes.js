import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  getNewsletterStats,
  deleteSubscriber
} from "../controllers/newsletterController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public
router.post("/subscribe", rateLimiter(5, 15 * 60 * 1000), subscribe);
router.get("/unsubscribe/:token", unsubscribe);

// Admin only
router.get("/subscribers", requireAdmin, getSubscribers);
router.get("/stats", requireAdmin, getNewsletterStats);
router.delete("/subscribers/:id", requireAdmin, deleteSubscriber);

export default router;
