import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      lowercase: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      trim: true,
      default: ""
    },
    imageUrl: { 
      type: String, 
      default: "" 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for faster lookups
categorySchema.index({ name: 1 });

export default mongoose.model("Category", categorySchema);
