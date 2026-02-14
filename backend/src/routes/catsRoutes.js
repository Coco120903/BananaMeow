import express from "express";
import {
  createCat,
  getCatById,
  getCats,
  updateCat,
  deleteCat
} from "../controllers/catsController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCats);
router.get("/:id", getCatById);
router.post("/", requireAdmin, upload.single("image"), createCat);
router.put("/:id", requireAdmin, upload.single("image"), updateCat);
router.delete("/:id", requireAdmin, deleteCat);

export default router;
