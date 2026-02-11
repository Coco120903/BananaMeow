import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    profileImage: {
      type: String,
      default: ""
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String,
      select: false // Don't include in queries by default
    },
    resetPasswordExpire: {
      type: Date,
      select: false
    },
    sessionVersion: {
      type: Number,
      default: 0
    },
    favoriteCats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cat"
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Skip if password hash is already done (from verification flow or password reset)
  if (this.$skipPasswordHash) {
    this.$skipPasswordHash = false; // Clear flag after use
    return next();
  }
  
  // Only hash the password if it's modified (or new) AND not already hashed
  if (!this.isModified("password")) {
    return next();
  }

  // Check if password is already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  // This prevents double-hashing if password is already hashed
  if (this.password && /^\$2[ayb]\$.{56}$/.test(this.password)) {
    console.log(`[AUTH] Password already hashed for user ${this._id}, skipping hash`);
    return next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(`[AUTH] Password hashed for user ${this._id}, hash length: ${this.password.length}`);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    console.log(`[AUTH] Password comparison failed: missing candidate or stored password`);
    return false;
  }

  // Trim and normalize input
  const trimmedPassword = candidatePassword.trim();
  
  // Verify stored password is a valid bcrypt hash
  if (!/^\$2[ayb]\$.{56}$/.test(this.password)) {
    console.error(`[AUTH] Invalid password hash format for user ${this._id}, hash length: ${this.password?.length || 0}`);
    return false;
  }

  const isMatch = await bcrypt.compare(trimmedPassword, this.password);
  
  // Log comparison result (without exposing password)
  console.log(`[AUTH] Password comparison for user ${this._id}: ${isMatch ? 'MATCH' : 'NO MATCH'}, hash exists: ${!!this.password}, hash length: ${this.password?.length || 0}`);
  
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export default User;
