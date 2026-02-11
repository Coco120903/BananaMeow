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
  // Skip if password hash is already done (from verification flow)
  if (this.$skipPasswordHash) {
    return next();
  }
  
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
