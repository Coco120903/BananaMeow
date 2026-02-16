import express from "express";
import { createOrder, getOrders, updateOrderStatus, sendOrderReceiptHandler } from "../controllers/ordersController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", requireAdmin, getOrders);
router.post("/", createOrder);

// Admin actions
router.put("/:id/status", requireAdmin, updateOrderStatus);
router.post("/:id/receipt", requireAdmin, sendOrderReceiptHandler);

export default router;
