import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"]
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"]
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Prevent duplicate reviews (one review per user per product)
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      avgRating: 0,
      numReviews: 0
    });
  }
};

// Recalculate after save
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

// Recalculate after delete
reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calcAverageRating(doc.product);
  }
});

export default mongoose.model("Review", reviewSchema);
