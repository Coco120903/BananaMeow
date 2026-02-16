import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
export async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt";

    const skip = (page - 1) * limit;
    const total = await Review.countDocuments({ product: productId });

    const reviews = await Review.find({ product: productId })
      .populate("user", "name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      reviews,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
}

// @desc    Create a review
// @route   POST /api/reviews/product/:productId
export async function createReview(req, res) {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a review comment" });
    }

    // Check if user has purchased this product (verified purchase)
    const hasPurchased = await Order.findOne({
      email: req.user.email,
      "items.productId": productId,
      status: { $in: ["completed", "paid"] }
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      title: title?.trim(),
      comment: comment.trim(),
      isVerifiedPurchase: !!hasPurchased
    });

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name profileImage"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Error creating review" });
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
export async function updateReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only the review author can update
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const { rating, title, comment } = req.body;

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    if (title !== undefined) review.title = title.trim();
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name profileImage"
    );

    res.json(populatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Error updating review" });
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Owner or admin can delete
    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
}

// @desc    Get review summary for a product (rating breakdown)
// @route   GET /api/reviews/product/:productId/summary
export async function getReviewSummary(req, res) {
  try {
    const { productId } = req.params;

    const summary = await Review.aggregate([
      { $match: { product: (await import("mongoose")).default.Types.ObjectId.createFromHexString(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({
        avgRating: 0,
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const data = summary[0];
    res.json({
      avgRating: Math.round(data.avgRating * 10) / 10,
      totalReviews: data.totalReviews,
      breakdown: {
        5: data.rating5,
        4: data.rating4,
        3: data.rating3,
        2: data.rating2,
        1: data.rating1
      }
    });
  } catch (error) {
    console.error("Error fetching review summary:", error);
    res.status(500).json({ message: "Error fetching review summary" });
  }
}
