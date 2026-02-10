import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cat, Heart, Crown, Sparkles, Star, Filter, Search, Award, Zap, Coffee, Moon, Sun } from "lucide-react";
import { catBios } from "../content/catBios.js";
import { API_BASE } from "../lib/api.js";

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
  const [cats, setCats] = useState([]);
  const [likedCats, setLikedCats] = useState({});
  const [hoveredCat, setHoveredCat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrait, setFilterTrait] = useState("all");

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

  const toggleLike = (catName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedCats(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const list = cats.length > 0 ? cats : catBios;
  
  const filteredList = list.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTrait === "all" || (cat.traits || []).some(t => t.toLowerCase().includes(filterTrait.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  const allTraits = [...new Set(list.flatMap(cat => cat.traits || []))];

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
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
      <div className="mb-8 flex flex-col sm:flex-row gap-4" style={{ animation: 'slide-up-fade 0.5s ease-out 0.1s backwards' }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/30" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-soft pl-12 w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/30" />
          <select
            value={filterTrait}
            onChange={(e) => setFilterTrait(e.target.value)}
            className="input-soft pl-12 pr-10 appearance-none cursor-pointer min-w-[180px]"
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

      {/* Cat Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredList.map((cat, index) => (
          <article
            key={cat.name ?? index}
            className="card-cute p-[2px] group"
            onMouseEnter={() => setHoveredCat(cat.name)}
            onMouseLeave={() => setHoveredCat(null)}
            style={{ animation: `slide-up-fade 0.5s ease-out ${0.05 * index}s backwards` }}
          >
            <div className="flex h-full flex-col rounded-[1.85rem] bg-white card-shine relative overflow-hidden">
              {/* Cat Image Area */}
              <div className="relative h-52 rounded-t-[1.7rem] bg-gradient-to-br from-banana-50 via-lilac/20 to-blush/30 overflow-hidden img-zoom">
                {/* Decorative pattern */}
                <div className="absolute inset-0 dots-pattern opacity-30" />
                
                {/* Cat icon */}
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
                
                {/* Like button */}
                <button
                  onClick={(e) => toggleLike(cat.name, e)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-soft grid place-items-center transition-all duration-300 hover:scale-110 ${likedCats[cat.name] ? 'shadow-warm' : ''}`}
                >
                  <Heart className={`h-5 w-5 transition-all duration-300 ${likedCats[cat.name] ? 'fill-coral text-coral scale-110' : 'text-ink/30 hover:text-coral'}`} />
                </button>
                
                {/* Featured badge */}
                {index < 3 && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-soft">
                    <Star className="h-3.5 w-3.5 fill-banana-400 text-banana-400" />
                    <span className="text-xs font-semibold text-royal">Featured</span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-5">
                {/* Name and Nickname */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                      {cat.name}
                      {likedCats[cat.name] && (
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
  );
}
