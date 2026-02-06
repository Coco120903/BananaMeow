import { Link } from "react-router-dom";
import { Crown, Cat, Sparkles, PawPrint } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-12 md:grid-cols-[1.1fr,0.9fr] md:items-center md:px-8 md:pt-16">
      <div className="relative flex items-center justify-center py-12 px-4 md:py-20">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
          <PawPrint 
          className="w-[120%] h-[120%] md:w-[140%] md:h-[140%] text-royal -rotate-12" 
          strokeWidth={1} 
          />
        </div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
        <p className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-royal">
          Luxury cats with unemployed energy
        </p>
        <h1 className="flex flex-wrap items-center gap-3 text-4xl font-bold text-royal md:text-5xl">
          <span>Meet Banana Meow – 12 Chonky Royals</span>
          <div className="flex items-center gap-2">
            <div className="group relative floaty">
              <Crown className="h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-royal/20 blur-md md:h-10 md:w-10" />
              </div>
              <div className="group relative floaty">
                <Cat className="wiggle h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:-rotate-12" />
                <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-royal/20 blur-md md:h-10 md:w-10" />
                </div>
          </div>
        </h1>
        <p className="text-base leading-relaxed text-ink/80 md:text-lg">
          A soft, dramatic kingdom of British Shorthair royalty. They nap, they
          judge, they inspire. Bring treats, admiration, and a very respectful
          curtsy.
        </p>
        <div className="flex flex-col gap-3 md:flex-row">
          <Link to="/cats" className="btn-primary w-full text-center md:w-auto">
            Meet the Cats
          </Link>
          <Link
            to="/donate"
            className="btn-secondary w-full text-center md:w-auto"
          >
            Donate for Their Care
          </Link>
          <Link
            to="/shop"
            className="w-full rounded-full border border-royal/30 bg-white px-6 py-3 text-center text-base font-semibold text-royal shadow-soft transition hover:-translate-y-0.5 md:w-auto"
          >
            Shop Banana Meow Merch
          </Link>
        </div>
        </div>
      </div>
      <div className="relative animate-purr">
        <div className="absolute -left-4 -top-4 h-16 w-16 rounded-3xl bg-lilac/70" />
        <div className="absolute -bottom-6 right-10 h-12 w-12 rounded-3xl bg-banana-200/80" />
        
        <div className="cat-card-wrapper">
          <div className="cat-ear ear-left"><div className="cat-ear-inner" /></div>
          <div className="cat-ear ear-right"><div className="cat-ear-inner" /></div>
          
          <div className="hidden md:block">
            <div className="whisker whisker-left top-[30%]" />
            <div className="whisker whisker-left top-[40%] rotate-[-10deg]" />
            <div className="whisker whisker-left top-[50%] rotate-[-20deg]" />
            
            <div className="whisker whisker-right top-[30%]" />
            <div className="whisker whisker-right top-[40%] rotate-[10deg]" />
            <div className="whisker whisker-right top-[50%] rotate-[20deg]" />
          </div>
            
          <div className="card-playful relative z-10 overflow-hidden p-6 bg-white border-2 border-royal/5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-banana-100 px-3 py-1 text-xs font-semibold text-royal">
                Royal Schedule
              </span>
              <span className="text-xs text-ink/60">Updated daily</span>
            </div>
            
            <div className="mt-6 space-y-4">
              {[
                "Nap on velvet throne",
                "Inspect snacks",
                "Stare dramatically at window",
                "Demand chin rub tribute",
              ].map((item) => (
               <div
                 key={item}
                 className="flex items-center gap-3 rounded-full bg-cream px-4 py-3 text-sm font-medium text-ink/80 transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-sm"
               >
                <Sparkles className="h-5 w-5 text-royal" />
                <span>{item}</span>
               </div>
             ))}
           </div>
           
           <div className="mt-6 rounded-2xl bg-royal px-4 py-3 text-sm font-semibold text-white text-center shadow-lg">
            "Your presence is accepted." – Nana
           </div>
         </div>
       </div>
     </div>
    </section>
  );
}
