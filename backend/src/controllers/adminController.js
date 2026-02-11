import Cat from "../models/Cat.js";
import Product from "../models/Product.js";
import Donation from "../models/Donation.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Gallery from "../models/Gallery.js";

// Helper function to get date range based on period
const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate, previousStartDate, previousEndDate;

  switch (period) {
    case "7d":
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      previousEndDate = new Date(startDate);
      break;
    case "30d":
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 30);
      previousEndDate = new Date(startDate);
      break;
    case "90d":
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 90);
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 90);
      previousEndDate = new Date(startDate);
      break;
    default:
      endDate = new Date(now);
      startDate = new Date(0); // All time
      previousStartDate = new Date(0);
      previousEndDate = new Date(0);
  }

  return { startDate, endDate, previousStartDate, previousEndDate };
};

export async function getDashboardStats(req, res) {
  try {
    const period = req.query.period || "30d";
    const { startDate, endDate, previousStartDate, previousEndDate } = getDateRange(period);

    // Basic counts
    const [
      totalUsers,
      totalCats,
      totalProducts,
      totalGalleryPosts,
      donations,
      orders,
      users,
      galleryPosts
    ] = await Promise.all([
      User.countDocuments({ isArchived: false }),
      Cat.countDocuments(),
      Product.countDocuments(),
      Gallery.countDocuments(),
      Donation.find({ createdAt: { $gte: startDate, $lte: endDate } }),
      Order.find({ createdAt: { $gte: startDate, $lte: endDate } }),
      User.find({ isArchived: false }),
      Gallery.find()
    ]);

    // Calculate new users
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      isArchived: false
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      isArchived: false
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      isArchived: false
    });

    // Previous period for comparison
    const previousPeriodUsers = await User.countDocuments({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate },
      isArchived: false
    });
    const currentPeriodUsers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      isArchived: false
    });
    const userGrowth = previousPeriodUsers > 0 
      ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers * 100).toFixed(1)
      : currentPeriodUsers > 0 ? "100.0" : "0.0";

    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => {
      // Check if user has recent activity (we'll use updatedAt as proxy for last activity)
      return u.updatedAt && new Date(u.updatedAt) > thirtyDaysAgo;
    }).length;

    // Total donations and revenue
    const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalRevenue = totalDonations + totalOrderRevenue;

    // Previous period revenue for comparison
    const previousDonations = await Donation.find({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate }
    });
    const previousOrders = await Order.find({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate }
    });
    const previousDonationAmount = previousDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const previousOrderAmount = previousOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const previousRevenue = previousDonationAmount + previousOrderAmount;
    const revenueGrowth = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : totalRevenue > 0 ? "100.0" : "0.0";

    // Order status breakdown
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
    const refundedOrders = orders.filter(o => o.status === "refunded").length;

    // Top spending user
    const userSpending = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$email", totalSpent: { $sum: "$total" } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 1 }
    ]);
    const topSpender = userSpending[0] || null;

    // Get top spender name if available
    let topSpenderName = "Unknown";
    let topSpenderAmount = 0;
    if (topSpender) {
      const user = await User.findOne({ email: topSpender._id });
      topSpenderName = user ? user.name : topSpender._id || "Unknown";
      topSpenderAmount = topSpender.totalSpent || 0;
    }

    res.json({
      stats: {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        activeUsers,
        userGrowth: `${userGrowth}%`,
        totalDonations: totalDonations.toFixed(2),
        totalOrderRevenue: totalOrderRevenue.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
        revenueGrowth: `${revenueGrowth}%`,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        refundedOrders,
        totalGalleryPosts,
        totalCats,
        topSpenderName,
        topSpenderAmount: topSpenderAmount.toFixed(2)
      },
      recentDonations: donations.slice(0, 5),
      recentOrders: orders.slice(0, 5)
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
}

// Analytics endpoint for charts and detailed data
export async function getAnalytics(req, res) {
  try {
    const period = req.query.period || "30d";
    const { startDate, endDate } = getDateRange(period);

    // Revenue over time
    const revenueOverTime = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate, $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === "7d" ? "%Y-%m-%d" : period === "30d" ? "%Y-%m-%d" : "%Y-%m", 
              date: "$createdAt",
              timezone: "UTC"
            }
          },
          shopRevenue: { $sum: { $ifNull: ["$total", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const donationOverTime = await Donation.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate, $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === "7d" ? "%Y-%m-%d" : period === "30d" ? "%Y-%m-%d" : "%Y-%m", 
              date: "$createdAt",
              timezone: "UTC"
            }
          },
          donationRevenue: { $sum: { $ifNull: ["$amount", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Combine revenue data
    const revenueData = revenueOverTime.map(item => ({
      date: item._id,
      shopRevenue: item.shopRevenue || 0,
      donationRevenue: 0,
      combinedRevenue: item.shopRevenue || 0
    }));

    donationOverTime.forEach(donation => {
      const existing = revenueData.find(r => r.date === donation._id);
      if (existing) {
        existing.donationRevenue = donation.donationRevenue || 0;
        existing.combinedRevenue = existing.shopRevenue + existing.donationRevenue;
      } else {
        revenueData.push({
          date: donation._id,
          shopRevenue: 0,
          donationRevenue: donation.donationRevenue || 0,
          combinedRevenue: donation.donationRevenue || 0
        });
      }
    });

    revenueData.sort((a, b) => a.date.localeCompare(b.date));

    // Donation distribution by cat
    const donationByCat = await Donation.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$cat", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]);

    // Category sales breakdown
    const categorySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    // User growth chart
    const userGrowth = await User.aggregate([
      { 
        $match: { 
          isArchived: false, 
          createdAt: { $gte: startDate, $lte: endDate, $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === "7d" ? "%Y-%m-%d" : period === "30d" ? "%Y-%m-%d" : "%Y-%m", 
              date: "$createdAt",
              timezone: "UTC"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top spenders
    const topSpenders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$email", totalSpent: { $sum: "$total" }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Get user details for top spenders
    const topSpendersWithDetails = await Promise.all(
      topSpenders.map(async (spender) => {
        const user = await User.findOne({ email: spender._id });
        const userDonations = await Donation.aggregate([
          { $match: { email: spender._id, createdAt: { $gte: startDate, $lte: endDate } } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalDonations = userDonations[0]?.total || 0;

        return {
          name: user ? user.name : spender._id || "Unknown",
          email: spender._id,
          totalSpent: spender.totalSpent || 0,
          totalDonations: totalDonations,
          orderCount: spender.orderCount || 0,
          lastActivity: user?.updatedAt || null
        };
      })
    );

    // Most purchased products
    const mostPurchased = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // Average Order Value
    const aovData = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: null,
          avgOrderValue: { $avg: "$total" },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    // Gallery engagement
    const galleryEngagement = await Gallery.aggregate([
      {
        $project: {
          title: 1,
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          createdAt: 1
        }
      },
      { $sort: { likesCount: -1 } }
    ]);

    const totalLikes = galleryEngagement.reduce((sum, g) => sum + g.likesCount, 0);
    const mostLikedPost = galleryEngagement[0] || null;

    // Gallery engagement over time
    const engagementOverTime = await Gallery.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate, $lte: endDate, $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: period === "7d" ? "%Y-%m-%d" : period === "30d" ? "%Y-%m-%d" : "%Y-%m", 
              date: "$createdAt",
              timezone: "UTC"
            }
          },
          postsCount: { $sum: 1 },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      revenueOverTime: revenueData,
      donationByCat,
      categorySales,
      userGrowth,
      topSpenders: topSpendersWithDetails,
      mostPurchased,
      averageOrderValue: aovData[0]?.avgOrderValue || 0,
      totalOrders: aovData[0]?.totalOrders || 0,
      totalRevenue: aovData[0]?.totalRevenue || 0,
      galleryEngagement,
      totalLikes,
      mostLikedPost,
      engagementOverTime
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
}
