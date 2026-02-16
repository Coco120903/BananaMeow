import { Link } from "react-router-dom";
import { Cat, Heart, ShoppingBag, Sparkles, Crown, Star, ArrowRight, Gift, Users } from "lucide-react";
import { WhiskerDivider, MeowBubble } from "./CatDecorations.jsx";

const ctas = [
  {
    title: "Meet the Cats",
    description: "Twelve chonky nobles waiting for your admiration. Each one with a unique personality and royal demands.",
    action: "Tour the Royal Court",
    tone: "from-banana-100 to-banana-200/70",
    icon: Cat,
    accentIcon: Crown,
    accentColor: "text-banana-500",
    link: "/cats",
    stats: "12 Royals"
  },
  {
    title: "Donate for Their Care",
    description: "Keep the kingdom stocked with premium snacks, wellness treats, and royal comfort items.",
    action: "Support the Royals",
    tone: "from-blush to-coral/30",
    icon: Heart,
    accentIcon: Gift,
    accentColor: "text-coral",
    link: "/donate",
    stats: "100% to Cats"
  },
  {
    title: "Shop Banana Meow Merch",
    description: "Soft apparel and accessories designed with love, fit for cat royalty and their humans.",
    action: "Enter the Shop",
    tone: "from-lilac to-royal/20",
    icon: ShoppingBag,
    accentIcon: Sparkles,
    accentColor: "text-royal",
    link: "/shop",
    stats: "New Arrivals"
  }
];

export default function CTASection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-16 md:px-8 overflow-hidden">
      {/* Floating shape decorations */}
      <div className="floating-shape floating-shape-1 top-10 right-20" />
      <div className="floating-shape floating-shape-2 bottom-10 left-10" />
      <div className="floating-shape floating-shape-3 top-1/2 right-10" />
      
      <div className="flex flex-col gap-3 pb-10">
        <div className="flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
            Royal Invitations
          </p>
          <Crown className="h-4 w-4 text-banana-400 animate-wiggle" />
        </div>
        <h2 className="text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
          Pick your royal mission
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-banana-100 to-banana-200 shadow-soft">
            <Users className="h-5 w-5 text-royal" />
          </div>
        </h2>
        <p className="text-ink/60 max-w-xl">
          Choose how you'd like to support our British Shorthair kingdom today.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {ctas.map((card, index) => {
          const Icon = card.icon;
          const AccentIcon = card.accentIcon;
          return (
            <div
              key={card.title}
              className={`group relative flex flex-col justify-between gap-6 rounded-[2rem] bg-gradient-to-br ${card.tone} p-6 shadow-soft transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-glow overflow-hidden cat-face-card purr-hover`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 dots-pattern" />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/70 backdrop-blur-sm shadow-soft group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-royal group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-soft text-xs">{card.stats}</span>
                    <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AccentIcon className={`h-4 w-4 ${card.accentColor} group-hover:animate-wiggle`} />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-royal flex items-center gap-2">
                  {card.title}
                  <Sparkles className="h-4 w-4 text-banana-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {card.description}
                </p>
              </div>
              
              <Link 
                className="btn-primary w-full text-center flex items-center justify-center gap-2 group/btn paw-click" 
                to={card.link}
              >
                <Star className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-sparkle transition-opacity" />
                {card.action}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
      
      {/* Bottom accent with paw */}
      <div className="flex justify-center mt-10">
        <MeowBubble text="Purrfect! Join our kingdom! 👑">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm shadow-soft cursor-default">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-banana-200 to-lilac border-2 border-white grid place-items-center">
                  <Cat className="h-4 w-4 text-royal" />
                </div>
              ))}
            </div>
            <p className="text-sm text-ink/70">
              <span className="font-semibold text-royal">5,000+</span> supporters in the kingdom 🐾
            </p>
          </div>
        </MeowBubble>
      </div>
    </section>
  );
}
