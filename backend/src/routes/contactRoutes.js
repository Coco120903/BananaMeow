import express from "express";
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  replyToContact,
  deleteContact
} from "../controllers/contactController.js";
import { protect } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public — rate limited to prevent spam (10 per 15 min)
router.post("/", rateLimiter(10, 15 * 60 * 1000), submitContact);

// Admin only
router.get("/", requireAdmin, getContacts);
router.get("/:id", requireAdmin, getContactById);
router.put("/:id/status", requireAdmin, updateContactStatus);
router.post("/:id/reply", requireAdmin, replyToContact);
router.delete("/:id", requireAdmin, deleteContact);

export default router;
