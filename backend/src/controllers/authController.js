import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../utils/emailService.js";

/* ===========================
   ADMIN AUTH
=========================== */

export async function adminLogin(req, res) {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUsername || !adminPassword || !jwtSecret) {
    console.error("Admin credentials or JWT_SECRET not configured in .env");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: adminUsername, role: "admin" },
    jwtSecret,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful",
    token,
    admin: { username: adminUsername }
  });
}

export async function verifyToken(req, res) {
  // If we get here, the token is valid (middleware already verified)
  res.json({ valid: true, admin: req.admin });
}

/* ===========================
   USER AUTH
=========================== */

// In-memory store for pending registrations (use Redis/DB in production)
const pendingRegistrations = new Map();

// Cleanup expired pending registrations every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingRegistrations.entries()) {
    if (now > data.expiresAt) pendingRegistrations.delete(email);
  }
}, 5 * 60 * 1000);

// Generate JWT for users
const generateUserToken = (userId, sessionVersion) => {
  return jwt.sign(
    { id: userId, role: "user", sessionVersion },
    process.env.JWT_SECRET || "banana-meow-secret-key-2024",
    { expiresIn: "7d" }
  );
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register user (Step 1 - sends verification code)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user exists (including archived accounts)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      // If user exists and is NOT archived, reject registration
      if (!existingUser.isArchived) {
        return res.status(400).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
      // If user is archived, we'll reactivate it in verifyRegister
      // Continue with registration flow
    }

    const verificationCode = generateVerificationCode();

    // Trim and normalize password input
    const trimmedPassword = password.trim();
    
    if (trimmedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash password now, store in pending
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);
    
    console.log(`[AUTH] Password hashed during registration for email: ${email.toLowerCase()}, hash length: ${hashedPassword.length}`);

    // Store whether this is a reactivation of an archived account
    const isReactivation = existingUser && existingUser.isArchived;
    const archivedUserId = isReactivation ? existingUser._id.toString() : null;

    pendingRegistrations.set(email.toLowerCase(), {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
      isReactivation, // Flag to indicate this is a reactivation
      archivedUserId, // Store the archived user ID if reactivating
    });

    // Send verification email via Resend
    const emailResult = await sendVerificationEmail(email, verificationCode, name);

    if (emailResult.success) {
      return res.status(200).json({
        success: true,
        message: "Verification code sent to your email!",
        requiresVerification: true,
        expiresIn: "10 minutes",
        emailFailed: false,
      });
    } else {
      // Email failed - return code as fallback for dev
      return res.status(200).json({
        success: true,
        message: "Email delivery failed. Use the code below.",
        requiresVerification: true,
        verificationCode, // Fallback for dev
        expiresIn: "10 minutes",
        emailFailed: true,
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// @desc    Verify registration code (Step 2 - creates the user)
// @route   POST /api/auth/verify-register
export const verifyRegister = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and verification code",
      });
    }

    const pendingData = pendingRegistrations.get(email.toLowerCase());
    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    if (Date.now() > pendingData.expiresAt) {
      pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please register again.",
      });
    }

    if (pendingData.attempts >= 5) {
      pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please register again.",
      });
    }

    if (code !== pendingData.verificationCode) {
      pendingData.attempts += 1;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${5 - pendingData.attempts} attempts remaining.`,
      });
    }

    let user;
    let isReactivation = false;

    // Check if this is a reactivation of an archived account
    if (pendingData.isReactivation && pendingData.archivedUserId) {
      // Reactivate archived account
      user = await User.findById(pendingData.archivedUserId).select("+resetPasswordToken +resetPasswordExpire");
      
      if (!user) {
        // Archived user not found, proceed with new registration
        user = new User({
          name: pendingData.name,
          email: pendingData.email,
          password: pendingData.password,
        });
        user.$skipPasswordHash = true;
        await user.save();
      } else {
        // Reactivate the archived account
        isReactivation = true;
        // Update user fields
        user.name = pendingData.name;
        user.password = pendingData.password;
        user.isArchived = false;
        user.resetPasswordToken = null; // Clear any reset tokens
        user.resetPasswordExpire = null;
        user.$skipPasswordHash = true; // Password already hashed
        await user.save({ validateBeforeSave: false });
        
        console.log(`Account reactivated for email: ${user.email}`);
      }
    } else {
      // Create new user with already-hashed password
      user = new User({
        name: pendingData.name,
        email: pendingData.email,
        password: pendingData.password,
      });
      user.$skipPasswordHash = true;
      await user.save();
    }

    pendingRegistrations.delete(email.toLowerCase());

    // Increment sessionVersion for new account or reactivated account
    // Use findByIdAndUpdate to avoid triggering pre-save hooks that might re-hash password
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { sessionVersion: 1 } },
      { new: true }
    );

    const token = generateUserToken(updatedUser._id, updatedUser.sessionVersion || 1);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch((err) => {
      console.error("Welcome email failed:", err);
    });

    return res.status(201).json({
      success: true,
      message: isReactivation 
        ? "Welcome back! Your account has been reactivated successfully." 
        : "Welcome to the royal court! Account verified successfully.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Verify register error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-code
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const pendingData = pendingRegistrations.get(email.toLowerCase());
    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again.",
      });
    }

    const newCode = generateVerificationCode();
    pendingData.verificationCode = newCode;
    pendingData.expiresAt = Date.now() + 10 * 60 * 1000;
    pendingData.attempts = 0;

    // Send new verification email via Resend
    const emailResult = await sendVerificationEmail(email, newCode, pendingData.name);

    if (emailResult.success) {
      return res.status(200).json({
        success: true,
        message: "New verification code sent to your email!",
        expiresIn: "10 minutes",
        emailFailed: false,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Email delivery failed. Use the code below.",
        verificationCode: newCode, // Fallback for dev
        expiresIn: "10 minutes",
        emailFailed: true,
      });
    }
  } catch (error) {
    console.error("Resend code error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if it's admin login
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminUsername && password === adminPassword) {
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(
        { username: adminUsername, role: "admin" },
        jwtSecret,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        message: "Welcome back, Royal Administrator!",
        data: {
          user: {
            id: "admin",
            name: "Administrator",
            email: adminUsername,
            role: "admin",
          },
          token,
          isAdmin: true,
        },
      });
    }

    // Regular user login
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is archived
    if (user.isArchived) {
      return res.status(403).json({
        success: false,
        message: "This account has been archived and cannot be accessed",
      });
    }

    // Trim and normalize password input
    const trimmedPassword = password.trim();
    
    if (!trimmedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password cannot be empty",
      });
    }

    // Log authentication attempt (without exposing password)
    console.log(`[AUTH] Login attempt for email: ${email.toLowerCase()}, user exists: ${!!user}, isArchived: ${user?.isArchived || false}`);

    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
      console.log(`[AUTH] Login failed for email: ${email.toLowerCase()}: password mismatch`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log(`[AUTH] Login successful for email: ${email.toLowerCase()}, user ID: ${user._id}`);

    // Increment sessionVersion to invalidate previous sessions
    // Use findByIdAndUpdate to avoid triggering pre-save hooks
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { sessionVersion: 1 } },
      { new: true }
    );

    const token = generateUserToken(updatedUser._id, updatedUser.sessionVersion || 1);

    return res.status(200).json({
      success: true,
      message: "Welcome back to the royal court!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email is already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email: email?.toLowerCase() },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// @desc    Forgot password - send reset token
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      // Return generic success to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Find user by email (select password reset fields)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetPasswordToken +resetPasswordExpire");

    // Always return success message to prevent user enumeration
    // Even if user doesn't exist, return the same message
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Check if user is archived
    if (user.isArchived) {
      // Still return generic message
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure random token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiration (30 minutes)
    const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    // Save hashed token and expiration to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5176";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Send password reset email (non-blocking)
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (emailError) {
      // If email fails, clear the reset token
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save({ validateBeforeSave: false });

      console.error("Password reset email failed:", emailError);
      // Still return success to user
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide password and confirm password",
      });
    }

    // Trim and normalize password inputs
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Expiration must be in the future
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Check if user is archived
    if (user.isArchived) {
      return res.status(403).json({
        success: false,
        message: "This account has been archived and cannot be reset",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    console.log(`[AUTH] Password reset for user ID: ${user._id}, new hash length: ${hashedPassword.length}`);

    // Update password and clear reset token fields using findByIdAndUpdate
    await User.findByIdAndUpdate(
      user._id,
      { 
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null
      },
      { runValidators: false }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// Middleware: protect routes (user auth)
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "banana-meow-secret-key-2024"
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    // Check if user is archived
    if (user.isArchived) {
      return res.status(403).json({ 
        success: false, 
        message: "This account has been archived and cannot access this resource" 
      });
    }

    // Verify sessionVersion matches (enforces single-device login)
    const tokenSessionVersion = decoded.sessionVersion || 0;
    const userSessionVersion = user.sessionVersion || 0;
    
    if (tokenSessionVersion !== userSessionVersion) {
      return res.status(401).json({ 
        success: false, 
        message: "Your session has been invalidated. Please log in again." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
