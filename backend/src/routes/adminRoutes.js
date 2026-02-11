import express from "express";
import { getDashboardStats, getAnalytics } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/dashboard", requireAdmin, getDashboardStats);
router.get("/analytics", requireAdmin, getAnalytics);

export default router;
