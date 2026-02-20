import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Calendar, ArrowLeft, Play, Sparkles, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE, getImageUrl } from "../lib/api.js";

export default function GalleryDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const autoScrollIntervalRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);
  const AUTO_SCROLL_DELAY = 4000; // 4 seconds

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/gallery/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          // Handle both old format (array of IDs) and new format (array of objects)
          const likesArray = data.likes || [];
          setLikeCount(likesArray.length);
          if (user && likesArray.length > 0) {
            const userId = user._id || user.id;
            // Check if likes is array of objects with userId, or array of IDs (backward compatibility)
            const isLiked = likesArray.some(like => {
              if (typeof like === 'object' && like.userId) {
                return like.userId.toString() === userId.toString();
              }
              return like.toString() === userId.toString();
            });
            setLiked(isLiked);
          }
          setCurrentMediaIndex(0);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, user]);

  // Auto-scroll carousel for multiple files
  useEffect(() => {
    if (!post || !post.mediaUrls || post.mediaUrls.length <= 1) {
      // Clear interval if single file or no post
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    // Reset to first media when post changes
    setCurrentMediaIndex(0);

    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    // Start new auto-scroll interval
    autoScrollIntervalRef.current = setInterval(() => {
      setCurrentMediaIndex((prevIndex) => {
        return (prevIndex + 1) % post.mediaUrls.length;
      });
    }, AUTO_SCROLL_DELAY);

    // Cleanup on unmount or post change
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
    };
  }, [post, post?.mediaUrls?.length]);

  // Function to handle manual navigation (resets timer)
  const handleManualNavigation = (e, newIndex) => {
    // Prevent any default behavior (form submission, navigation, etc.)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setCurrentMediaIndex(newIndex);
    
    // Clear existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Clear any pending timeout (from previous manual navigation)
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
      autoScrollTimeoutRef.current = null;
    }

    // Only restart if we have multiple files
    if (post && post.mediaUrls && post.mediaUrls.length > 1) {
      // Restart timer after full delay
      autoScrollTimeoutRef.current = setTimeout(() => {
        if (post && post.mediaUrls && post.mediaUrls.length > 1) {
          autoScrollIntervalRef.current = setInterval(() => {
            setCurrentMediaIndex((prevIndex) => {
              return (prevIndex + 1) % post.mediaUrls.length;
            });
          }, AUTO_SCROLL_DELAY);
        }
        autoScrollTimeoutRef.current = null;
      }, AUTO_SCROLL_DELAY);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/gallery/${id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-royal/20 border-t-royal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink/60">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-royal text-xl font-semibold">Memory not found</p>
          <Link to="/gallery" className="text-ink/60 hover:text-royal mt-2 inline-block">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-200 scale-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-royal" />
            </div>
            <h3 className="text-2xl font-bold text-royal text-center mb-2">
              Login Required
            </h3>
            <p className="text-ink/60 text-center mb-6">
              Please login to like this precious memory! 💜
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8">
        {/* Scrapbook decorations */}
        <div className="floating-shape floating-shape-1 -right-20 top-40" />
        <div className="floating-shape floating-shape-2 -left-16 top-80" />

        {/* Back button */}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-royal hover:text-ink transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Gallery
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Media */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-soft border-4 border-white bg-white p-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-cream/50 to-white/50 rounded-lg overflow-hidden relative">
                {post.mediaUrls && post.mediaUrls.length > 1 ? (
                  // Carousel for multiple files
                  <div className="relative">
                    {post.mediaType === "video" || post.mediaType === "reel" ? (
                      <video
                        src={getImageUrl(post.mediaUrls[currentMediaIndex])}
                        controls
                        className="w-full h-auto transition-opacity duration-500"
                        style={{ maxHeight: "600px", objectFit: "contain" }}
                        key={`video-${post._id}`}
                      />
                    ) : (
                      <img
                        src={getImageUrl(post.mediaUrls[currentMediaIndex])}
                        alt={`${post.title} ${currentMediaIndex + 1}`}
                        className="w-full h-auto transition-opacity duration-500"
                        style={{ objectFit: "contain" }}
                        key={`image-${post._id}`}
                      />
                    )}
                    
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={(e) => handleManualNavigation(e, (currentMediaIndex - 1 + post.mediaUrls.length) % post.mediaUrls.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Previous media"
                    >
                      <ChevronLeft className="h-5 w-5 text-royal" />
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={(e) => handleManualNavigation(e, (currentMediaIndex + 1) % post.mediaUrls.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Next media"
                    >
                      <ChevronRight className="h-5 w-5 text-royal" />
                    </button>
                    
                    {/* Media Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      {post.mediaUrls.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={(e) => handleManualNavigation(e, index)}
                          className={`transition-all duration-300 ${
                            index === currentMediaIndex
                              ? "w-2.5 h-2.5 rounded-full bg-royal"
                              : "w-2 h-2 rounded-full bg-royal/40 hover:bg-royal/60"
                          }`}
                          aria-label={`Go to media ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single file display
                  <>
                    {post.mediaType === "video" || post.mediaType === "reel" ? (
                      <video
                        src={getImageUrl(post.mediaUrls[0])}
                        controls
                        className="w-full h-auto"
                        style={{ maxHeight: "600px", objectFit: "contain" }}
                      />
                    ) : (
                      <img
                        src={getImageUrl(post.mediaUrls[0])}
                        alt={post.title}
                        className="w-full h-auto"
                        style={{ objectFit: "contain" }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Decorative stickers */}
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-banana-200 opacity-60 blur-sm" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-lilac opacity-60 blur-sm" />
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Title card */}
            <div className="card-cute p-[3px]">
              <div className="bg-white rounded-[2rem] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-banana-50 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="h-5 w-5 text-banana-400" />
                    <Sparkles className="h-4 w-4 text-lilac" />
                  </div>
                  <h1 className="text-3xl font-bold text-royal mb-4">{post.title}</h1>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 text-ink/60 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(post.createdAt)}</span>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      liked
                        ? "bg-coral text-white shadow-warm hover:bg-coral/90"
                        : "bg-gradient-to-r from-blush to-coral/20 text-royal hover:shadow-soft"
                    }`}
                  >
                    <Heart className={`h-5 w-5 transition-all ${liked ? "fill-white" : ""}`} />
                    <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="card-cute p-[3px]">
              <div className="bg-white rounded-[2rem] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-banana-400" />
                  <h2 className="text-lg font-bold text-royal">Story</h2>
                </div>
                <p className="text-ink/70 leading-relaxed whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
