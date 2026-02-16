import express from "express";
import {
  createDonationCheckout,
  createOrderCheckout,
  handleStripeWebhook
} from "../controllers/paymentsController.js";

const router = express.Router();

// Webhook must use express.raw() — this is mounted separately in app.js
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

router.post("/create-checkout-session", createDonationCheckout);
router.post("/create-order-session", createOrderCheckout);

export default router;
