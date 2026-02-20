import User from "../models/User.js";
import Order from "../models/Order.js";
import Donation from "../models/Donation.js";
import Gallery from "../models/Gallery.js";
import Cat from "../models/Cat.js";
import bcrypt from "bcryptjs";
import { sendPasswordChangeNotification } from "../utils/emailService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload profile image
// @route   POST /api/profile/upload-image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image file",
      });
    }

    // Get current user to check for existing image
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      // If file was uploaded but user not found, delete the file
      const filePath = path.join(__dirname, "../../uploads/profile", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image if it exists and is not empty
    if (currentUser.profileImage && currentUser.profileImage.trim() !== "") {
      const oldImagePath = path.join(__dirname, "../../", currentUser.profileImage);
      fs.unlink(oldImagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          // ENOENT means file doesn't exist, which is fine
          console.error("Error deleting old profile image:", err);
        }
      });
    }

    // Generate URL for the uploaded file
    const imageUrl = `/uploads/profile/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    // If file was uploaded but update failed, delete the file
    if (req.file) {
      const filePath = path.join(__dirname, "../../uploads/profile", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err);
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};

// @desc    Remove profile image
// @route   DELETE /api/profile/remove-image
export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: "" },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Remove profile image error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove profile image",
    });
  }
};

// @desc    Change password
// @route   PUT /api/profile/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all password fields",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Trim and normalize password inputs
    const trimmedCurrentPassword = currentPassword.trim();
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedCurrentPassword || !trimmedNewPassword || !trimmedConfirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // Verify current password
    console.log(`[AUTH] Password change attempt for user ID: ${user._id}`);
    const isMatch = await user.comparePassword(trimmedCurrentPassword);
    if (!isMatch) {
      console.log(`[AUTH] Password change failed for user ID: ${user._id}: current password incorrect`);
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(trimmedNewPassword, salt);

    console.log(`[AUTH] Password changed for user ID: ${user._id}, new hash length: ${hashedPassword.length}`);

    // Update password using findByIdAndUpdate to avoid pre-save hook issues
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { runValidators: false }
    );

    // Send password change notification email (non-blocking)
    sendPasswordChangeNotification(user.email, user.name).catch((err) => {
      console.error("Password change notification email failed:", err);
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

// @desc    Get user activity history
// @route   GET /api/profile/activity
export const getUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favoriteCats",
      select: "name nickname traits funFact favoriteThing personality imageUrl createdAt",
    });
    const userEmail = user.email;

    // Get purchase history (orders by userId OR email for backward compatibility)
    const orderQuery = { $or: [{ userId: req.user.id }] };
    if (userEmail) orderQuery.$or.push({ email: userEmail });
    const orders = await Order.find(orderQuery)
      .sort({ createdAt: -1 })
      .limit(50);

    // Get donation history (donations by email or userId)
    const donations = await Donation.find({
      $or: [
        { email: userEmail },
        { userId: req.user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50);

    // Get liked posts with liked date
    // Handle both old format (array of ObjectIds) and new format (array of objects)
    const userId = req.user._id || req.user.id;
    
    // Find all posts where user ID appears in likes array (either format)
    // We'll use $or to match both old and new formats
    const allLikedPosts = await Gallery.find({
      $or: [
        { "likes.userId": userId }, // New format: object with userId
        { likes: userId } // Old format: direct ObjectId in array
      ]
    })
      .select("title thumbnailUrl createdAt _id mediaUrls likes")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    // Process each post to extract likedAt
    const likedPosts = allLikedPosts.map(post => {
      let likedAt = null;
      
      // Find the user's like in the likes array
      if (post.likes && post.likes.length > 0) {
        const userLike = post.likes.find(like => {
          // Check if it's new format (object with userId) or old format (direct ObjectId)
          if (typeof like === 'object' && like.userId) {
            return like.userId.toString() === userId.toString();
          } else {
            return like.toString() === userId.toString();
          }
        });
        
        // Extract likedAt if it exists (new format)
        if (userLike && typeof userLike === 'object' && userLike.likedAt) {
          likedAt = userLike.likedAt;
        }
      }
      
      return {
        _id: post._id.toString(),
        title: post.title,
        thumbnailUrl: post.thumbnailUrl,
        createdAt: post.createdAt,
        mediaUrls: post.mediaUrls,
        likedAt: likedAt || post.createdAt // Use createdAt as fallback if likedAt is null
      };
    });
    
    // Sort by likedAt (most recent first), then by createdAt
    likedPosts.sort((a, b) => {
      const dateA = a.likedAt ? new Date(a.likedAt) : new Date(a.createdAt);
      const dateB = b.likedAt ? new Date(b.likedAt) : new Date(b.createdAt);
      return dateB - dateA; // Descending order
    });

    // Get favorite cats (user already populated above)
    // Filter out any null values (in case cat was deleted)
    const favoriteCats = (user.favoriteCats || []).filter((cat) => cat !== null);

    return res.status(200).json({
      success: true,
      data: {
        orders,
        donations,
        likedPosts,
        favoriteCats,
      },
    });
  } catch (error) {
    console.error("Get user activity error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
    });
  }
};

// @desc    Soft delete account (archive)
// @route   DELETE /api/profile/delete-account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isArchived: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Account has been archived successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to archive account",
    });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          joinDate: user.joinDate || user.createdAt,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
