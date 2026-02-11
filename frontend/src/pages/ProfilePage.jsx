import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api.js";
import {
  User, Crown, Mail, Lock, Settings, Camera, Edit2, Trash2, Eye, EyeOff,
  ShoppingBag, Heart, Star, Calendar, CheckCircle, XCircle, AlertCircle,
  Loader2, Sparkles, Shield, Gift, Image as ImageIcon, ArrowRight, ChevronLeft, ChevronRight
} from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/imageCrop.js";

export default function ProfilePage() {
  const { user, token, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Profile image states
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [imageFile, setImageFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Activity history states
  const [activities, setActivities] = useState({
    orders: [],
    donations: [],
    likedPosts: []
  });
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activeTab, setActiveTab] = useState("purchases");
  const [pagination, setPagination] = useState({
    purchases: 1,
    donations: 1,
    likedPosts: 1
  });

  // Account deletion states
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load user profile and activities
  useEffect(() => {
    loadProfile();
    loadActivities();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data?.user) {
          setProfileImage(data.data.user.profileImage || "");
        }
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch(`${API_BASE}/api/profile/activity`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || { orders: [], donations: [], likedPosts: [] });
      }
    } catch (err) {
      console.error("Failed to load activities:", err);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Image upload and crop handlers
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (jpg, jpeg, png, or webp)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!croppedAreaPixels) {
      setError("Please adjust the crop area");
      return;
    }

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      if (!croppedImage) {
        setError("Failed to process image");
        return;
      }
      
      // Convert to blob and upload
      const blob = await fetch(croppedImage).then(r => r.blob());
      const formData = new FormData();
      formData.append("image", blob, "profile.jpg");

      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_BASE}/api/profile/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfileImage(data.data.profileImage);
        setImageError(false);
        setShowCropModal(false);
        setImageSrc(null);
        setImageFile(null);
        setSuccess("Profile image updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        // Update user in context
        await updateProfile({});
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm("Are you sure you want to remove your profile image?")) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE}/api/profile/remove-image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfileImage("");
        setSuccess("Profile image removed successfully!");
        setTimeout(() => setSuccess(""), 3000);
        await updateProfile({});
      } else {
        setError(data.message || "Failed to remove image");
      }
    } catch (err) {
      setError("Failed to remove image");
    } finally {
      setLoading(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setError("Please type DELETE exactly to confirm");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE}/api/profile/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        // Logout and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      } else {
        setError(data.message || "Failed to delete account");
      }
    } catch (err) {
      setError("Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirm("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const [imageError, setImageError] = useState(false);

  // Pagination helpers
  const itemsPerPage = 5;
  const getPaginatedItems = (items, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };
  const getTotalPages = (items) => Math.ceil(items.length / itemsPerPage);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 top-20 right-10" />
      <div className="floating-shape floating-shape-2 bottom-40 left-10" />

      {/* Header */}
      <div className="flex flex-col gap-3 pb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
            Profile Settings
          </p>
          <Settings className="h-4 w-4 text-royal" />
        </div>
        <h1 className="text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
          Your Royal Profile
          <Crown className="h-8 w-8 text-banana-400" />
        </h1>
        <p className="text-base text-ink/70 md:text-lg max-w-xl">
          Manage your account settings and view your activity history.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 rounded-2xl bg-mint/10 border border-mint/20 px-4 py-3 text-sm text-royal flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="mb-6 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-royal/10 shadow-soft">
            {profileImage && !imageError ? (
              <img
                src={`${API_BASE}${profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-banana-100 to-lilac/50 flex items-center justify-center">
                <User className="h-24 w-24 md:h-28 md:w-28 text-royal/60" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 justify-center w-full max-w-md mx-auto">
          <label className="btn-secondary text-xs md:text-sm cursor-pointer flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 flex-1 justify-center min-w-0">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onFileChange}
              className="hidden"
            />
            <Camera className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
            <span className="truncate">Upload</span>
          </label>
          {profileImage && (
            <>
              <button
                type="button"
                onClick={() => {
                  // Reopen crop modal with existing image
                  if (profileImage) {
                    setImageSrc(`${API_BASE}${profileImage}`);
                    setShowCropModal(true);
                  }
                }}
                className="btn-secondary text-xs md:text-sm flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 flex-1 justify-center min-w-0"
              >
                <Edit2 className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn-secondary text-xs md:text-sm text-coral hover:bg-coral/10 flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 flex-1 justify-center min-w-0"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                <span>Remove</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Basic Account Information */}
      <div className="card-cute p-[3px] mb-6">
        <div className="rounded-[1.85rem] bg-white p-6">
          <h2 className="text-xl font-semibold text-royal mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-banana-400" />
            Account Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Username
              </label>
              <div className="rounded-xl bg-royal/5 px-4 py-3 text-royal font-medium">
                {user?.name || "N/A"}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-xl bg-royal/5 px-4 py-3 text-ink/60 cursor-not-allowed"
              />
              <p className="text-xs text-ink/40 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                Date Joined
              </label>
              <div className="rounded-xl bg-royal/5 px-4 py-3 text-royal font-medium">
                {formatDate(user?.createdAt)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4" />
                Account Status
              </label>
              <div className="flex items-center gap-2 rounded-xl bg-mint/10 px-4 py-3">
                <CheckCircle className="h-4 w-4 text-mint" />
                <span className="text-royal font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="card-cute p-[3px] mb-6">
        <div className="rounded-[1.85rem] bg-white p-6">
          <h2 className="text-xl font-semibold text-royal mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-banana-400" />
            Change Password
          </h2>
          
          {/* Password-specific error/success messages */}
          {passwordSuccess && (
            <div className="mb-4 rounded-2xl bg-mint/10 border border-mint/20 px-4 py-3 text-sm text-royal flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mb-4 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {passwordError}
            </div>
          )}
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-royal/10 px-4 py-3 pr-12 focus:outline-none focus:border-royal/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal"
                >
                  {showCurrentPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-royal/10 px-4 py-3 pr-12 focus:outline-none focus:border-royal/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal"
                >
                  {showNewPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-ink/40 mt-1">Must be at least 6 characters</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-ink/60 flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-royal/10 px-4 py-3 pr-12 focus:outline-none focus:border-royal/30"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal"
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* User Activity History */}
      <div className="card-cute p-[3px] mb-6">
        <div className="rounded-[1.85rem] bg-white p-6">
          <h2 className="text-xl font-semibold text-royal mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-banana-400" />
            Activity History
          </h2>
          
          {loadingActivities ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-royal" />
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex items-center justify-between mb-6 border-b border-royal/10 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("purchases");
                    setPagination(prev => ({ ...prev, purchases: 1 }));
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === "purchases"
                      ? "bg-gradient-to-r from-banana-100 to-lilac/40 text-royal shadow-soft"
                      : "text-ink/60 hover:text-royal hover:bg-royal/5"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Purchase History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("donations");
                    setPagination(prev => ({ ...prev, donations: 1 }));
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === "donations"
                      ? "bg-gradient-to-r from-blush/30 to-coral/20 text-royal shadow-soft"
                      : "text-ink/60 hover:text-royal hover:bg-royal/5"
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  Donation History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("likedPosts");
                    setPagination(prev => ({ ...prev, likedPosts: 1 }));
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === "likedPosts"
                      ? "bg-gradient-to-r from-banana-100 to-lilac/40 text-royal shadow-soft"
                      : "text-ink/60 hover:text-royal hover:bg-royal/5"
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Liked Posts
                </button>
              </div>

              {/* Purchase History Content */}
              {activeTab === "purchases" && (
                <div>
                  {activities.orders && activities.orders.length > 0 ? (
                    <>
                      <div className="space-y-3 mb-4">
                        {getPaginatedItems(activities.orders, pagination.purchases).map((order) => (
                          <div
                            key={order._id}
                            className="rounded-xl bg-royal/5 p-5 border border-royal/10 hover:shadow-soft transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm font-semibold text-royal mb-1">
                                  {formatDate(order.createdAt)}
                                </p>
                                <p className="text-xs text-ink/60">
                                  {order.items?.length || 0} item(s)
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-bold text-royal mb-1">
                                  ${order.total?.toFixed(2) || "0.00"}
                                </p>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  order.status === "completed" 
                                    ? "bg-mint/20 text-mint" 
                                    : order.status === "pending"
                                    ? "bg-banana-100 text-royal"
                                    : "bg-ink/10 text-ink/60"
                                }`}>
                                  {order.status || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {getTotalPages(activities.orders) > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, purchases: Math.max(1, prev.purchases - 1) }))}
                            disabled={pagination.purchases === 1}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm text-ink/70">
                            Page {pagination.purchases} of {getTotalPages(activities.orders)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, purchases: Math.min(getTotalPages(activities.orders), prev.purchases + 1) }))}
                            disabled={pagination.purchases === getTotalPages(activities.orders)}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-ink/50 py-8 text-center">No purchase history yet</p>
                  )}
                </div>
              )}

              {/* Donation History Content */}
              {activeTab === "donations" && (
                <div>
                  {activities.donations && activities.donations.length > 0 ? (
                    <>
                      <div className="space-y-3 mb-4">
                        {getPaginatedItems(activities.donations, pagination.donations).map((donation) => (
                          <div
                            key={donation._id}
                            className="rounded-xl bg-blush/10 p-5 border border-coral/10 hover:shadow-soft transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm font-semibold text-royal mb-1">
                                  {donation.cat}
                                </p>
                                <p className="text-xs text-ink/60">
                                  {donation.type} • {donation.frequency}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-bold text-coral mb-1">
                                  ${donation.amount?.toFixed(2) || "0.00"}
                                </p>
                                <p className="text-xs text-ink/50">
                                  {formatDate(donation.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {getTotalPages(activities.donations) > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, donations: Math.max(1, prev.donations - 1) }))}
                            disabled={pagination.donations === 1}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm text-ink/70">
                            Page {pagination.donations} of {getTotalPages(activities.donations)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, donations: Math.min(getTotalPages(activities.donations), prev.donations + 1) }))}
                            disabled={pagination.donations === getTotalPages(activities.donations)}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-ink/50 py-8 text-center">No donation history yet</p>
                  )}
                </div>
              )}

              {/* Liked Posts Content */}
              {activeTab === "likedPosts" && (
                <div>
                  {activities.likedPosts && activities.likedPosts.length > 0 ? (
                    <>
                      <div className="space-y-3 mb-4">
                        {getPaginatedItems(activities.likedPosts, pagination.likedPosts).map((post) => (
                          <button
                            key={post._id}
                            onClick={() => navigate(`/gallery/${post._id}`)}
                            className="w-full text-left rounded-xl bg-banana-50 p-5 border border-banana-200 hover:bg-banana-100 hover:shadow-soft transition-all"
                          >
                            <div className="flex items-center gap-4">
                              {(post.thumbnailUrl || (post.mediaUrls && post.mediaUrls.length > 0)) && (
                                <img
                                  src={post.thumbnailUrl || post.mediaUrls[0]}
                                  alt={post.title}
                                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-royal mb-1 truncate">{post.title}</p>
                                <div className="flex items-center gap-2 text-xs text-ink/50">
                                  <Star className="h-3 w-3" />
                                  <span>Liked on {formatDate(post.likedAt || post.createdAt)}</span>
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 text-ink/40 flex-shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                      {getTotalPages(activities.likedPosts) > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, likedPosts: Math.max(1, prev.likedPosts - 1) }))}
                            disabled={pagination.likedPosts === 1}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm text-ink/70">
                            Page {pagination.likedPosts} of {getTotalPages(activities.likedPosts)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setPagination(prev => ({ ...prev, likedPosts: Math.min(getTotalPages(activities.likedPosts), prev.likedPosts + 1) }))}
                            disabled={pagination.likedPosts === getTotalPages(activities.likedPosts)}
                            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-ink/50 py-8 text-center">No liked posts yet</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="card-cute p-[3px] mb-6 border-2 border-coral/20">
        <div className="rounded-[1.85rem] bg-white p-6">
          <h2 className="text-xl font-semibold text-coral mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Delete Account
          </h2>
          
          <p className="text-sm text-ink/70 mb-4">
            Once you delete your account, it will be archived and you will not be able to log in again.
            All your data will be preserved but inaccessible.
          </p>
          
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn-secondary text-sm text-coral hover:bg-coral/10 border-coral/20 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold text-royal mb-4">Crop Profile Picture</h3>
            <div className="relative w-full h-96 mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-semibold text-ink/60">Zoom:</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCropModal(false);
                  setImageSrc(null);
                  setImageFile(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-coral mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Confirm Account Deletion
            </h3>
            <p className="text-sm text-ink/70 mb-4">
              This action cannot be undone. Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              className="w-full rounded-xl border border-coral/20 px-4 py-3 mb-4 focus:outline-none focus:border-coral"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirm !== "DELETE"}
                className="btn-secondary flex-1 text-coral hover:bg-coral/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
