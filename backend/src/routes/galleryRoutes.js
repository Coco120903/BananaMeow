import express from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  updateFile,
  deleteFile,
  deleteThumbnail
} from "../controllers/galleryController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { protect } from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPost);

// Protected routes (require login)
router.post("/:id/like", protect, toggleLike);

// Admin routes with file upload (handles both media and thumbnail)
router.post("/", requireAdmin, upload.fields([{ name: "media", maxCount: 10 }, { name: "thumbnail", maxCount: 1 }]), createPost);
router.put("/:id", requireAdmin, upload.fields([{ name: "media", maxCount: 10 }, { name: "thumbnail", maxCount: 1 }]), updatePost);
router.delete("/:id", requireAdmin, deletePost);

// Admin routes for individual file operations
router.put("/:id/file", requireAdmin, upload.single("media"), updateFile);
router.delete("/:id/file", requireAdmin, deleteFile);

// Admin route for thumbnail operations
router.delete("/:id/thumbnail", requireAdmin, deleteThumbnail);

export default router;
