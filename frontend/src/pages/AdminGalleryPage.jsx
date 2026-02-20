import { useState, useEffect, useCallback } from "react";
import { Camera, Edit2, Trash2, Plus, X, Save, Heart, Image as ImageIcon, Images as ImagesIcon, Video, Film, Upload, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import { API_BASE, getImageUrl } from "../lib/api.js";

// ── Themed Modal Component ──────────────────────────────────────────
function GalleryModal({ isOpen, onClose, type = "info", title, message, onConfirm, confirmText = "Yes", cancelText = "Cancel", children }) {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="h-8 w-8 text-green-500" />,
    error: <AlertTriangle className="h-8 w-8 text-coral" />,
    confirm: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    info: <Camera className="h-8 w-8 text-royal" />,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header accent bar */}
        <div className={`h-1.5 w-full ${
          type === "success" ? "bg-gradient-to-r from-green-400 to-emerald-500" :
          type === "error" ? "bg-gradient-to-r from-coral to-red-400" :
          type === "confirm" ? "bg-gradient-to-r from-amber-400 to-orange-400" :
          "bg-gradient-to-r from-royal to-lilac"
        }`} />

        <div className="p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-14 h-14 rounded-2xl grid place-items-center ${
              type === "success" ? "bg-green-50" :
              type === "error" ? "bg-red-50" :
              type === "confirm" ? "bg-amber-50" :
              "bg-cream"
            }`}>
              {iconMap[type]}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-royal mb-2">{title}</h3>

          {/* Message */}
          {message && (
            <p className="text-sm text-ink/60 leading-relaxed mb-5">{message}</p>
          )}

          {/* Custom content */}
          {children}

          {/* Buttons */}
          <div className="flex gap-3 mt-5">
            {type === "confirm" ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-royal/15 text-royal font-medium text-sm hover:bg-cream transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => { onConfirm?.(); onClose(); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-coral text-white font-medium text-sm hover:bg-coral/90 transition-colors shadow-sm"
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm ${
                  type === "success"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : type === "error"
                    ? "bg-coral text-white hover:bg-coral/90"
                    : "bg-royal text-white hover:bg-ink"
                }`}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Auto-dismiss toast for quick success feedback ───────────────────
function Toast({ isVisible, message, type = "success" }) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-[70] animate-in slide-in-from-top-2 fade-in">
      <div className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg border ${
        type === "success"
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}>
        {type === "success" ? (
          <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ── Main Admin Gallery Page ─────────────────────────────────────────
export default function AdminGalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingFileIndex, setEditingFileIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaType: "image"
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ isOpen: false, type: "info", title: "", message: "", onConfirm: null, confirmText: "Yes", cancelText: "Cancel" });
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  
  const postsPerPage = 9;

  // Helper: show a toast that auto-dismisses
  const showToast = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast({ isVisible: false, message: "", type: "success" }), 3000);
  }, []);

  // Helper: show a confirmation modal (returns a promise)
  const showConfirm = useCallback((title, message, confirmText = "Yes, Delete") => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        type: "confirm",
        title,
        message,
        confirmText,
        cancelText: "Cancel",
        onConfirm: () => resolve(true)
      });
      // If modal is closed without confirming, resolve false
      const originalOnClose = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        resolve(false);
      };
      setModal(prev => ({ ...prev, _onClose: originalOnClose }));
    });
  }, []);

  // Helper: show an error modal
  const showError = useCallback((title, message) => {
    setModal({ isOpen: true, type: "error", title, message, onConfirm: null, confirmText: "Yes", cancelText: "Cancel" });
  }, []);

  const closeModal = useCallback(() => {
    // Call the _onClose handler if it exists (for confirm promises)
    if (modal._onClose) {
      modal._onClose();
    } else {
      setModal(prev => ({ ...prev, isOpen: false }));
    }
  }, [modal]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({ url: reader.result, type: file.type });
        if (previews.length === files.length) {
          setFilePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleDeleteThumbnail = async () => {
    if (!editingPost) return;
    
    const confirmed = await showConfirm(
      "Delete Thumbnail?",
      "The post will use the first media file as the thumbnail instead.",
      "Yes, Delete"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_BASE}/api/gallery/${editingPost._id}/thumbnail`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setEditingPost(updatedPost);
        setThumbnailPreview(getImageUrl(updatedPost.thumbnailUrl || null));
        setThumbnailFile(null);
        loadPosts();
        showToast("Thumbnail removed successfully");
      } else {
        const err = await response.json().catch(() => ({}));
        showError("Delete Failed", err.message || "Could not delete the thumbnail. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting thumbnail:", error);
      showError("Network Error", "Unable to reach the server. Please check your connection.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0 && !editingPost) {
      showError("No Files Selected", "Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("adminToken");
    
    const submitFormData = new FormData();
    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("mediaType", formData.mediaType);
    
    selectedFiles.forEach(file => {
      submitFormData.append("media", file);
    });

    if (thumbnailFile) {
      submitFormData.append("thumbnail", thumbnailFile);
    }

    const url = editingPost
      ? `${API_BASE}/api/gallery/${editingPost._id}`
      : `${API_BASE}/api/gallery`;
    const method = editingPost ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitFormData
      });

      if (response.ok) {
        loadPosts();
        handleCloseForm();
        showToast(editingPost ? "Post updated successfully!" : "Post created successfully!");
      } else {
        const err = await response.json().catch(() => ({}));
        showError("Save Failed", err.message || "Failed to save post. Please try again.");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      showError("Network Error", "Unable to reach the server. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "Delete Gallery Post?",
      "This will permanently remove the post and all its media files. This action cannot be undone.",
      "Yes, Delete Post"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadPosts();
        showToast("Post deleted successfully");
      } else {
        const err = await response.json().catch(() => ({}));
        showError("Delete Failed", err.message || "Could not delete the post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showError("Network Error", "Unable to reach the server. Please check your connection.");
    }
  };

  const handleEditFile = (fileIndex) => {
    // Safety checks: ensure editingPost and mediaUrls exist
    if (!editingPost || !editingPost._id) {
      showError("Edit Error", "Post data is not available. Please refresh and try again.");
      return;
    }
    
    if (!editingPost.mediaUrls || !Array.isArray(editingPost.mediaUrls) || editingPost.mediaUrls.length === 0) {
      showError("Edit Error", "No files found in this post.");
      return;
    }
    
    if (fileIndex < 0 || fileIndex >= editingPost.mediaUrls.length) {
      showError("Edit Error", "Invalid file index. Please refresh and try again.");
      return;
    }
    
    setEditingFileIndex(fileIndex);
    const fileUrl = editingPost.mediaUrls[fileIndex] || "";
    const isImage = fileUrl && fileUrl.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = isImage ? "image/*" : "video/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        setEditingFileIndex(null);
        return;
      }

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setEditingFileIndex(null);
        showError("Authentication Error", "Please log in again.");
        return;
      }

      const fd = new FormData();
      fd.append("media", file);
      fd.append("fileIndex", String(fileIndex)); // Ensure it's a string for FormData

      try {
        const response = await fetch(`${API_BASE}/api/gallery/${editingPost._id}/file`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: fd
        });

        if (response.ok) {
          const updatedPost = await response.json();
          // Ensure updatedPost has the expected structure
          if (updatedPost && updatedPost.mediaUrls) {
            setEditingPost(updatedPost);
            setEditingFileIndex(null);
            loadPosts();
            showToast("File replaced successfully!");
          } else {
            throw new Error("Invalid response from server");
          }
        } else {
          const err = await response.json().catch(() => ({}));
          setEditingFileIndex(null);
          showError("Upload Failed", err.message || "Could not replace the file. Please try again.");
        }
      } catch (error) {
        console.error("Error updating file:", error);
        setEditingFileIndex(null);
        showError("Network Error", "Unable to reach the server. Please check your connection.");
      }
    };
    fileInput.click();
  };

  const handleDeleteFile = async (fileIndex) => {
    // Safety checks: ensure editingPost and mediaUrls exist
    if (!editingPost || !editingPost._id) {
      showError("Delete Error", "Post data is not available. Please refresh and try again.");
      return;
    }
    
    if (!editingPost.mediaUrls || !Array.isArray(editingPost.mediaUrls) || editingPost.mediaUrls.length === 0) {
      showError("Delete Error", "No files found in this post.");
      return;
    }
    
    if (fileIndex < 0 || fileIndex >= editingPost.mediaUrls.length) {
      showError("Delete Error", "Invalid file index. Please refresh and try again.");
      return;
    }

    const confirmed = await showConfirm(
      "Delete This File?",
      "This will permanently remove this file from the post. This action cannot be undone.",
      "Yes, Delete File"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      showError("Authentication Error", "Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/gallery/${editingPost._id}/file`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fileIndex: Number(fileIndex) }) // Ensure it's a number
      });

      if (response.ok) {
        const updatedPost = await response.json();
        // Ensure updatedPost has the expected structure
        if (updatedPost && Array.isArray(updatedPost.mediaUrls)) {
          setEditingPost(updatedPost);
          loadPosts();
          showToast("File deleted successfully");
        } else {
          throw new Error("Invalid response from server");
        }
      } else {
        const err = await response.json().catch(() => ({}));
        showError("Delete Failed", err.message || "Could not delete the file. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      showError("Network Error", "Unable to reach the server. Please check your connection.");
    }
  };

  const handleEdit = (post) => {
    // Safety checks: ensure post has required fields
    if (!post || !post._id) {
      showError("Edit Error", "Invalid post data. Please refresh and try again.");
      return;
    }

    // Ensure mediaUrls is always an array (backward compatibility)
    const safePost = {
      ...post,
      mediaUrls: Array.isArray(post.mediaUrls) ? post.mediaUrls : [],
      thumbnailUrl: post.thumbnailUrl || (post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[0] : null)
    };

    setEditingPost(safePost);
    setFormData({
      title: safePost.title || "",
      description: safePost.description || "",
      mediaType: safePost.mediaType || "image"
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setThumbnailFile(null);
    setThumbnailPreview(getImageUrl(safePost.thumbnailUrl || null));
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({
      title: "",
      description: "",
      mediaType: "image"
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const getMediaTypeIcon = (type) => {
    switch (type) {
      case "images": return <ImagesIcon className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "reel": return <Film className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getAcceptedFileTypes = () => {
    if (formData.mediaType === "video" || formData.mediaType === "reel") {
      return "video/*";
    }
    return "image/*";
  };

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} />

      {/* Themed Modal */}
      <GalleryModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <Camera className="w-7 h-7 text-royal" />
            Gallery Management
          </h1>
          <p className="text-ink/60">Manage scrapbook posts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal text-white hover:bg-ink transition-colors shadow-soft"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-royal/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-royal">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="w-8 h-8 rounded-lg hover:bg-cream transition-colors grid place-items-center"
              >
                <X className="h-5 w-5 text-ink/60" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border-2 border-royal/10 px-4 py-3 focus:outline-none focus:border-royal/30 transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border-2 border-royal/10 px-4 py-3 focus:outline-none focus:border-royal/30 transition-colors resize-none"
                  required
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">
                  Media Type
                </label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => {
                    setFormData({ ...formData, mediaType: e.target.value });
                    setSelectedFiles([]);
                    setFilePreviews([]);
                  }}
                  className="w-full rounded-xl border-2 border-royal/10 px-4 py-3 focus:outline-none focus:border-royal/30 transition-colors"
                >
                  <option value="image">Single Image</option>
                  <option value="images">Multiple Images</option>
                  <option value="video">Video</option>
                  <option value="reel">Reel</option>
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">
                  {editingPost ? "Upload New Files (optional)" : "Upload Files"}
                </label>
                <div className="border-2 border-dashed border-royal/20 rounded-xl p-6 text-center hover:border-royal/40 transition-colors">
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileSelect}
                    accept={getAcceptedFileTypes()}
                    multiple
                    className="hidden"
                    required={!editingPost}
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                      <Upload className="h-6 w-6 text-royal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-royal">
                        Click to upload {formData.mediaType === "images" ? "images" : formData.mediaType === "video" || formData.mediaType === "reel" ? "videos" : "files"}
                      </p>
                      <p className="text-xs text-ink/50 mt-1">
                        {formData.mediaType === "video" || formData.mediaType === "reel"
                          ? "MP4, MOV, AVI, WEBM (max 50MB each)"
                          : "JPG, PNG, GIF, WEBP, AVIF (max 50MB each)"}
                      </p>
                    </div>
                  </label>
                </div>

                {/* File Previews - Horizontal Layout */}
                {filePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-ink/60 mb-2">New files to upload:</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-cream">
                          {preview.type.startsWith("image/") ? (
                            <img src={preview.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <video src={preview.url} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current files for editing - Horizontal Layout with Edit/Delete */}
                {editingPost && editingPost.mediaUrls && Array.isArray(editingPost.mediaUrls) && editingPost.mediaUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-ink/60 mb-2">
                      {selectedFiles.length > 0 ? "Existing files (will be kept):" : "Current files:"}
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {editingPost.mediaUrls.map((url, index) => {
                        // Safety check: ensure url is a valid string
                        if (!url || typeof url !== "string") {
                          return (
                            <div key={index} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-cream flex items-center justify-center">
                              <span className="text-2xl opacity-40">🖼️</span>
                            </div>
                          );
                        }
                        
                        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i);
                        return (
                          <div key={`${editingPost._id}-${index}`} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-cream group">
                            {isImage ? (
                              <img
                                src={getImageUrl(url)}
                                alt={`Current ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  // Show placeholder icon if not already present
                                  if (!e.target.parentElement.querySelector(".placeholder-icon")) {
                                    const placeholder = document.createElement("div");
                                    placeholder.className = "placeholder-icon absolute inset-0 flex items-center justify-center text-2xl opacity-40";
                                    placeholder.innerHTML = "🖼️";
                                    e.target.parentElement.appendChild(placeholder);
                                  }
                                }}
                              />
                            ) : (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  if (!e.target.parentElement.querySelector(".placeholder-icon")) {
                                    const placeholder = document.createElement("div");
                                    placeholder.className = "placeholder-icon absolute inset-0 flex items-center justify-center text-2xl opacity-40";
                                    placeholder.innerHTML = "🎬";
                                    e.target.parentElement.appendChild(placeholder);
                                  }
                                }}
                              />
                            )}
                            {editingFileIndex === index && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                              <button
                                type="button"
                                onClick={() => handleEditFile(index)}
                                disabled={editingFileIndex === index}
                                className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Replace file"
                              >
                                <Edit2 className="h-3 w-3 text-royal" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(index)}
                                disabled={editingFileIndex === index}
                                className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete file"
                              >
                                <Trash2 className="h-3 w-3 text-coral" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">
                  Thumbnail (Optional)
                </label>
                {thumbnailPreview ? (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-cream border-2 border-royal/10">
                        <img
                          src={getImageUrl(thumbnailPreview)}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={editingPost && !thumbnailFile ? handleDeleteThumbnail : handleRemoveThumbnail}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-white hover:bg-coral/90 transition-colors flex items-center justify-center"
                        title={editingPost && !thumbnailFile ? "Delete thumbnail" : "Remove thumbnail"}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-ink/50 mt-2">
                      {editingPost && !thumbnailFile ? "Click upload area to replace or delete button to remove" : "Click upload area to replace"}
                    </p>
                  </div>
                ) : null}
                <div className="border-2 border-dashed border-royal/20 rounded-xl p-6 text-center hover:border-royal/40 transition-colors">
                  <input
                    type="file"
                    id="thumbnailInput"
                    onChange={handleThumbnailSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="thumbnailInput"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                      <ImageIcon className="h-6 w-6 text-royal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-royal">
                        {thumbnailPreview ? "Replace thumbnail" : "Click to upload thumbnail"}
                      </p>
                      <p className="text-xs text-ink/50 mt-1">
                        JPG, PNG, GIF, WEBP (max 50MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {editingPost ? "Update" : "Create"} Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-royal/20 border-t-royal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink/60">Loading posts...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentPosts.map((post) => (
            <div key={post._id} className="card-cute p-[2px]">
              <div className="bg-white rounded-xl overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-square overflow-hidden bg-cream">
                  {post.thumbnailUrl ? (
                    <img
                      src={getImageUrl(post.thumbnailUrl)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-ink/20" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-royal">
                    {getMediaTypeIcon(post.mediaType)}
                  </div>
                  {post.likes && post.likes.length > 0 && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Heart className="h-3 w-3 fill-coral text-coral" />
                      <span className="text-xs font-semibold text-royal">{post.likes.length}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-royal mb-1 text-sm line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-ink/60 mb-2 line-clamp-1">{post.description}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-cream text-royal hover:bg-royal/10 transition-colors text-xs"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-coral/10 text-coral hover:bg-coral hover:text-white transition-colors text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Pagination */}
          {!loading && posts.length > postsPerPage && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-sm text-ink/70">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4 shadow-soft">
            <Camera className="h-10 w-10 text-royal/50" />
          </div>
          <p className="text-lg font-semibold text-royal">No posts yet</p>
          <p className="text-ink/50 mt-1">Create your first gallery post!</p>
        </div>
      )}
    </div>
  );
}
