import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
