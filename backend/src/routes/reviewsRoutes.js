import express from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewSummary
} from "../controllers/reviewsController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Public
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/summary", getReviewSummary);

// Protected (user must be logged in)
router.post("/product/:productId", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
