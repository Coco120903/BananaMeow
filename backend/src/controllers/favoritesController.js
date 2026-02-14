import User from "../models/User.js";
import Cat from "../models/Cat.js";
import mongoose from "mongoose";

// @desc    Add cat to favorites
// @route   POST /api/favorites/:catId
export const addFavorite = async (req, res) => {
  try {
    const { catId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    // Check if cat exists
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Cat not found",
      });
    }

    // Get user with favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already favorited
    const isAlreadyFavorited = user.favoriteCats && user.favoriteCats.some(
      (id) => id.toString() === catId
    );
    
    if (isAlreadyFavorited) {
      return res.status(400).json({
        success: false,
        message: "Cat is already in favorites",
      });
    }

    // Add to favorites
    if (!user.favoriteCats) {
      user.favoriteCats = [];
    }
    user.favoriteCats.push(new mongoose.Types.ObjectId(catId));
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cat added to favorites",
      data: {
        favoriteCats: user.favoriteCats,
      },
    });
  } catch (error) {
    console.error("Add favorite error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add favorite",
    });
  }
};

// @desc    Remove cat from favorites
// @route   DELETE /api/favorites/:catId
export const removeFavorite = async (req, res) => {
  try {
    const { catId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    // Get user with favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if in favorites
    const isFavorited = user.favoriteCats && user.favoriteCats.some(
      (id) => id.toString() === catId
    );
    
    if (!isFavorited) {
      return res.status(400).json({
        success: false,
        message: "Cat is not in favorites",
      });
    }

    // Remove from favorites
    user.favoriteCats = user.favoriteCats.filter(
      (id) => id.toString() !== catId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cat removed from favorites",
      data: {
        favoriteCats: user.favoriteCats,
      },
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
    });
  }
};

// @desc    Toggle favorite (add if not exists, remove if exists)
// @route   PUT /api/favorites/:catId
export const toggleFavorite = async (req, res) => {
  try {
    const { catId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cat ID",
      });
    }

    // Check if cat exists
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Cat not found",
      });
    }

    // Get user with favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize if needed
    if (!user.favoriteCats) {
      user.favoriteCats = [];
    }

    // Check if already favorited
    const isFavorited = user.favoriteCats.some(
      (id) => id.toString() === catId
    );

    if (isFavorited) {
      // Remove from favorites
      user.favoriteCats = user.favoriteCats.filter(
        (id) => id.toString() !== catId
      );
    } else {
      // Add to favorites
      user.favoriteCats.push(new mongoose.Types.ObjectId(catId));
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isFavorited
        ? "Cat removed from favorites"
        : "Cat added to favorites",
      data: {
        isFavorited: !isFavorited,
        favoriteCats: user.favoriteCats,
      },
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle favorite",
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with populated favorites
    const user = await User.findById(userId).populate({
      path: "favoriteCats",
      select: "name nickname traits funFact favoriteThing personality imageUrl createdAt",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Filter out any null values (in case cat was deleted)
    const favoriteCats = (user.favoriteCats || []).filter((cat) => cat !== null);

    return res.status(200).json({
      success: true,
      data: {
        favoriteCats,
      },
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
    });
  }
};
