import express from "express";
import { createOrder, getOrders } from "../controllers/ordersController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", requireAdmin, getOrders);
router.post("/", createOrder);

export default router;
