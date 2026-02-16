import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shirt, Sparkles, ShoppingBag, Crown, Star, Heart, ArrowRight, Cat, Gift, Tag, Percent, Image as ImageIcon } from "lucide-react";
import { API_BASE } from "../lib/api.js";
import { FloatingCats } from "../components/CatDecorations.jsx";

// Fallback categories if API fails
const fallbackCategories = [
  {
    id: "apparel",
    title: "Apparel",
    description: "Soft tees, hoodies, and royal everyday fits designed with love.",
    href: "/shop/apparel",
    icon: Shirt,
    accentIcon: Star,
    gradient: "from-banana-100 to-lilac/40",
    badge: "Popular"
  },
  {
    id: "cat-items",
    title: "Cat Items",
    description: "Premium toys, treats, and essentials for your chonky royalty.",
    href: "/shop/cat-items",
    icon: Cat,
    accentIcon: Heart,
    gradient: "from-blush to-coral/30",
    badge: "Best Sellers"
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Stickers, mugs, totes, and royal extras for everyday charm.",
    href: "/shop/accessories",
    icon: Gift,
    accentIcon: Sparkles,
    gradient: "from-lilac to-mint/40",
    badge: "New"
  }
];

// Map category names to shop routes
const getCategoryHref = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("apparel") || nameLower === "apparel") return "/shop/apparel";
  if (nameLower.includes("cat") || nameLower === "cat items" || nameLower === "cat-items") return "/shop/cat-items";
  if (nameLower.includes("accessor") || nameLower === "accessories") return "/shop/accessories";
  // Default: create URL-friendly path
  return `/shop/${nameLower.replace(/\s+/g, "-")}`;
};

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          // Map API categories to display format
          const mappedCategories = data.map((cat, index) => ({
            id: cat.name,
            title: cat.displayName,
            description: cat.description || fallbackCategories[index]?.description || "",
            href: getCategoryHref(cat.displayName),
            icon: fallbackCategories[index]?.icon || Tag,
            accentIcon: fallbackCategories[index]?.accentIcon || Star,
            gradient: fallbackCategories[index]?.gradient || "from-banana-100 to-lilac/40",
            badge: fallbackCategories[index]?.badge || "",
            imageUrl: cat.imageUrl
          }));
          setCategories(mappedCategories.length > 0 ? mappedCategories : fallbackCategories);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating cat silhouettes */}
      <FloatingCats count={4} />
      
      {/* Floating shape decorations */}
      <div className="floating-shape floating-shape-1 top-20 right-10" />
      <div className="floating-shape floating-shape-2 top-40 left-10" />
      <div className="floating-shape floating-shape-3 bottom-20 right-1/4" />
      
      <div className="flex flex-col gap-3 pb-10">
        <div className="flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
            Banana Meow Shop
          </p>
          <ShoppingBag className="h-4 w-4 text-banana-400 animate-wiggle" />
        </div>
        <h1 className="text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
          Merch fit for royalty
          <Crown className="h-8 w-8 text-banana-400 animate-wiggle" />
        </h1>
        <p className="text-base text-ink/70 md:text-lg max-w-xl">
          Apparel, cat items, and accessories curated by the royal court. Every purchase supports our 12 British Shorthairs.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const AccentIcon = category.accentIcon;
          return (
            <article
              key={category.id}
              className="card-cute p-[3px] group magnetic-hover cat-face-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-4 rounded-[1.8rem] bg-white p-6 h-full relative overflow-hidden card-shine">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                  <div className="absolute inset-0 dots-pattern" />
                </div>
                
                <div className={`relative flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} overflow-hidden`}>
                  {category.imageUrl ? (
                    <img
                      src={`${API_BASE}${category.imageUrl}`}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <Icon className="h-12 w-12 text-royal transition-all duration-500 group-hover:scale-125 group-hover:rotate-6" />
                  )}
                  
                  {/* Decorative elements */}
                  <Sparkles className="absolute top-3 right-3 h-5 w-5 text-banana-400 opacity-0 group-hover:opacity-100 group-hover:animate-sparkle transition-opacity" />
                  <Star className="absolute bottom-3 left-3 h-4 w-4 text-royal opacity-0 group-hover:opacity-100 transition-opacity fill-banana-200" />
                  
                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                    <AccentIcon className="h-4 w-4 text-royal" />
                  </div>
                  
                  {/* Badge */}
                  {category.badge && (
                    <span className="absolute top-3 right-3 badge-soft text-xs">
                      {category.badge}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-3 w-3 text-ink/40" />
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
                      Category
                    </p>
                  </div>
                  <h2 className="text-xl font-semibold text-royal flex items-center gap-2">
                    {category.title}
                    <Sparkles className="h-4 w-4 text-banana-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                <Link
                  to={category.href}
                  className="btn-cute text-sm text-center flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                >
                  <Heart className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity text-coral" />
                  View Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Promo banner */}
      <div className="mt-12 rounded-[2rem] gradient-border-animated p-8 md:p-10 shadow-soft relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-banana-50 via-lilac/20 to-blush/30 z-0" />
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-bl-[4rem]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-tr-[3rem]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft flex items-center justify-center pulse-notification">
              <Percent className="h-7 w-7 text-royal" />
            </div>
            <div>
              <p className="text-lg font-bold text-royal flex items-center gap-2 glow-text">
                Royal Members Get 10% Off
                <Star className="h-4 w-4 text-banana-400 fill-banana-200" />
              </p>
              <p className="text-sm text-ink/70">Join the kingdom and save on every order.</p>
            </div>
          </div>
          <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 group press-effect">
            <Crown className="h-4 w-4 group-hover:animate-wiggle" />
            Join Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      
      {/* Trust indicators */}
      <div className="mt-8 flex flex-nowrap sm:flex-wrap justify-center gap-2 sm:gap-6">
        {[
          { icon: Heart, label: "Made with Love" },
          { icon: Star, label: "Premium Quality" },
          { icon: Gift, label: "Gift Ready" }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-ink/60 stagger-${index + 1} flex-1 sm:flex-none justify-center`} style={{ animation: 'slide-up-fade 0.5s ease-out backwards' }}>
              <div className="icon-float h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center flex-shrink-0">
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-royal" />
              </div>
              <span className="font-medium whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
