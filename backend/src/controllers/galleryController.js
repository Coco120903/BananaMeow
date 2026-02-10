import Gallery from "../models/Gallery.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all gallery posts
export async function getAllPosts(req, res) {
  try {
    const posts = await Gallery.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery posts", error: error.message });
  }
}

// Get single gallery post
export async function getPost(req, res) {
  try {
    const post = await Gallery.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery post", error: error.message });
  }
}

// Create gallery post (admin only) with file upload
export async function createPost(req, res) {
  try {
    const { title, description, mediaType } = req.body;
    
    // req.files is an object when using upload.fields(): { media: [files], thumbnail: [files] }
    if (!req.files || (!req.files.media || req.files.media.length === 0)) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Separate media files from thumbnail
    const mediaFiles = req.files.media || [];
    const thumbnailFile = req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;

    // Generate URLs for uploaded files
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const mediaUrls = mediaFiles.map(file => `${baseUrl}/uploads/gallery/${file.filename}`);
    
    // Use custom thumbnail if provided, otherwise use first media file
    let thumbnailUrl = mediaUrls[0]; // Default to first media file
    if (thumbnailFile) {
      thumbnailUrl = `${baseUrl}/uploads/gallery/${thumbnailFile.filename}`;
    }
    
    const post = await Gallery.create({
      title,
      description,
      mediaType,
      mediaUrls,
      thumbnailUrl
    });
    
    res.status(201).json(post);
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      // req.files is an object when using upload.fields()
      Object.values(req.files).flat().forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    res.status(500).json({ message: "Error creating gallery post", error: error.message });
  }
}

// Update gallery post (admin only) with optional file upload
export async function updatePost(req, res) {
  try {
    const { title, description, mediaType } = req.body;
    
    const post = await Gallery.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Separate media files from thumbnail
    // req.files is an object when using upload.fields(): { media: [files], thumbnail: [files] }
    const mediaFiles = req.files && req.files.media ? req.files.media : [];
    const thumbnailFile = req.files && req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;

    // If new media files uploaded, append them to existing files (do not replace)
    if (mediaFiles.length > 0) {
      // Generate URLs for new files
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      const newMediaUrls = mediaFiles.map(file => `${baseUrl}/uploads/gallery/${file.filename}`);
      
      // Append new files to existing mediaUrls array (preserve existing files)
      post.mediaUrls = [...(post.mediaUrls || []), ...newMediaUrls];
      
      // Keep existing thumbnail or use first new file if no existing media
      if (!post.thumbnailUrl && newMediaUrls.length > 0) {
        post.thumbnailUrl = newMediaUrls[0];
      }
    }

    // Handle thumbnail upload/replacement
    if (thumbnailFile) {
      // Delete old thumbnail if it exists and is not in mediaUrls
      if (post.thumbnailUrl && !post.mediaUrls.includes(post.thumbnailUrl)) {
        const oldFilename = post.thumbnailUrl.split("/").pop();
        const oldFilePath = path.join(__dirname, "../../uploads/gallery", oldFilename);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("Error deleting old thumbnail:", err);
        });
      }

      // Set new thumbnail
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      post.thumbnailUrl = `${baseUrl}/uploads/gallery/${thumbnailFile.filename}`;
    }

    // Update fields
    post.title = title;
    post.description = description;
    post.mediaType = mediaType;
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      // req.files is an object when using upload.fields()
      Object.values(req.files).flat().forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    res.status(500).json({ message: "Error updating gallery post", error: error.message });
  }
}

// Delete thumbnail from post (admin only)
export async function deleteThumbnail(req, res) {
  try {
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Delete thumbnail file if it exists and is not in mediaUrls
    if (post.thumbnailUrl && !post.mediaUrls.includes(post.thumbnailUrl)) {
      const filename = post.thumbnailUrl.split("/").pop();
      const filePath = path.join(__dirname, "../../uploads/gallery", filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting thumbnail file:", err);
      });
    }

    // Reset thumbnail to first media file or empty
    post.thumbnailUrl = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[0] : "";
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error deleting thumbnail", error: error.message });
  }
}

// Update single file in post (admin only)
export async function updateFile(req, res) {
  try {
    const { fileIndex } = req.body;
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    if (fileIndex === undefined || fileIndex < 0 || fileIndex >= post.mediaUrls.length) {
      return res.status(400).json({ message: "Invalid file index" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old file
    const oldUrl = post.mediaUrls[fileIndex];
    const oldFilename = oldUrl.split("/").pop();
    const oldFilePath = path.join(__dirname, "../../uploads/gallery", oldFilename);
    fs.unlink(oldFilePath, (err) => {
      if (err) console.error("Error deleting old file:", err);
    });

    // Generate new URL
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newUrl = `${baseUrl}/uploads/gallery/${req.files[0].filename}`;
    
    // Replace file at specific index
    post.mediaUrls[fileIndex] = newUrl;
    
    // Update thumbnail if it was the replaced file
    if (post.thumbnailUrl === oldUrl) {
      post.thumbnailUrl = newUrl;
    }
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.files && req.files.length > 0) {
      fs.unlink(req.files[0].path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ message: "Error updating file", error: error.message });
  }
}

// Delete single file from post (admin only)
export async function deleteFile(req, res) {
  try {
    const { fileIndex } = req.body;
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    if (fileIndex === undefined || fileIndex < 0 || fileIndex >= post.mediaUrls.length) {
      return res.status(400).json({ message: "Invalid file index" });
    }

    // Delete file from filesystem
    const urlToDelete = post.mediaUrls[fileIndex];
    const filename = urlToDelete.split("/").pop();
    const filePath = path.join(__dirname, "../../uploads/gallery", filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Remove from array
    post.mediaUrls.splice(fileIndex, 1);
    
    // Update thumbnail if it was the deleted file
    if (post.thumbnailUrl === urlToDelete) {
      post.thumbnailUrl = post.mediaUrls.length > 0 ? post.mediaUrls[0] : "";
    }
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
}

// Delete gallery post (admin only)
export async function deletePost(req, res) {
  try {
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Delete associated files
    post.mediaUrls.forEach(url => {
      const filename = url.split("/").pop();
      const filePath = path.join(__dirname, "../../uploads/gallery", filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });

    await Gallery.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Gallery post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting gallery post", error: error.message });
  }
}

// Toggle like on post
export async function toggleLike(req, res) {
  try {
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }
    
    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.json({ 
      liked: likeIndex === -1,
      likeCount: post.likes.length 
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
}
