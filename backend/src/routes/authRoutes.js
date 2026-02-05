import express from "express";
import { adminLogin, verifyToken } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdmin, verifyToken);

export default router;
