import Cat from "../models/Cat.js";
import Product from "../models/Product.js";
import Donation from "../models/Donation.js";
import Order from "../models/Order.js";

export async function getDashboardStats(req, res) {
  try {
    const [catsCount, productsCount, donations, orders] = await Promise.all([
      Cat.countDocuments(),
      Product.countDocuments(),
      Donation.find().sort({ createdAt: -1 }).limit(10),
      Order.find().sort({ createdAt: -1 }).limit(10)
    ]);

    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalOrders = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      stats: {
        catsCount,
        productsCount,
        donationsCount: donations.length,
        ordersCount: orders.length,
        totalDonationAmount: totalDonations[0]?.total || 0,
        totalOrderAmount: totalOrders[0]?.total || 0
      },
      recentDonations: donations,
      recentOrders: orders
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
}
