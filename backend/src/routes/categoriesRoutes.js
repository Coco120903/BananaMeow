import express from "express";
import {
  createCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  deleteCategory
} from "../controllers/categoriesController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", requireAdmin, upload.single("image"), createCategory);
router.put("/:id", requireAdmin, upload.single("image"), updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

export default router;
