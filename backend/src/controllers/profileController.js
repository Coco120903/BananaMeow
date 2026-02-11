import User from "../models/User.js";
import Order from "../models/Order.js";
import Donation from "../models/Donation.js";
import Gallery from "../models/Gallery.js";
import bcrypt from "bcryptjs";
import { sendPasswordChangeNotification } from "../utils/emailService.js";

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

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

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
    const user = await User.findById(req.user.id);
    const userEmail = user.email;

    // Get purchase history (orders by email)
    const orders = await Order.find({ email: userEmail })
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

    // Get liked posts (gallery posts where user ID is in likes array)
    const likedPosts = await Gallery.find({ likes: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("title thumbnailUrl createdAt _id");

    return res.status(200).json({
      success: true,
      data: {
        orders,
        donations,
        likedPosts,
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
