# Gallery File Upload System

## Setup

The Gallery system now uses actual file uploads instead of URLs.

### Backend Configuration

1. Add to your `.env` file:
```
BACKEND_URL=http://localhost:5000
```

2. The system automatically creates `backend/uploads/gallery/` directory for storing files.

3. Files are served via: `http://localhost:5000/uploads/gallery/filename.jpg`

### File Types Supported

**Images**: JPG, PNG, GIF, WEBP  
**Videos**: MP4, MOV, AVI, WEBM  
**Max File Size**: 50MB per file

### Upload Limits

- Single Image: 1 file
- Multiple Images: Up to 10 files
- Video/Reel: 1 file

### How It Works

1. Admin uploads files via the admin panel
2. Files are stored in `backend/uploads/gallery/`
3. Filenames are automatically generated: `timestamp-randomnumber.ext`
4. URLs are saved to MongoDB
5. Files are automatically deleted when posts are deleted or updated

### Security

- Only admins can upload files (requires `adminToken`)
- File type validation on both frontend and backend
- File size limits enforced
- File extensions validated

### Production Deployment

For production, consider:
- Using cloud storage (AWS S3, Cloudinary, etc.)
- CDN for faster delivery
- Image optimization/compression
- Video transcoding for different qualities

### Troubleshooting

**Uploads folder not found:**
- The system auto-creates it, but ensure write permissions

**Files not serving:**
- Check `BACKEND_URL` in `.env`
- Ensure backend server is running
- Check uploads folder exists

**Large files failing:**
- Check the 50MB limit in `backend/src/middleware/upload.js`
- Adjust `fileSize` limit if needed
