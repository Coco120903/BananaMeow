import { Crown, Star, Heart, Sparkles, TrendingUp, Users, Gift, Shield, Quote, ChevronLeft, ChevronRight, Camera, ArrowRight, Send, LogIn, Loader2, Cat } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE, getImageUrl } from "../lib/api.js";
import HeroSection from "../components/HeroSection.jsx";
import OriginStory from "../components/OriginStory.jsx";
import CTASection from "../components/CTASection.jsx";
import { WhiskerDivider, FloatingCats, PawTrail, CatEars } from "../components/CatDecorations.jsx";

// Announcement Banner Component
function AnnouncementBanner() {
  const announcements = [
    "New Spring Collection Now Available",
    "Free Shipping on Orders Over $50",
    "Join Royal Membership for 10% Off"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-royal via-royal/90 to-royal py-2.5">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-center gap-3">
        <span className="text-sm">🐾</span>
        <Sparkles className="h-4 w-4 text-banana-300 animate-pulse" />
        <p className="text-sm font-medium text-white text-center transition-all duration-500">
          {announcements[current]}
        </p>
        <Sparkles className="h-4 w-4 text-banana-300 animate-pulse" />
        <span className="text-sm">🐾</span>
      </div>
    </div>
  );
}

// Stats Section Component
function StatsSection() {
  const stats = [
    { icon: Crown, value: "12", label: "Royal Cats", color: "from-banana-100 to-banana-200" },
    { icon: Users, value: "5K+", label: "Supporters", color: "from-lilac to-blush" },
    { icon: Heart, value: "100%", label: "Love Given", color: "from-blush to-coral/30" },
    { icon: Gift, value: "500+", label: "Products", color: "from-mint to-sky/30" }
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-8">
      <FloatingCats count={3} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="feature-card hover-bounce text-center cat-face-card purr-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-soft`}>
                <Icon className="h-8 w-8 text-royal" />
              </div>
              <p className="stat-number">{stat.value}</p>
              <p className="text-sm text-ink/60 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Star Rating Display
function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? "text-banana-400 fill-banana-400" : "text-ink/20"}`}
        />
      ))}
    </div>
  );
}

// Interactive Star Rating Input
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="p-0.5 transition-transform hover:scale-125"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              s <= (hover || value)
                ? "text-banana-400 fill-banana-400"
                : "text-ink/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const { user, isAuthenticated, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type, message }

  // Fallback testimonials when no approved reviews exist
  const fallbackTestimonials = [
    { quote: "These cats have brought so much joy to my life! The merchandise is top quality too.", author: "Sarah M.", role: "Royal Supporter", rating: 5 },
    { quote: "Best cat content on the internet. Nana's side-eye is legendary!", author: "James K.", role: "Premium Member", rating: 5 },
    { quote: "Supporting this kingdom was the best decision. The cats are absolutely adorable!", author: "Emily R.", role: "Monthly Donor", rating: 5 }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/site-reviews/approved?limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(
              data.reviews.map((r) => ({
                _id: r._id,
                quote: r.message,
                author: r.username,
                role: r.title || "Royal Supporter",
                rating: r.rating,
                profileImage: r.profileImage,
                createdAt: r.createdAt
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) return;
    if (formRating === 0) {
      setSubmitResult({ type: "error", message: "Please select a star rating" });
      return;
    }
    if (!formMessage.trim()) {
      setSubmitResult({ type: "error", message: "Please write your review message" });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/site-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: formRating,
          title: formTitle.trim(),
          message: formMessage.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult({ type: "success", message: data.message || "Your review has been sent for royal approval 👑" });
        setFormRating(0);
        setFormTitle("");
        setFormMessage("");
        setTimeout(() => setShowForm(false), 3000);
      } else {
        setSubmitResult({ type: "error", message: data.message || "Failed to submit review" });
      }
    } catch {
      setSubmitResult({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-lilac/20 to-banana-100/20 blur-3xl pointer-events-none" />
      
      <div className="relative">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-transparent to-banana-400" />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
              Royal Reviews
            </p>
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-transparent" />
          </div>
          <h2 className="text-3xl font-bold text-royal md:text-4xl flex items-center justify-center gap-3">
            What Our Supporters Say
            <Star className="h-7 w-7 text-banana-400 fill-banana-200 animate-wiggle" />
          </h2>
        </div>
        
        {/* Review Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {loadingReviews ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-10 h-10 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
            </div>
          ) : displayReviews.length > 0 ? (
            <>
              <div className="card-cute p-[2px] cat-face-card">
                <div className="rounded-[1.85rem] bg-white p-8 md:p-10 text-center">
                  <Quote className="h-10 w-10 text-lilac/40 mx-auto mb-4" />

                  {/* Star rating */}
                  {displayReviews[current].rating && (
                    <div className="flex justify-center mb-3">
                      <StarDisplay rating={displayReviews[current].rating} />
                    </div>
                  )}

                  <p className="text-lg md:text-xl text-ink/80 leading-relaxed mb-6 transition-all duration-500">
                    &ldquo;{displayReviews[current].quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {displayReviews[current].profileImage ? (
                      <img
                        src={
                          displayReviews[current].profileImage.startsWith("http")
                            ? displayReviews[current].profileImage
                            : `${API_BASE}${displayReviews[current].profileImage.startsWith("/") ? "" : "/"}${displayReviews[current].profileImage}`
                        }
                        alt={displayReviews[current].author}
                        className="h-12 w-12 rounded-full object-cover border-2 border-banana-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
                        <span className="text-lg font-bold text-royal">
                          {displayReviews[current].author.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-royal">{displayReviews[current].author}</p>
                      <p className="text-sm text-ink/50">{displayReviews[current].role}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrent((prev) => (prev - 1 + displayReviews.length) % displayReviews.length)}
                  className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center transition-all duration-300 hover:shadow-glow hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5 text-royal" />
                </button>
                <div className="flex gap-2">
                  {displayReviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === current ? 'w-8 bg-royal' : 'w-2.5 bg-royal/20 hover:bg-royal/40'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrent((prev) => (prev + 1) % displayReviews.length)}
                  className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center transition-all duration-300 hover:shadow-glow hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5 text-royal" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-ink/50 text-lg">
                No royal reviews yet. Be the first to share your experience! 🐾
              </p>
            </div>
          )}
        </div>

        {/* Submit Review Section */}
        <div className="max-w-3xl mx-auto mt-10">
          {!isAuthenticated ? (
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-banana-100 to-lilac/30 text-royal font-medium hover:shadow-glow transition-all duration-300"
              >
                <LogIn className="h-4 w-4" />
                <Cat className="h-4 w-4" />
                Please log in to leave a royal review
              </Link>
            </div>
          ) : !showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-royal to-royal/90 text-white font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Star className="h-4 w-4" />
                Share Your Royal Review
              </button>
            </div>
          ) : (
            <div className="card-cute p-[2px]">
              <form
                onSubmit={handleSubmit}
                className="rounded-[1.85rem] bg-white p-6 md:p-8 space-y-5"
              >
                <h3 className="text-lg font-semibold text-royal text-center">
                  Share Your Experience
                </h3>

                {/* Rating */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-ink/60">Your Rating</p>
                  <StarInput value={formRating} onChange={setFormRating} />
                </div>

                {/* Title (optional) */}
                <div>
                  <label className="block text-sm text-ink/60 mb-1">
                    Title <span className="text-ink/30">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    maxLength={100}
                    placeholder="e.g. Amazing experience!"
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-royal/30 text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-ink/60 mb-1">
                    Your Review <span className="text-coral">*</span>
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Tell us about your experience with Banana Meow..."
                    className="w-full px-4 py-2.5 rounded-xl border border-ink/10 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-royal/30 text-sm resize-none"
                    required
                  />
                  <p className="text-xs text-ink/40 text-right mt-1">
                    {formMessage.length}/1000
                  </p>
                </div>

                {/* Result message */}
                {submitResult && (
                  <div
                    className={`text-center text-sm font-medium px-4 py-2.5 rounded-xl ${
                      submitResult.type === "success"
                        ? "bg-mint/30 text-emerald-700"
                        : "bg-blush/50 text-coral"
                    }`}
                  >
                    {submitResult.message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSubmitResult(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-ink/10 text-ink/60 text-sm hover:bg-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal to-royal/90 text-white text-sm font-medium hover:shadow-glow transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "100% to Cats",
      description: "Every donation goes directly to caring for our royal felines."
    },
    {
      icon: TrendingUp,
      title: "Premium Quality",
      description: "Our merchandise is crafted with love and the finest materials."
    },
    {
      icon: Heart,
      title: "Join the Kingdom",
      description: "Become part of our growing community of cat enthusiasts."
    }
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="feature-card hover-tilt p-6 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative inline-block mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/50 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8 text-royal" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-banana-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-semibold text-royal mb-2">{feature.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Gallery Teaser — Latest Royal Moment
function GalleryTeaser() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Posts are returned sorted by createdAt desc
            setPost(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load gallery teaser:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || !post) return null;

  const likeCount = post.likes?.length || 0;
  const displayDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const thumbnail = getImageUrl(post.thumbnailUrl || (post.mediaUrls && post.mediaUrls[0]) || null);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 md:px-8">
      {/* Section Label */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-transparent to-banana-400" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
            Latest Royal Moment
          </p>
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-transparent" />
        </div>
        <h2 className="text-3xl font-bold text-royal md:text-4xl flex items-center justify-center gap-3">
          From the Scrapbook
          <Camera className="h-7 w-7 text-banana-400" />
        </h2>
      </div>

      {/* Teaser Card */}
      <Link
        to="/gallery"
        className="group block max-w-3xl mx-auto"
      >
        <div className="card-cute p-[2px]">
          <div className="rounded-[1.85rem] bg-white overflow-hidden card-shine relative">
            {/* Decorative tape */}
            <div className="absolute -top-1 left-8 w-16 h-6 bg-banana-200/70 rounded-b-sm z-10"
              style={{ transform: "rotate(-3deg)" }}
            />
            <div className="absolute -top-1 right-10 w-14 h-5 bg-lilac/40 rounded-b-sm z-10"
              style={{ transform: "rotate(2deg)" }}
            />

            <div className="flex flex-col md:flex-row">
              {/* Left — Image */}
              <div className="relative md:w-[45%] aspect-square md:aspect-auto md:min-h-[260px] overflow-hidden bg-cream/40">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-banana-100 to-lilac/30">
                    <Camera className="h-16 w-16 text-royal/30" />
                  </div>
                )}
                {/* Subtle vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.08) 100%)"
                  }}
                />
                {/* Like badge */}
                {likeCount > 0 && (
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-md flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 fill-coral text-coral" />
                    <span className="text-xs font-bold text-royal">{likeCount}</span>
                  </div>
                )}
              </div>

              {/* Right — Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-banana-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                    {displayDate}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-royal mb-3 leading-snug group-hover:text-royal/80 transition-colors">
                  {post.title}
                </h3>

                {post.description && (
                  <p className="text-sm text-ink/60 leading-relaxed mb-5 line-clamp-3">
                    {post.description}
                  </p>
                )}

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-royal group-hover:gap-3 transition-all duration-300">
                  <span>Explore Royal Moments</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <HeroSection />
      <WhiskerDivider />
      <StatsSection />
      <GalleryTeaser />
      <WhiskerDivider />
      <OriginStory />
      <FeaturesSection />
      <WhiskerDivider />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
