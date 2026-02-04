import express from "express";
import {
  createDonationCheckout,
  createOrderCheckout
} from "../controllers/paymentsController.js";

const router = express.Router();

router.post("/create-checkout-session", createDonationCheckout);
router.post("/create-order-session", createOrderCheckout);

export default router;
