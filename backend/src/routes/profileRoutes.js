import express from "express";
import {
  getProfile,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
  getUserActivity,
  deleteAccount,
} from "../controllers/profileController.js";
import { protect } from "../controllers/authController.js";
import { profileUpload } from "../middleware/profileUpload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user profile
router.get("/", getProfile);

// Profile image operations
router.post("/upload-image", profileUpload.single("image"), uploadProfileImage);
router.delete("/remove-image", removeProfileImage);

// Change password
router.put("/change-password", changePassword);

// User activity
router.get("/activity", getUserActivity);

// Delete account (soft delete)
router.delete("/delete-account", deleteAccount);

export default router;
