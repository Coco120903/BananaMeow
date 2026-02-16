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
import galleryUpload from "../middleware/galleryUpload.js";

const router = express.Router();

// Multer error handling wrapper for gallery routes
function handleMulterError(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        // Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 50MB."
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: "Too many files or unexpected field name."
          });
        }
        // Custom file filter errors
        if (err.message && err.message.includes("Invalid file type")) {
          return res.status(400).json({ message: err.message });
        }
        // Generic multer errors
        return res.status(400).json({
          message: err.message || "File upload error."
        });
      }
      next();
    });
  };
}

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPost);

// Protected routes (require login)
router.post("/:id/like", protect, toggleLike);

// Admin routes with file upload (handles both media and thumbnail)
router.post(
  "/",
  requireAdmin,
  handleMulterError(
    galleryUpload.fields([
      { name: "media", maxCount: 10 },
      { name: "thumbnail", maxCount: 1 }
    ])
  ),
  createPost
);
router.put(
  "/:id",
  requireAdmin,
  handleMulterError(
    galleryUpload.fields([
      { name: "media", maxCount: 10 },
      { name: "thumbnail", maxCount: 1 }
    ])
  ),
  updatePost
);
router.delete("/:id", requireAdmin, deletePost);

// Admin routes for individual file operations
router.put(
  "/:id/file",
  requireAdmin,
  handleMulterError(galleryUpload.single("media")),
  updateFile
);
router.delete("/:id/file", requireAdmin, deleteFile);

// Admin route for thumbnail operations
router.delete("/:id/thumbnail", requireAdmin, deleteThumbnail);

export default router;
