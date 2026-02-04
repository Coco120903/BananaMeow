import Donation from "../models/Donation.js";

export async function getDonations(req, res) {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json(donations);
}

export async function createDonation(req, res) {
  const donation = await Donation.create(req.body);
  res.status(201).json(donation);
}
