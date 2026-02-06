import { Link } from "react-router-dom";
import { Crown, Cat, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-20 md:grid-cols-[1.1fr,0.9fr] md:items-center md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      <div className="space-y-8">
        <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal shadow-[4px_4px_0px_0px_#171717]">
          🐾 Luxury cats with unemployed energy
        </div>
        
        <h1 className="flex flex-wrap items-center gap-3 text-5xl font-black text-royal md:text-7xl leading-[1.1]">
          <span>Meet Banana Meow – <br /> 12 Chonky Royals</span>
          <div className="flex items-center gap-4 mt-2">
            <div className="group relative bg-white border-4 border-royal p-2 rounded-2xl shadow-[4px_4px_0px_0px_#171717] -rotate-6">
              <Crown className="h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <div className="group relative bg-white border-4 border-royal p-2 rounded-2xl shadow-[4px_4px_0px_0px_#171717] rotate-6">
              <Cat className="h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:-rotate-12" />
            </div>
          </div>
        </h1>

        <p className="max-w-xl text-lg font-bold text-ink/80 md:text-2xl leading-relaxed italic border-l-8 border-banana-400 pl-6">
          "A soft, dramatic kingdom of British Shorthair royalty. They nap, they
          judge, they inspire. Bring treats and a very respectful curtsy."
        </p>

        <div className="flex flex-col gap-4 md:flex-row">
          <Link to="/cats" className="bg-royal text-white border-4 border-royal px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#facc15] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center">
            Meet the Cats
          </Link>
          <Link
            to="/donate"
            className="bg-blush text-royal border-4 border-royal px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center"
          >
            Sponsor a Royal
          </Link>
          <Link
            to="/shop"
            className="bg-white text-royal border-4 border-royal px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-center"
          >
            Shop Merch
          </Link>
        </div>
      </div>

      <div className="relative group">
        {/* Animated Cat Ears for the Schedule Card */}
        <div className="absolute -top-10 left-12 w-16 h-20 bg-royal rounded-t-full -rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        <div className="absolute -top-10 right-12 w-16 h-20 bg-royal rounded-t-full rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>

        <div className="relative z-10 rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-10 shadow-[16px_16px_0px_0px_#171717]">
          <div className="flex items-center justify-between border-b-4 border-royal pb-4">
            <span className="bg-banana-400 px-3 py-1 rounded-lg text-xs font-black uppercase border-2 border-royal shadow-[2px_2px_0px_0px_#171717]">
              Royal Schedule
            </span>
            <span className="text-xs font-black text-royal opacity-40 uppercase tracking-widest">Updated daily</span>
          </div>

          <div className="mt-8 space-y-4">
            {[
              "Nap on velvet throne",
              "Inspect snacks",
              "Stare dramatically at window",
              "Demand chin rub tribute"
            ].map((item, idx) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-2xl border-4 border-royal px-5 py-4 text-md font-black text-royal shadow-[4px_4px_0px_0px_#171717] transition-all hover:bg-banana-100 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
              >
                <Sparkles className="h-5 w-5 fill-royal" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-royal border-4 border-royal p-5 text-center shadow-[6px_6px_0px_0px_#facc15]">
             <p className="text-sm font-black text-white italic">
               "Your presence is accepted." – Nana
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}