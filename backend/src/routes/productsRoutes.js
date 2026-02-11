import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAdmin, upload.single("image"), createProduct);
router.put("/:id", requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
