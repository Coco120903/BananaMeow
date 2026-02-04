import express from "express";
import {
  createDonation,
  getDonations
} from "../controllers/donationsController.js";

const router = express.Router();

router.get("/", getDonations);
router.post("/", createDonation);

export default router;
