import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ["image", "images", "video", "reel"],
    required: true
  },
  mediaUrls: {
    type: [String],
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
