import { Link } from "react-router-dom";
import { Crown, Cat, Sparkles, Heart, Star, Clock, Moon, Sun, Coffee, Eye } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 md:grid-cols-[1.1fr,0.9fr] md:items-center md:px-8 md:pt-20 overflow-hidden">
      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1 -left-10 top-20" />
      <div className="floating-shape floating-shape-2 right-20 top-10" />
      <div className="floating-shape floating-shape-3 left-1/4 bottom-10" />
      <div className="floating-shape floating-shape-4 right-10 top-1/3" />
      <div className="floating-shape floating-shape-2 left-10 top-1/2" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 space-y-8">
        {/* Premium badge with whiskers */}
        <div className="inline-flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-sm px-5 py-2.5 shadow-soft border border-royal/5 whiskers whiskers-sm" style={{ animation: 'slide-up-fade 0.6s ease-out' }}>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-banana-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-blush animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-sm font-semibold text-royal">Luxury cats with unemployed energy</span>
          <Sparkles className="h-4 w-4 text-banana-400" style={{ animation: 'sparkle-rotate 3s linear infinite' }} />
        </div>
        
        {/* Main heading */}
        <div style={{ animation: 'slide-up-fade 0.6s ease-out 0.1s backwards' }}>
          <h1 className="text-4xl font-bold text-royal md:text-5xl lg:text-6xl leading-tight">
            <span className="block">Meet Banana Meow</span>
            <span className="flex items-center gap-3 mt-2">
              <span className="text-gradient">12 Chonky Royals</span>
              <div className="flex items-center gap-2">
                <div className="group relative cursor-pointer p-2 rounded-xl bg-gradient-to-br from-banana-100 to-banana-200 shadow-soft transition-all duration-300 hover:shadow-glow hover:scale-110">
                  <Crown className="h-6 w-6 text-royal transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="group relative cursor-pointer p-2 rounded-xl bg-gradient-to-br from-lilac to-blush shadow-soft transition-all duration-300 hover:shadow-glow hover:scale-110">
                  <Cat className="h-6 w-6 text-royal transition-transform duration-300 group-hover:-rotate-12" />
                </div>
              </div>
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <p className="text-base leading-relaxed text-ink/70 md:text-lg max-w-lg" style={{ animation: 'slide-up-fade 0.6s ease-out 0.2s backwards' }}>
          A soft, dramatic kingdom of British Shorthair royalty. They nap, they
          judge, they inspire. Bring treats, admiration, and a very respectful
          curtsy.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row" style={{ animation: 'slide-up-fade 0.6s ease-out 0.3s backwards' }}>
          <Link to="/cats" className="btn-primary group flex items-center justify-center gap-2 paw-click cat-stretch">
            <Cat className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span>Meet the Cats</span>
          </Link>
          <Link to="/donate" className="btn-cute group flex items-center justify-center gap-2 paw-click">
            <Heart className="h-5 w-5 text-coral transition-all duration-300 group-hover:fill-coral group-hover:scale-110" />
            <span className="relative z-10">Donate for Their Care</span>
          </Link>
          <Link to="/shop" className="btn-glass group flex items-center justify-center gap-2 paw-click">
            <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Shop Merch</span>
          </Link>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap items-center gap-6 pt-4" style={{ animation: 'slide-up-fade 0.6s ease-out 0.4s backwards' }}>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-banana-100 to-lilac border-2 border-white shadow-sm grid place-items-center">
                  <Cat className="h-4 w-4 text-royal" />
                </div>
              ))}
            </div>
            <span className="text-sm text-ink/60">5,000+ happy supporters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-banana-400 text-banana-400" />
              ))}
            </div>
            <span className="text-sm text-ink/60">4.9 rating</span>
          </div>
        </div>
      </div>
      
      {/* Right side - Royal Schedule Card */}
      <div className="relative" style={{ animation: 'slide-up-fade 0.6s ease-out 0.2s backwards' }}>
        {/* Decorative elements behind card */}
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-lilac/50 to-blush/40 blur-sm" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-8 right-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-banana-200/60 to-banana-100/50 blur-sm" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 -right-10 w-14 h-14 rounded-full bg-gradient-to-br from-mint/40 to-sky/30 blur-sm" style={{ animation: 'pulse-soft 4s ease-in-out infinite' }} />
        
        <div className="card-cute p-[2px] cat-face-card">
          <div className="rounded-[1.85rem] bg-white p-6 md:p-8">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-100 to-banana-200 grid place-items-center">
                  <Crown className="h-4 w-4 text-royal" />
                </div>
                <span className="text-sm font-bold text-royal">Royal Schedule</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-ink/50">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated daily</span>
              </div>
            </div>
            
            {/* Schedule items */}
            <div className="space-y-3">
              {[
                { icon: Moon, text: "Nap on velvet throne", time: "Morning", color: "from-lilac/30 to-blush/20" },
                { icon: Eye, text: "Inspect snacks thoroughly", time: "Afternoon", color: "from-banana-100/50 to-banana-50" },
                { icon: Sun, text: "Stare dramatically at window", time: "Sunset", color: "from-peach/30 to-coral/20" },
                { icon: Heart, text: "Demand chin rub tribute", time: "Anytime", color: "from-mint/30 to-sky/20" }
              ].map((task, index) => (
                <div
                  key={task.text}
                  className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-r ${task.color} p-4 transition-all duration-300 ease-out hover:-translate-x-1 hover:shadow-soft cursor-pointer`}
                  style={{ animation: `slide-up-fade 0.4s ease-out ${0.1 * index}s backwards` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm grid place-items-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <task.icon className="h-5 w-5 text-royal" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink/80">{task.text}</p>
                    <p className="text-xs text-ink/50">{task.time}</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-royal/30 transition-all duration-300 group-hover:text-royal group-hover:rotate-12" />
                </div>
              ))}
            </div>
            
            {/* Quote footer with cat tail */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-royal to-royal/90 relative overflow-hidden cat-tail">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full" style={{ animation: 'shimmer 3s ease-in-out infinite' }} />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center cat-eye-glow">
                  <Cat className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">"👑 Your presence is accepted."</p>
                  <p className="text-xs text-white/70">— Nana, Head of Judgment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
