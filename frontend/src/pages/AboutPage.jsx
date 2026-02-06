import { funnyQuotes } from "../content/funnyQuotes.js";
import { educationalPosts } from "../content/educationalPosts.js";
import { memeCaptions } from "../content/memeCaptions.js";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400 selection:text-white overflow-hidden">
      
      {/* Hero Section - The "Giant Cat Head" Container */}
      <div className="relative mb-24 mt-10">
        {/* Animated Floating Paws */}
        <div className="absolute -top-12 -left-4 text-4xl animate-bounce opacity-20 select-none">🐾</div>
        <div className="absolute -bottom-12 -right-4 text-4xl animate-bounce delay-300 opacity-20 select-none">🐾</div>

        {/* Enhanced Cat Ears with inner-ear detail */}
        <div className="absolute -top-10 left-12 w-20 h-24 bg-royal rounded-t-full -rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        <div className="absolute -top-10 right-12 w-20 h-24 bg-royal rounded-t-full rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        
        <div className="relative z-10 rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-16 shadow-[16px_16px_0px_0px_#171717] hover:shadow-[20px_20px_0px_0px_#171717] transition-all">
          <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-royal">
            🐾 About Banana Meow
          </div>
          
          <h1 className="text-4xl font-black text-royal md:text-6xl leading-[1.1] mb-8">
            Cute, royal, dramatic — <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">with British Shorthair charm</span>
              <span className="absolute inset-x-0 bottom-2 h-6 bg-banana-400 -rotate-1"></span>
            </span>
          </h1>
          
          <p className="max-w-3xl text-lg font-bold text-ink/80 md:text-2xl leading-relaxed italic">
            "Banana Meow is named after our founding trio: Ba – Bane, Na – Nana,
            and AN – Angela (reversed for flair). Together they reign over 12
            British Shorthair cats with plush coats, proud chins, and a touch of
            theatrical energy."
          </p>
        </div>
      </div>

      {/* Grid Section - Card-style layout with high-contrast accents */}
      <div className="grid gap-10 md:grid-cols-3">
        
        {/* Royal Quotes - The "Cloud" Style */}
        <div className="group relative rounded-[2.5rem] bg-blush border-[5px] border-royal p-8 shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-2 hover:bg-white">
          <div className="absolute -top-5 -right-2 bg-royal text-white px-4 py-1 rounded-full text-xs font-black transform rotate-6">MEOW!</div>
          <h2 className="text-2xl font-black text-royal uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span>👑</span> Royal Quotes
          </h2>
          <ul className="space-y-4">
            {funnyQuotes.map((quote) => (
              <li key={quote} className="relative bg-white p-4 rounded-2xl border-2 border-royal shadow-[4px_4px_0px_0px_#171717] text-sm font-bold italic text-royal/80">
                "{quote}"
              </li>
            ))}
          </ul>
        </div>

        {/* Education Corner - The "Notebook" Style */}
        <div className="relative rounded-[2.5rem] bg-lilac border-[5px] border-royal p-8 shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-2 hover:bg-white">
          <h2 className="text-2xl font-black text-royal uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span>🎓</span> Education Corner
          </h2>
          <ul className="space-y-6">
            {educationalPosts.map((post) => (
              <li key={post.title} className="border-b-4 border-royal/10 pb-4 last:border-0 hover:border-royal transition-colors">
                <p className="font-black text-royal text-lg leading-tight mb-1">{post.title}</p>
                <p className="font-bold text-ink/60 text-sm leading-snug">{post.summary}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Meme Captions - The "Sticker" Style */}
        <div className="relative rounded-[2.5rem] bg-banana-200 border-[5px] border-royal p-8 shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-2 hover:bg-white">
          <h2 className="text-2xl font-black text-royal uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span>📸</span> Meme Captions
          </h2>
          <div className="flex flex-wrap gap-3">
            {memeCaptions.map((caption, idx) => (
              <span 
                key={caption} 
                className={`
                  inline-block bg-white border-2 border-royal px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight shadow-[3px_3px_0px_0px_#171717]
                  ${idx % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 transition-transform cursor-default
                `}
              >
                {caption}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}