import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/dashboard", requireAdmin, getDashboardStats);

export default router;
