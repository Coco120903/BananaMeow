import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/emailService.js";

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
const generateUserToken = (userId) => {
  return jwt.sign(
    { id: userId, role: "user" },
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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const verificationCode = generateVerificationCode();

    // Hash password now, store in pending
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    pendingRegistrations.set(email.toLowerCase(), {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
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

    // Create user with already-hashed password
    const user = new User({
      name: pendingData.name,
      email: pendingData.email,
      password: pendingData.password,
    });
    user.$skipPasswordHash = true;
    await user.save();

    pendingRegistrations.delete(email.toLowerCase());

    const token = generateUserToken(user._id);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch((err) => {
      console.error("Welcome email failed:", err);
    });

    return res.status(201).json({
      success: true,
      message: "Welcome to the royal court! Account verified successfully.",
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateUserToken(user._id);

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

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
