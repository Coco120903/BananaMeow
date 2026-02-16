import { Crown, Star, Heart, Sparkles, TrendingUp, Users, Gift, Shield, Quote, ChevronLeft, ChevronRight, Camera, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../lib/api.js";
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

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "These cats have brought so much joy to my life! The merchandise is top quality too.",
      author: "Sarah M.",
      role: "Royal Supporter"
    },
    {
      quote: "Best cat content on the internet. Nana's side-eye is legendary!",
      author: "James K.",
      role: "Premium Member"
    },
    {
      quote: "Supporting this kingdom was the best decision. The cats are absolutely adorable!",
      author: "Emily R.",
      role: "Monthly Donor"
    }
  ];
  const [current, setCurrent] = useState(0);

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
        
        <div className="relative max-w-3xl mx-auto">
          <div className="card-cute p-[2px] cat-face-card">
            <div className="rounded-[1.85rem] bg-white p-8 md:p-10 text-center">
              <Quote className="h-10 w-10 text-lilac/40 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-ink/80 leading-relaxed mb-6 transition-all duration-500">
                "{testimonials[current].quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
                  <span className="text-lg font-bold text-royal">
                    {testimonials[current].author.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-royal">{testimonials[current].author}</p>
                  <p className="text-sm text-ink/50">{testimonials[current].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center transition-all duration-300 hover:shadow-glow hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-royal" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
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
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center transition-all duration-300 hover:shadow-glow hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 text-royal" />
            </button>
          </div>
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
  const thumbnail = post.thumbnailUrl || (post.mediaUrls && post.mediaUrls[0]) || null;

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
