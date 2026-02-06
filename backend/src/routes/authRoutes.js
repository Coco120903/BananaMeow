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
} from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin auth
router.post("/admin/login", adminLogin);
router.get("/admin/verify", requireAdmin, verifyToken);

// User auth
router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/resend-code", resendCode);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

export default router;
