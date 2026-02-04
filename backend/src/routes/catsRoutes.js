import express from "express";
import {
  createCat,
  getCatById,
  getCats
} from "../controllers/catsController.js";

const router = express.Router();

router.get("/", getCats);
router.get("/:id", getCatById);
router.post("/", createCat);

export default router;
