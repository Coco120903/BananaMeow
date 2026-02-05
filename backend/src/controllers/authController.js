import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/emailService.js";

// In-memory store for pending registrations (use Redis in production)
const pendingRegistrations = new Map();

// Clean up expired registrations every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingRegistrations.entries()) {
    if (now > data.expiresAt) {
      pendingRegistrations.delete(email);
    }
  }
}, 5 * 60 * 1000);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "banana-meow-secret-key-2024", {
    expiresIn: "7d"
  });
};

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Start registration (Step 1 - get verification code)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Hash password for storage
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store pending registration (expires in 10 minutes)
    pendingRegistrations.set(email.toLowerCase(), {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode, name);
      res.status(200).json({
        success: true,
        message: "Verification code sent to your email!",
        requiresVerification: true,
        expiresIn: "10 minutes"
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Still allow registration but inform user
      res.status(200).json({
        success: true,
        message: "Verification code generated. Check your email (or use demo code below if email fails).",
        requiresVerification: true,
        // Fallback: show code if email fails (remove in production)
        verificationCode: verificationCode,
        expiresIn: "10 minutes",
        emailFailed: true
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// @desc    Verify registration code (Step 2 - complete registration)
// @route   POST /api/auth/verify-register
// @access  Public
export const verifyRegister = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and verification code"
      });
    }

    const pendingData = pendingRegistrations.get(email.toLowerCase());

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again."
      });
    }

    // Check if expired
    if (Date.now() > pendingData.expiresAt) {
      pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please register again."
      });
    }

    // Check attempts (max 5)
    if (pendingData.attempts >= 5) {
      pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please register again."
      });
    }

    // Verify code
    if (code !== pendingData.verificationCode) {
      pendingData.attempts += 1;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${5 - pendingData.attempts} attempts remaining.`
      });
    }

    // Code is valid - create the user
    const user = new User({
      name: pendingData.name,
      email: pendingData.email,
      password: pendingData.password
    });
    
    // Skip password hashing since it's already hashed
    user.$skipPasswordHash = true;
    await user.save();

    // Clean up pending registration
    pendingRegistrations.delete(email.toLowerCase());

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error("Welcome email failed:", err);
    });

    res.status(201).json({
      success: true,
      message: "Welcome to the royal court! Account verified successfully.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error("Verify register error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-code
// @access  Public
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email"
      });
    }

    const pendingData = pendingRegistrations.get(email.toLowerCase());

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found. Please register again."
      });
    }

    // Generate new code
    const newCode = generateVerificationCode();
    pendingData.verificationCode = newCode;
    pendingData.expiresAt = Date.now() + 10 * 60 * 1000;
    pendingData.attempts = 0;

    // Send new verification email
    try {
      await sendVerificationEmail(email, newCode, pendingData.name);
      res.status(200).json({
        success: true,
        message: "New verification code sent to your email!",
        expiresIn: "10 minutes"
      });
    } catch (emailError) {
      console.error("Resend email failed:", emailError);
      res.status(200).json({
        success: true,
        message: "New code generated. Check your email (or use demo code below if email fails).",
        verificationCode: newCode, // Fallback if email fails
        expiresIn: "10 minutes",
        emailFailed: true
      });
    }
  } catch (error) {
    console.error("Resend code error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// @desc    Login user or admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // First, check if this is an admin login
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (email === adminUsername && password === adminPassword) {
      // Admin login
      const token = jwt.sign(
        { username: adminUsername, role: "admin" },
        process.env.JWT_SECRET,
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
            role: "admin"
          },
          token,
          isAdmin: true
        }
      });
    }

    // Regular user login - Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Welcome back to the royal court!",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use"
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "banana-meow-secret-key-2024");

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
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

// @desc    Verify admin token
// @route   GET /api/auth/admin/verify
// @access  Admin
export async function verifyToken(req, res) {
  // If we get here, the token is valid (middleware already verified)
  res.json({ valid: true, admin: req.admin });
}
