import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, Heart, Play, Images as ImagesIcon, Film, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../lib/api.js";
import { FloatingCats } from "../components/CatDecorations.jsx";

const POSTS_PER_PAGE = 9;

export default function GalleryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;
  const page = Math.min(currentPage, totalPages);
  const paginatedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case "images":
        return <ImagesIcon className="h-5 w-5" />;
      case "video":
        return <Play className="h-5 w-5" />;
      case "reel":
        return <Film className="h-5 w-5" />;
      default:
        return <Camera className="h-5 w-5" />;
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8">
      {/* Floating cat silhouettes */}
      <FloatingCats count={4} />
      
      {/* Enhanced Scrapbook Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-30 mix-blend-multiply" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`
      }} />

      {/* Decorative scrapbook elements */}
      <div className="absolute top-20 left-8 w-6 h-6 opacity-40 transform -rotate-12">
        <Heart className="w-full h-full text-coral fill-coral/50" />
      </div>
      <div className="absolute top-32 right-12 w-5 h-5 opacity-30 transform rotate-45">
        <Sparkles className="w-full h-full text-banana-400" />
      </div>
      <div className="absolute bottom-40 left-16 w-4 h-4 opacity-35 transform rotate-12">
        <Heart className="w-full h-full text-blush fill-blush/60" />
      </div>
      <div className="absolute top-96 right-20 w-5 h-5 opacity-25 transform -rotate-6">
        <Sparkles className="w-full h-full text-lilac" />
      </div>

      {/* Scrapbook Header with handwritten style */}
      <div className="mb-16 text-center relative" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
        {/* Decorative border around title */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 border-2 border-dashed border-coral/30 rounded-3xl transform -rotate-1" />
          <h1 className="relative text-5xl md:text-6xl font-bold mb-2 px-8 py-4" style={{
            fontFamily: "'Pacifico', 'Brush Script MT', cursive",
            color: '#E85D75',
            textShadow: '2px 2px 0px rgba(255,255,255,0.8), 3px 3px 8px rgba(232,93,117,0.2)',
            letterSpacing: '0.02em'
          }}>
            The Royal Scrapbook
          </h1>
        </div>
        
        {/* Small heart decoration */}
        <div className="absolute -top-2 -right-4 md:right-auto md:left-1/2 md:ml-40">
          <Heart className="w-8 h-8 text-coral fill-coral/40 animate-pulse" />
        </div>
      </div>

      {/* Loading State with scrapbook style */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block relative">
            <div className="bg-white p-4 rounded-sm shadow-lg transform -rotate-1">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-cream/50 to-lilac/30 grid place-items-center border-2 border-dashed border-royal/20">
                <div className="relative">
                  <Camera className="h-16 w-16 text-royal/40 animate-pulse" />
                  <div className="absolute inset-0 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
                </div>
              </div>
            </div>
            {/* Decorative tape */}
            <div className="absolute -top-2 right-8 w-16 h-6 bg-gradient-to-br from-amber-100/80 to-amber-200/70 rounded-sm shadow-sm transform rotate-6" />
          </div>
          <p className="text-royal/70 mt-8 font-medium text-lg">Loading memories...</p>
        </div>
      )}

      {/* Gallery Grid with scrapbook photo frames */}
      {!loading && posts.length > 0 && (
        <>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {paginatedPosts.map((post, index) => {
            // Random subtle rotation for each photo
            const rotation = (index % 2 === 0 ? 1 : -1) * (1 + (index % 3));
            const hoverRotation = rotation > 0 ? -0.5 : 0.5;
            
            return (
              <Link
                key={post._id}
                to={`/gallery/${post._id}`}
                className="group relative block"
                style={{ 
                  animation: `slide-up-fade 0.5s ease-out ${0.08 * index}s backwards`,
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* Scrapbook photo frame with thick white border */}
                <div 
                  className="relative bg-white p-3 md:p-4 rounded-sm transition-all duration-400 cursor-pointer"
                  style={{
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.parentElement.style.transform = `rotate(${hoverRotation}deg) translateY(-8px) scale(1.03)`;
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.parentElement.style.transform = `rotate(${rotation}deg)`;
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Photo content */}
                  <div className="aspect-square overflow-hidden bg-cream/30 relative">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    
                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.1) 100%)'
                    }} />
                    
                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                      <p className="text-white font-semibold text-sm text-center drop-shadow-lg">{post.title}</p>
                    </div>

                    {/* Media type badge */}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1.5 shadow-md">
                      <div className="text-royal flex items-center gap-1">
                        {getMediaIcon(post.mediaType)}
                      </div>
                    </div>

                    {/* Like count */}
                    {post.likes && post.likes.length > 0 && (
                      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 fill-coral text-coral" />
                        <span className="text-xs font-bold text-royal">{post.likes.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative tape pieces at corners */}
                <div 
                  className="absolute -top-1 left-1/4 w-14 h-5 bg-gradient-to-br from-amber-100/80 to-amber-200/70 rounded-sm shadow-sm pointer-events-none" 
                  style={{
                    transform: 'rotate(-5deg)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <div 
                  className="absolute -top-1 right-1/4 w-14 h-5 bg-gradient-to-br from-amber-100/80 to-amber-200/70 rounded-sm shadow-sm pointer-events-none" 
                  style={{
                    transform: 'rotate(5deg)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-banana-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="px-4 py-2.5 text-sm text-ink/70 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-banana-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        </>
      )}

      {/* Empty State with scrapbook style */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block relative">
            {/* Polaroid-style empty frame */}
            <div className="bg-white p-4 rounded-sm shadow-lg transform rotate-2">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-cream/50 to-banana-50/30 grid place-items-center border-2 border-dashed border-royal/20">
                <Camera className="h-16 w-16 text-royal/30" />
              </div>
              <p className="mt-3 text-sm text-ink/60 font-medium">No memories yet...</p>
            </div>
            {/* Corner tape */}
            <div className="absolute -top-2 left-8 w-16 h-6 bg-gradient-to-br from-amber-100/80 to-amber-200/70 rounded-sm shadow-sm transform -rotate-12" />
          </div>
          <p className="text-lg font-semibold text-royal mt-8">The scrapbook is waiting for its first entry!</p>
        </div>
      )}
    </section>
  );
}
