import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cat, Heart, Crown, Sparkles, Star, Filter, Search, Award, Zap, Coffee, Moon, Sun, X } from "lucide-react";
import { catBios } from "../content/catBios.js";
import { API_BASE } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { FloatingCats, WhiskerDivider, PawTrail } from "../components/CatDecorations.jsx";

const traitIcons = {
  default: Sparkles,
  lazy: Moon,
  playful: Zap,
  curious: Search,
  regal: Crown,
  sleepy: Coffee,
  sweet: Heart
};

const traitColors = [
  "from-blush/60 to-coral/20",
  "from-lilac/60 to-royal/15",
  "from-banana-100 to-banana-200/50",
  "from-mint/50 to-sky/30",
  "from-peach/50 to-blush/30"
];

export default function CatsPage() {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [likedCats, setLikedCats] = useState({});
  const [hoveredCat, setHoveredCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrait, setFilterTrait] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState({});

  useEffect(() => {
    const loadCats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/cats`);
        if (!response.ok) {
          throw new Error("Failed to load cats");
        }
        const data = await response.json();
        setCats(data);
      } catch (error) {
        setCats([]);
      }
    };

    loadCats();
  }, []);

  // Load user's favorites when authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated || !token) return;

      try {
        const response = await fetch(`${API_BASE}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const favoritesMap = {};
          (data.data?.favoriteCats || []).forEach((cat) => {
            favoritesMap[cat._id] = true;
          });
          setLikedCats(favoritesMap);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, [isAuthenticated, token]);

  const toggleLike = async (catId, catName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!token) {
      setShowLoginModal(true);
      return;
    }
    
    // Prevent multiple clicks
    if (loadingFavorites[catId]) return;
    
    setLoadingFavorites(prev => ({ ...prev, [catId]: true }));
    
    try {
      const response = await fetch(`${API_BASE}/api/favorites/${catId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setLikedCats(prev => ({
          ...prev,
          [catId]: data.data.isFavorited
        }));
      } else {
        const errorData = await response.json();
        console.error("Failed to toggle favorite:", errorData.message);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [catId]: false }));
    }
  };

  const handleProceedToLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowLoginModal(false);
  };

  const list = cats.length > 0 ? cats : catBios;
  
  const filteredList = list.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTrait === "all" || (cat.traits || []).some(t => t.toLowerCase().includes(filterTrait.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  // Separate main cats (Bane, Nana, Angela) from others - in specific order
  const mainCatsOrder = ["Bane", "Nana", "Angela"];
  const highlightedCats = mainCatsOrder
    .map(name => filteredList.find(cat => cat.name === name))
    .filter(Boolean); // Remove undefined if cat not found
  const otherCats = filteredList.filter(cat => !mainCatsOrder.includes(cat.name));

  const allTraits = [...new Set(list.flatMap(cat => cat.traits || []))];

  return (
    <>
      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-200 scale-100">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-cream hover:bg-blush/30 grid place-items-center transition-colors"
            >
              <X className="h-4 w-4 text-ink/60" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-royal" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-royal text-center mb-2">
              Login Required
            </h3>
            <p className="text-ink/60 text-center mb-6">
              Please login to save your favorite cats and show them some love! 💜
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToLogin}
                className="flex-1 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating cat silhouettes */}
      <FloatingCats count={6} />
      
      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1 -right-20 top-40" />
      <div className="floating-shape floating-shape-2 -left-16 top-80" />
      <div className="floating-shape floating-shape-3 right-1/4 bottom-20" />
      
      {/* Header */}
      <div className="mb-10" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
            <Cat className="h-4 w-4 text-royal" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/50">
            Meet the 12 Cats
          </p>
        </div>
        <h1 className="text-3xl font-bold text-royal md:text-4xl lg:text-5xl flex items-center gap-4 flex-wrap">
          <span className="text-gradient">The Chonky Royal Court</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-banana-200 to-banana-100 grid place-items-center shadow-soft">
              <Crown className="h-5 w-5 text-royal" />
            </div>
          </div>
        </h1>
        <p className="text-base text-ink/60 md:text-lg mt-4 max-w-2xl">
          Each royal comes with a title, a personality, and a slightly dramatic
          fun fact. Click the heart to show your appreciation for these majestic fluffballs.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-row sm:flex-row gap-2 sm:gap-4" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s backwards' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-ink/30 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-2 border-royal/10 bg-white pl-9 sm:pl-11 pr-3 sm:pr-5 py-2.5 sm:py-3.5 text-sm sm:text-base text-ink transition-all duration-300 focus:outline-none focus:border-royal/30 focus:shadow-[0_0_0_4px_rgba(90,62,133,0.1)] placeholder:text-ink/40"
          />
        </div>
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-ink/30 pointer-events-none z-10" />
          <select
            value={filterTrait}
            onChange={(e) => setFilterTrait(e.target.value)}
            className="w-full rounded-2xl border-2 border-royal/10 bg-white pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3.5 text-sm sm:text-base text-ink transition-all duration-300 focus:outline-none focus:border-royal/30 focus:shadow-[0_0_0_4px_rgba(90,62,133,0.1)] appearance-none cursor-pointer sm:min-w-[180px]"
          >
            <option value="all">All Traits</option>
            {allTraits.map(trait => (
              <option key={trait} value={trait}>{trait}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 flex flex-wrap gap-4" style={{ animation: 'slide-up-fade 0.5s ease-out 0.15s backwards' }}>
        <div className="badge-soft">
          <Cat className="h-3.5 w-3.5 text-royal" />
          <span className="text-royal">{filteredList.length} Royals</span>
        </div>
        <div className="badge-soft">
          <Heart className="h-3.5 w-3.5 text-coral fill-coral" />
          <span className="text-royal">{Object.values(likedCats).filter(Boolean).length} Favorites</span>
        </div>
        <div className="badge-golden">
          <Award className="h-3.5 w-3.5 text-royal" />
          <span className="text-royal">All British Shorthairs</span>
        </div>
      </div>

      {/* Main Cats Section - Bane, Nana, Angela */}
      {highlightedCats.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-banana-100 to-lilac/40 border border-royal/10 whiskers whiskers-sm">
              <Crown className="h-4 w-4 text-royal" />
              <span className="text-sm font-bold text-royal uppercase tracking-wider">The Founding Royals</span>
              <Crown className="h-4 w-4 text-royal" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedCats.map((cat, index) => (
              <article
                key={cat.name ?? index}
                className="card-cute p-[2px] group relative"
                onMouseEnter={() => setHoveredCat(cat.name)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{ animation: `slide-up-fade 0.5s ease-out ${0.05 * index}s backwards` }}
              >
                {/* Special border highlight for main cats */}
                <div className="absolute -inset-[2px] rounded-[1.9rem] bg-gradient-to-r from-royal/20 via-banana-200/30 to-lilac/20 opacity-60 blur-sm -z-10"></div>
                <div className="flex h-full flex-col rounded-[1.85rem] bg-white card-shine relative overflow-hidden border-2 border-royal/10">
                  {/* Cat Image Area */}
                  <div className="relative aspect-square rounded-t-[1.7rem] bg-gradient-to-br from-royal/10 via-banana-50 to-lilac/30 overflow-hidden img-zoom">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 dots-pattern opacity-30" />
                    
                    {/* Cat image or placeholder */}
                    {cat.imageUrl ? (
                      <img
                        src={`${API_BASE}${cat.imageUrl}`}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`relative transition-all duration-500 ${hoveredCat === cat.name ? 'scale-110' : ''}`}>
                          <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm grid place-items-center shadow-soft">
                            <Cat className="h-12 w-12 text-royal" />
                          </div>
                          {hoveredCat === cat.name && (
                            <>
                              <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-banana-400" style={{ animation: 'sparkle-rotate 2s linear infinite' }} />
                              <Sparkles className="absolute -bottom-1 -left-3 h-4 w-4 text-lilac" style={{ animation: 'sparkle-rotate 2s linear infinite 0.5s' }} />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Like button */}
                    <button
                      onClick={(e) => toggleLike(cat._id || cat.name, cat.name, e)}
                      disabled={loadingFavorites[cat._id || cat.name]}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-soft grid place-items-center transition-all duration-300 hover:scale-110 ${likedCats[cat._id || cat.name] ? 'shadow-warm' : ''} ${loadingFavorites[cat._id || cat.name] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`h-5 w-5 transition-all duration-300 ${likedCats[cat._id || cat.name] ? 'fill-coral text-coral scale-110' : 'text-ink/30 hover:text-coral'}`} />
                    </button>
                    
                    {/* Featured badge for main cats */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-royal/90 to-royal/70 backdrop-blur-sm px-3 py-1.5 shadow-soft border border-white/20">
                      <Crown className="h-3.5 w-3.5 fill-banana-300 text-banana-300" />
                      <span className="text-xs font-semibold text-white">Founding Royal</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Name and Nickname */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                          {cat.name}
                          {likedCats[cat._id || cat.name] && (
                            <span className="w-5 h-5 rounded-full bg-coral/10 grid place-items-center">
                              <Heart className="h-3 w-3 fill-coral text-coral" />
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-ink/50 mt-0.5">British Shorthair</p>
                      </div>
                      <span className="badge-soft text-xs">
                        {cat.nickname}
                      </span>
                    </div>

                    {/* Traits */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-3.5 w-3.5 text-royal/50" />
                        <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Traits</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(cat.traits || []).map((trait, traitIndex) => (
                          <span
                            key={trait}
                            className={`rounded-lg bg-gradient-to-r ${traitColors[traitIndex % traitColors.length]} px-2.5 py-1 text-xs font-medium text-ink/70 transition-transform duration-200 hover:scale-105`}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 text-sm text-ink/60 flex-1">
                      {cat.personality && (
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-lilac/30 grid place-items-center flex-shrink-0 mt-0.5">
                            <Zap className="h-3.5 w-3.5 text-royal" />
                          </div>
                          <p><span className="font-semibold text-ink/80">Personality:</span> {cat.personality}</p>
                        </div>
                      )}
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-banana-100/50 grid place-items-center flex-shrink-0 mt-0.5">
                          <Star className="h-3.5 w-3.5 text-royal" />
                        </div>
                        <p><span className="font-semibold text-ink/80">Fun fact:</span> {cat.funFact}</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blush/30 grid place-items-center flex-shrink-0 mt-0.5">
                          <Heart className="h-3.5 w-3.5 text-royal" />
                        </div>
                        <p><span className="font-semibold text-ink/80">Favorite:</span> {cat.favoriteThing}</p>
                      </div>
                    </div>

                    {/* Support Button */}
                    <Link
                      to={`/donate?cat=${encodeURIComponent(cat.name)}`}
                      className="btn-cute mt-5 w-full text-center flex items-center justify-center gap-2 group/btn"
                    >
                      <Heart className="h-4 w-4 text-coral transition-all duration-300 group-hover/btn:fill-coral group-hover/btn:scale-110" />
                      <span className="relative z-10">Support {cat.name}</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Separator between main cats and others */}
      {highlightedCats.length > 0 && otherCats.length > 0 && (
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
          <div className="flex items-center gap-2">
            <Cat className="h-5 w-5 text-royal/40" />
            <span className="text-sm text-ink/40 font-medium">The Royal Court</span>
            <Cat className="h-5 w-5 text-royal/40" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
        </div>
      )}

      {/* Other Cats Grid */}
      {otherCats.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherCats.map((cat, index) => (
          <article
            key={cat.name ?? index}
            className="card-cute p-[2px] group"
            onMouseEnter={() => setHoveredCat(cat.name)}
            onMouseLeave={() => setHoveredCat(null)}
            style={{ animation: `slide-up-fade 0.5s ease-out ${0.05 * index}s backwards` }}
          >
            <div className="flex h-full flex-col rounded-[1.85rem] bg-white card-shine relative overflow-hidden">
              {/* Cat Image Area */}
              <div className="relative aspect-square rounded-t-[1.7rem] bg-gradient-to-br from-banana-50 via-lilac/20 to-blush/30 overflow-hidden img-zoom">
                {/* Decorative pattern */}
                <div className="absolute inset-0 dots-pattern opacity-30" />
                
                {/* Cat image or placeholder */}
                {cat.imageUrl ? (
                  <img
                    src={`${API_BASE}${cat.imageUrl}`}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`relative transition-all duration-500 ${hoveredCat === cat.name ? 'scale-110' : ''}`}>
                      <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm grid place-items-center shadow-soft">
                        <Cat className="h-12 w-12 text-royal" />
                      </div>
                      {hoveredCat === cat.name && (
                        <>
                          <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-banana-400" style={{ animation: 'sparkle-rotate 2s linear infinite' }} />
                          <Sparkles className="absolute -bottom-1 -left-3 h-4 w-4 text-lilac" style={{ animation: 'sparkle-rotate 2s linear infinite 0.5s' }} />
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Like button */}
                <button
                  onClick={(e) => toggleLike(cat._id || cat.name, cat.name, e)}
                  disabled={loadingFavorites[cat._id || cat.name]}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-soft grid place-items-center transition-all duration-300 hover:scale-110 ${likedCats[cat._id || cat.name] ? 'shadow-warm' : ''} ${loadingFavorites[cat._id || cat.name] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart className={`h-5 w-5 transition-all duration-300 ${likedCats[cat._id || cat.name] ? 'fill-coral text-coral scale-110' : 'text-ink/30 hover:text-coral'}`} />
                    </button>
                  </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-5">
                {/* Name and Nickname */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                      {cat.name}
                      {likedCats[cat._id || cat.name] && (
                        <span className="w-5 h-5 rounded-full bg-coral/10 grid place-items-center">
                          <Heart className="h-3 w-3 fill-coral text-coral" />
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-ink/50 mt-0.5">British Shorthair</p>
                  </div>
                  <span className="badge-soft text-xs">
                    {cat.nickname}
                  </span>
                </div>

                {/* Traits */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-royal/50" />
                    <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">Traits</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(cat.traits || []).map((trait, traitIndex) => (
                      <span
                        key={trait}
                        className={`rounded-lg bg-gradient-to-r ${traitColors[traitIndex % traitColors.length]} px-2.5 py-1 text-xs font-medium text-ink/70 transition-transform duration-200 hover:scale-105`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-sm text-ink/60 flex-1">
                  {cat.personality && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-lilac/30 grid place-items-center flex-shrink-0 mt-0.5">
                        <Zap className="h-3.5 w-3.5 text-royal" />
                      </div>
                      <p><span className="font-semibold text-ink/80">Personality:</span> {cat.personality}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-banana-100/50 grid place-items-center flex-shrink-0 mt-0.5">
                      <Star className="h-3.5 w-3.5 text-royal" />
                    </div>
                    <p><span className="font-semibold text-ink/80">Fun fact:</span> {cat.funFact}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blush/30 grid place-items-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3.5 w-3.5 text-royal" />
                    </div>
                    <p><span className="font-semibold text-ink/80">Favorite:</span> {cat.favoriteThing}</p>
                  </div>
                </div>

                {/* Support Button */}
                <Link
                  to={`/donate?cat=${encodeURIComponent(cat.name)}`}
                  className="btn-cute mt-5 w-full text-center flex items-center justify-center gap-2 group/btn"
                >
                  <Heart className="h-4 w-4 text-coral transition-all duration-300 group-hover/btn:fill-coral group-hover/btn:scale-110" />
                  <span className="relative z-10">Support {cat.name}</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
        </div>
      )}

      {/* Empty state */}
      {filteredList.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
            <Search className="h-8 w-8 text-royal/50" />
          </div>
          <p className="text-lg font-semibold text-royal">No cats found</p>
          <p className="text-ink/50 mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Footer message */}
      {filteredList.length > 0 && (
        <div className="mt-16 text-center" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
          <div className="inline-flex items-center gap-4 card-glass px-8 py-4">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-banana-100 to-lilac border-2 border-white shadow-sm grid place-items-center">
                  <Cat className="h-4 w-4 text-royal" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-royal">You have met all {filteredList.length} royals</p>
              <p className="text-xs text-ink/50">They approve of your presence</p>
            </div>
            <Crown className="h-6 w-6 text-banana-400" />
          </div>
        </div>
      )}
    </section>
    </>
  );
}
