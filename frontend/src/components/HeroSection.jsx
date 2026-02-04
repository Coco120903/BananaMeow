import { Link } from "react-router-dom";
import { Crown, Cat, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-12 md:grid-cols-[1.1fr,0.9fr] md:items-center md:px-8 md:pt-16">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-royal">
          Luxury cats with unemployed energy
        </p>
        <h1 className="flex flex-wrap items-center gap-3 text-4xl font-bold text-royal md:text-5xl">
          <span>Meet Banana Meow – 12 Chonky Royals</span>
          <div className="flex items-center gap-2">
            <div className="group relative">
              <Crown className="h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-royal/20 blur-md md:h-10 md:w-10" />
            </div>
            <div className="group relative">
              <Cat className="h-8 w-8 text-royal transition-all duration-300 md:h-10 md:w-10 group-hover:scale-110 group-hover:-rotate-12" />
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
      <div className="relative">
        <div className="absolute -left-4 -top-4 h-16 w-16 rounded-3xl bg-lilac/70" />
        <div className="absolute -bottom-6 right-10 h-12 w-12 rounded-3xl bg-banana-200/80" />
        <div className="card-soft rounded-[2.5rem] p-6">
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
              "Demand chin rub tribute"
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-ink/80 transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                <Sparkles className="h-5 w-5 text-royal" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-royal px-4 py-3 text-sm font-semibold text-white">
            "Your presence is accepted." – Nana
          </div>
        </div>
      </div>
    </section>
  );
}
