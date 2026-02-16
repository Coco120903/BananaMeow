import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration (same as general upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);
    cb(null, `${nameWithoutExt}_${timestamp}${ext}`);
  }
});

// Gallery file filter — allows images AND videos
const galleryFileFilter = (req, file, cb) => {
  const allowedMimes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    // Videos
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    "video/mpeg",
    "video/ogg"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed: JPG, PNG, WEBP, GIF, AVIF, MP4, MOV, AVI, WEBM.`
      ),
      false
    );
  }
};

// Gallery multer configuration — higher file size limit for videos
const galleryUpload = multer({
  storage,
  fileFilter: galleryFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for gallery (videos can be large)
  }
});

export default galleryUpload;
