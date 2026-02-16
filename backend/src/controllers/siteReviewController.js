import SiteReview from "../models/SiteReview.js";

// ═══════════════════════════════════════════════
//  PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════

// @desc    Get all approved site reviews (public)
// @route   GET /api/site-reviews/approved
export async function getApprovedReviews(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt"; // newest first

    const skip = (page - 1) * limit;
    const filter = { isApproved: true, status: "approved" };
    const total = await SiteReview.countDocuments(filter);

    const reviews = await SiteReview.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-email"); // Don't expose emails publicly

    res.json({
      reviews,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
}

// ═══════════════════════════════════════════════
//  USER ENDPOINTS (authenticated)
// ═══════════════════════════════════════════════

// @desc    Submit a new site review
// @route   POST /api/site-reviews
export async function submitReview(req, res) {
  try {
    const { rating, title, message } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a review message" });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ message: "Review message cannot exceed 1000 characters" });
    }
    if (title && title.trim().length > 100) {
      return res.status(400).json({ message: "Title cannot exceed 100 characters" });
    }

    // Prevent spam: check if user submitted a review in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentReview = await SiteReview.findOne({
      user: req.user._id,
      createdAt: { $gte: oneHourAgo }
    });
    if (recentReview) {
      return res.status(429).json({
        message: "You've already submitted a review recently. Please wait before submitting another one."
      });
    }

    const review = await SiteReview.create({
      user: req.user._id,
      username: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage || "",
      rating: Math.round(rating),
      title: title?.trim() || "",
      message: message.trim(),
      status: "pending",
      isApproved: false
    });

    res.status(201).json({
      message: "Your review has been sent for royal approval 👑",
      review: {
        _id: review._id,
        rating: review.rating,
        title: review.title,
        message: review.message,
        status: review.status,
        createdAt: review.createdAt
      }
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
}

// ═══════════════════════════════════════════════
//  ADMIN ENDPOINTS
// ═══════════════════════════════════════════════

// @desc    Get all site reviews (admin) with filters
// @route   GET /api/site-reviews/admin
export async function getAdminReviews(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // "pending", "approved", "rejected"
    const search = req.query.search;

    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await SiteReview.countDocuments(filter);

    const reviews = await SiteReview.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get counts for each status
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      SiteReview.countDocuments({ status: "pending" }),
      SiteReview.countDocuments({ status: "approved" }),
      SiteReview.countDocuments({ status: "rejected" })
    ]);

    res.json({
      reviews,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        all: pendingCount + approvedCount + rejectedCount
      }
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
}

// @desc    Approve a site review
// @route   PATCH /api/site-reviews/admin/:id/approve
export async function approveReview(req, res) {
  try {
    const review = await SiteReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = "approved";
    review.isApproved = true;
    review.reviewedAt = new Date();
    await review.save();

    res.json({ message: "Review approved", review });
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ message: "Error approving review" });
  }
}

// @desc    Reject a site review
// @route   PATCH /api/site-reviews/admin/:id/reject
export async function rejectReview(req, res) {
  try {
    const review = await SiteReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = "rejected";
    review.isApproved = false;
    review.reviewedAt = new Date();
    await review.save();

    res.json({ message: "Review rejected", review });
  } catch (error) {
    console.error("Error rejecting review:", error);
    res.status(500).json({ message: "Error rejecting review" });
  }
}

// @desc    Delete a site review
// @route   DELETE /api/site-reviews/admin/:id
export async function deleteReview(req, res) {
  try {
    const review = await SiteReview.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
}
