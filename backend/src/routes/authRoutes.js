import express from "express";
import { register, verifyRegister, resendCode, login, getMe, updateProfile, protect } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/resend-code", resendCode);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

export default router;
