import express from "express";
import { register, verifyRegister, resendCode, login, getMe, updateProfile, protect, adminLogin, verifyToken } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/resend-code", resendCode);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

// Admin routes
router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdmin, verifyToken);

export default router;
