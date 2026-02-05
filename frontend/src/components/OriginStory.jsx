import { Crown, Sparkles, Heart, Star, Moon, Eye, Zap } from "lucide-react";

export default function OriginStory() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating shape decorations */}
      <div className="floating-shape floating-shape-1 top-20 left-10" />
      <div className="floating-shape floating-shape-2 bottom-20 right-10" />
      
      <div className="card-cute p-[3px]">
        <div className="rounded-[2.3rem] bg-white p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 dots-pattern" />
          </div>
          
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
                  The Origin
                </p>
                <Sparkles className="h-4 w-4 text-banana-400 animate-sparkle" />
              </div>
              <h2 className="mt-3 text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
                Ba–Na–AN: a royal remix
                <Crown className="h-8 w-8 text-banana-400 animate-wiggle" />
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="group rounded-full bg-gradient-to-br from-banana-100 to-banana-200 px-5 py-3 shadow-soft transition-all duration-300 hover:scale-110 hover:-rotate-3 cursor-pointer flex items-center gap-2">
                <span className="font-semibold text-royal">Ba</span>
                <Moon className="h-4 w-4 text-royal/60 group-hover:text-royal transition-colors" />
              </span>
              <span className="group rounded-full bg-gradient-to-br from-blush to-coral/30 px-5 py-3 shadow-soft transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer flex items-center gap-2">
                <span className="font-semibold text-royal">Na</span>
                <Crown className="h-4 w-4 text-coral/60 group-hover:text-coral transition-colors" />
              </span>
              <span className="group rounded-full bg-gradient-to-br from-lilac to-royal/20 px-5 py-3 shadow-soft transition-all duration-300 hover:scale-110 hover:-rotate-3 cursor-pointer flex items-center gap-2">
                <span className="font-semibold text-royal">AN</span>
                <Sparkles className="h-4 w-4 text-royal/60 group-hover:text-royal transition-colors" />
              </span>
            </div>
          </div>
          
          <p className="relative mt-6 text-base leading-relaxed text-ink/80 md:text-lg">
            Banana Meow is named after our three founders of fluff: <span className="font-semibold text-royal">Bane</span>, <span className="font-semibold text-royal">Nana</span>,
            and <span className="font-semibold text-royal">Angela</span> (reversed for extra drama). Together they rule a court of 12
            British Shorthair nobles who believe every day is a coronation.
          </p>
          
          <div className="divider-elegant my-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
              <Star className="h-4 w-4 text-royal" />
            </div>
          </div>
          
          <div className="relative grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Bane",
                icon: Moon,
                detail: "Master of naps and silent judgment.",
                color: "from-banana-50 to-banana-100",
                iconColor: "text-banana-500"
              },
              {
                title: "Nana",
                icon: Crown,
                detail: "Queen of snacks and side-eye.",
                color: "from-blush/50 to-lilac/30",
                iconColor: "text-coral"
              },
              {
                title: "Angela",
                icon: Zap,
                detail: "Royal stylist with a dramatic tail flick.",
                color: "from-lilac/50 to-mint/30",
                iconColor: "text-royal"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group rounded-3xl bg-gradient-to-br ${item.color} px-5 py-5 text-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-cute cursor-pointer relative overflow-hidden`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-[3rem] opacity-50" />
                  
                  <div className="relative flex items-center justify-between">
                    <p className="text-lg font-semibold text-royal flex items-center gap-2">
                      {item.title}
                      <Star className="h-4 w-4 text-banana-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <div className="h-10 w-10 rounded-full bg-white/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                  </div>
                  <p className="relative mt-3 text-ink/70">{item.detail}</p>
                </div>
              );
            })}
          </div>
          
          {/* Fun quote */}
          <div className="mt-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-royal to-royal/80 px-6 py-3 text-sm font-medium text-white shadow-glow">
              <Heart className="h-4 w-4 fill-coral text-coral animate-pulse-soft" />
              <span>"Every cat is royalty, but some are more chonky than others."</span>
              <Crown className="h-4 w-4 text-banana-300 animate-wiggle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
