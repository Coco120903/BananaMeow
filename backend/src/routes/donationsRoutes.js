import express from "express";
import {
  createDonation,
  getDonations
} from "../controllers/donationsController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", requireAdmin, getDonations);
router.post("/", createDonation);

export default router;
