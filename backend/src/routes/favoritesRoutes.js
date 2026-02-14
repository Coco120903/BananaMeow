import express from "express";
import {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  getFavorites,
} from "../controllers/favoritesController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's favorites
router.get("/", getFavorites);

// Toggle favorite (recommended - handles add/remove in one endpoint)
router.put("/:catId", toggleFavorite);

// Alternative endpoints (for explicit add/remove)
router.post("/:catId", addFavorite);
router.delete("/:catId", removeFavorite);

export default router;
