import Gallery from "../models/Gallery.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: safely delete a file (no-throw if missing or already deleted)
function safeUnlink(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    // Silently ignore – file may have already been removed
    console.warn(`Could not delete file (may not exist): ${filePath}`);
  }
}

// Helper: extract filename from a full URL
function filenameFromUrl(url) {
  if (!url) return null;
  return url.split("/").pop();
}

// Helper: resolve the on-disk path for a gallery file URL
// Handles multiple URL formats: full URLs, relative paths, and different base paths
function galleryFilePath(url) {
  if (!url) return null;
  
  const name = filenameFromUrl(url);
  if (!name) return null;
  
  // Try multiple possible locations for backward compatibility
  const possiblePaths = [
    path.join(__dirname, "../../uploads/gallery", name), // Current standard location
    path.join(__dirname, "../../uploads", name), // Old location (root uploads/)
  ];
  
  // Return the first path that exists, or default to gallery/ if none exist
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  
  // If file doesn't exist, return the standard gallery path (will be safely handled by safeUnlink)
  return possiblePaths[0];
}

// Helper: normalize post data for backward compatibility
function normalizePost(post) {
  if (!post) return post;
  
  // Ensure mediaUrls is always an array
  if (!post.mediaUrls || !Array.isArray(post.mediaUrls)) {
    post.mediaUrls = [];
  }
  
  // Ensure thumbnailUrl exists or defaults to first media file
  if (!post.thumbnailUrl && post.mediaUrls.length > 0) {
    post.thumbnailUrl = post.mediaUrls[0];
  }
  
  return post;
}

// Get all gallery posts
export async function getAllPosts(req, res) {
  try {
    const posts = await Gallery.find().sort({ createdAt: -1 });
    // Normalize all posts for backward compatibility
    const normalizedPosts = posts.map(post => {
      const postObj = post.toObject ? post.toObject() : post;
      return normalizePost(postObj);
    });
    res.json(normalizedPosts);
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
    const postObj = post.toObject ? post.toObject() : post;
    res.json(normalizePost(postObj));
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

    // Ensure gallery directory exists
    const galleryDir = path.join(__dirname, "../../uploads/gallery");
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true });
    }

    // Separate media files from thumbnail
    const mediaFiles = req.files.media || [];
    const thumbnailFile = req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;

    // Move uploaded files from uploads/ to uploads/gallery/
    const allFiles = [...mediaFiles, ...(thumbnailFile ? [thumbnailFile] : [])];
    for (const file of allFiles) {
      const oldPath = path.join(__dirname, "../../uploads", file.filename);
      const newPath = path.join(galleryDir, file.filename);
      // Only move if source exists and destination doesn't (avoid errors)
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

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
    // Clean up uploaded files on error (check both locations)
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        safeUnlink(path.join(__dirname, "../../uploads", file.filename));
        safeUnlink(path.join(__dirname, "../../uploads/gallery", file.filename));
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

    // Ensure mediaUrls exists and is an array (backward compatibility)
    if (!post.mediaUrls || !Array.isArray(post.mediaUrls)) {
      post.mediaUrls = [];
    }

    // Separate media files from thumbnail
    // req.files is an object when using upload.fields(): { media: [files], thumbnail: [files] }
    const mediaFiles = req.files && req.files.media ? req.files.media : [];
    const thumbnailFile = req.files && req.files.thumbnail && req.files.thumbnail.length > 0 ? req.files.thumbnail[0] : null;

    // Ensure gallery directory exists
    const galleryDir = path.join(__dirname, "../../uploads/gallery");
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true });
    }

    // Move new files from uploads/ to uploads/gallery/
    const allNewFiles = [...mediaFiles, ...(thumbnailFile ? [thumbnailFile] : [])];
    for (const file of allNewFiles) {
      const oldPath = path.join(__dirname, "../../uploads", file.filename);
      const newPath = path.join(galleryDir, file.filename);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

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
        const oldFp = galleryFilePath(post.thumbnailUrl);
        if (oldFp) safeUnlink(oldFp);
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
    
    const postObj = post.toObject ? post.toObject() : post;
    res.json(normalizePost(postObj));
  } catch (error) {
    // Clean up uploaded files on error (check both locations)
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        safeUnlink(path.join(__dirname, "../../uploads", file.filename));
        safeUnlink(path.join(__dirname, "../../uploads/gallery", file.filename));
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
      const fp = galleryFilePath(post.thumbnailUrl);
      if (fp) safeUnlink(fp);
    }

    // Reset thumbnail to first media file or empty
    post.thumbnailUrl = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[0] : "";
    
    await post.save();
    
    const postObj = post.toObject ? post.toObject() : post;
    res.json(normalizePost(postObj));
  } catch (error) {
    res.status(500).json({ message: "Error deleting thumbnail", error: error.message });
  }
}

// Update single file in post (admin only)
export async function updateFile(req, res) {
  try {
    const fileIndex = parseInt(req.body.fileIndex, 10);
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Ensure mediaUrls exists and is an array (backward compatibility)
    if (!post.mediaUrls || !Array.isArray(post.mediaUrls) || post.mediaUrls.length === 0) {
      return res.status(400).json({ message: "Post has no media files to update" });
    }

    if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= post.mediaUrls.length) {
      return res.status(400).json({ 
        message: `Invalid file index. Post has ${post.mediaUrls.length} file(s), index must be between 0 and ${post.mediaUrls.length - 1}.` 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Ensure gallery directory exists
    const galleryDir = path.join(__dirname, "../../uploads/gallery");
    if (!fs.existsSync(galleryDir)) {
      fs.mkdirSync(galleryDir, { recursive: true });
    }

    // Move new file from uploads/ to uploads/gallery/
    const oldUploadPath = path.join(__dirname, "../../uploads", req.file.filename);
    const newUploadPath = path.join(galleryDir, req.file.filename);
    if (fs.existsSync(oldUploadPath)) {
      fs.renameSync(oldUploadPath, newUploadPath);
    }

    // Delete old file (safe — won't crash if missing)
    const oldUrl = post.mediaUrls[fileIndex];
    const oldFp = galleryFilePath(oldUrl);
    if (oldFp) safeUnlink(oldFp);

    // Generate new URL
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newUrl = `${baseUrl}/uploads/gallery/${req.file.filename}`;
    
    // Replace file at specific index
    post.mediaUrls[fileIndex] = newUrl;
    
    // Update thumbnail if it was the replaced file
    if (post.thumbnailUrl === oldUrl) {
      post.thumbnailUrl = newUrl;
    }
    
    await post.save();
    
    const postObj = post.toObject ? post.toObject() : post;
    res.json(normalizePost(postObj));
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      safeUnlink(path.join(__dirname, "../../uploads", req.file.filename));
      safeUnlink(path.join(__dirname, "../../uploads/gallery", req.file.filename));
    }
    res.status(500).json({ message: "Error updating file", error: error.message });
  }
}

// Delete single file from post (admin only)
export async function deleteFile(req, res) {
  try {
    const fileIndex = parseInt(req.body.fileIndex, 10);
    const post = await Gallery.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Gallery post not found" });
    }

    // Ensure mediaUrls exists and is an array (backward compatibility)
    if (!post.mediaUrls || !Array.isArray(post.mediaUrls) || post.mediaUrls.length === 0) {
      return res.status(400).json({ message: "Post has no media files to delete" });
    }

    if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= post.mediaUrls.length) {
      return res.status(400).json({ 
        message: `Invalid file index. Post has ${post.mediaUrls.length} file(s), index must be between 0 and ${post.mediaUrls.length - 1}.` 
      });
    }

    // Delete file from filesystem (safe — won't crash if missing)
    const urlToDelete = post.mediaUrls[fileIndex];
    const fp = galleryFilePath(urlToDelete);
    if (fp) safeUnlink(fp);

    // Remove from array
    post.mediaUrls.splice(fileIndex, 1);
    
    // Update thumbnail if it was the deleted file
    if (post.thumbnailUrl === urlToDelete) {
      post.thumbnailUrl = post.mediaUrls.length > 0 ? post.mediaUrls[0] : "";
    }
    
    await post.save();
    
    const postObj = post.toObject ? post.toObject() : post;
    res.json(normalizePost(postObj));
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

    // Delete associated media files (safe — won't crash if missing)
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      post.mediaUrls.forEach(url => {
        const fp = galleryFilePath(url);
        if (fp) safeUnlink(fp);
      });
    }

    // Delete thumbnail if it's separate from media files
    if (post.thumbnailUrl && !post.mediaUrls.includes(post.thumbnailUrl)) {
      const fp = galleryFilePath(post.thumbnailUrl);
      if (fp) safeUnlink(fp);
    }

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
    // Handle both old format (array of ObjectIds) and new format (array of objects)
    // Find if user already liked
    let likeIndex = -1;
    if (post.likes && post.likes.length > 0) {
      // Check if it's new format (array of objects) or old format (array of IDs)
      if (typeof post.likes[0] === 'object' && post.likes[0].userId) {
        // New format: array of objects with userId
        likeIndex = post.likes.findIndex(like => 
          like.userId && like.userId.toString() === userId.toString()
        );
      } else {
        // Old format: array of ObjectIds - migrate to new format
        likeIndex = post.likes.findIndex(likeId => 
          likeId.toString() === userId.toString()
        );
        // If found in old format, convert all likes to new format
        if (likeIndex > -1 || post.likes.length > 0) {
          post.likes = post.likes.map(likeId => ({
            userId: likeId,
            likedAt: new Date() // Use current date for migrated likes
          }));
          likeIndex = post.likes.findIndex(like => 
            like.userId.toString() === userId.toString()
          );
        }
      }
    }
    
    if (likeIndex > -1) {
      // Unlike - remove the like object
      post.likes.splice(likeIndex, 1);
    } else {
      // Like - add new like object with timestamp
      post.likes.push({
        userId: userId,
        likedAt: new Date()
      });
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
