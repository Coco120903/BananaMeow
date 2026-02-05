import express from "express";
import {
  createCat,
  getCatById,
  getCats,
  updateCat,
  deleteCat
} from "../controllers/catsController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getCats);
router.get("/:id", getCatById);
router.post("/", requireAdmin, createCat);
router.put("/:id", requireAdmin, updateCat);
router.delete("/:id", requireAdmin, deleteCat);

export default router;
