import { Crown, Sparkles, Quote } from "lucide-react";

export default function OriginStory() {
  const founders = [
    {
      name: "Bane",
      prefix: "Ba",
      color: "bg-banana-100",
      detail: "Master of naps and silent judgment.",
      trait: "The Thinker"
    },
    {
      name: "Nana",
      prefix: "Na",
      color: "bg-blush",
      detail: "Queen of snacks and side-eye.",
      trait: "The Foodie"
    },
    {
      name: "Angela",
      prefix: "AN",
      color: "bg-lilac",
      detail: "Royal stylist with a dramatic tail flick.",
      trait: "The Diva"
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <div className="cat-card-wrapper">
        <div className="cat-ear ear-left"><div className="cat-ear-inner" /></div>
        <div className="cat-ear ear-right"><div className="cat-ear-inner" /></div>
        
        <div className="card-playful relative overflow-hidden p-8 md:p-16 border-2 border-royal/5">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-banana-50/50 blur-3xl" />
          
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-royal/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-royal">
                <Sparkles size={14} /> The Origin
              </div>
              
              <h2 className="text-4xl font-black text-royal md:text-5xl leading-[1.1]">
                Ba–Na–AN: <br />
                <span className="text-royal/60">A Royal Remix.</span>
              </h2>

              <div className="relative">
                <Quote className="absolute -left-4 -top-4 h-8 w-8 text-banana-200 opacity-50" />
                <p className="pl-6 text-lg leading-relaxed text-ink/80 italic">
                  Banana Meow is named after our three founders of fluff: Bane,
                  Nana, and Angela (reverse for extra drama). Together they rule 
                  a court of 12 British Shorthair nobles who believe every day is a coronation.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {founders.map((f) => (
                  <div key={f.name} className="flex items-center gap-2 rounded-2xl border border-royal/10 bg-white px-4 py-2 shadow-sm transition-transform hover:scale-105">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-royal ${f.color}`}>
                      {f.prefix}
                    </span>
                    <span className="font-bold text-royal">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {founders.map((item, index) => (
                <div
                  key={item.name}
                  className="group relative flex items-center gap-4 rounded-[2rem] bg-cream/50 p-4 transition-all duration-300 hover:bg-white hover:shadow-soft md:p-6"
                  style={{ marginLeft: `${index * 1.5}rem` }} 
                >
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:rotate-6 ${item.color}`}>
                    <Crown className="text-royal/40" size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-royal">{item.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-ink/40">
                        {item.trait}
                      </span>
                    </div>
                    <p className="text-sm leading-snug text-ink/70">
                      {item.detail}
                    </p>
                  </div>
                  
                  <div className="whisker whisker-right opacity-0 group-hover:opacity-20" style={{ top: '50%' }} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}