import express from "express";
import {
  adminLogin,
  verifyToken,
  register,
  verifyRegister,
  resendCode,
  login,
  getMe,
  updateProfile,
  protect,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Admin auth
router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdmin, verifyToken);

// User auth
router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/resend-code", resendCode);
router.post("/login", login);
router.post("/forgot-password", rateLimiter(5, 15 * 60 * 1000), forgotPassword); // 5 requests per 15 minutes
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

export default router;
