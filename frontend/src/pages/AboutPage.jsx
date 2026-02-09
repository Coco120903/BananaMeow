import { funnyQuotes } from "../content/funnyQuotes.js";
import { educationalPosts } from "../content/educationalPosts.js";
import { memeCaptions } from "../content/memeCaptions.js";
import { Sparkles, GraduationCap, Quote, MessageSquare, Crown } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 space-y-20">
      
      <div className="relative overflow-hidden card-soft rounded-[3rem] p-8 md:p-16 border-b-8 border-banana-200">
        <div className="absolute -top-10 -left-10 h-64 w-64 bg-banana-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-lilac/30 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-royal px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            <Crown size={14} className="fill-white" />
            About Banana Meow
          </div>
          
          <h1 className="text-4xl font-bold text-royal md:text-5xl lg:text-6xl tracking-tight">
            Cute, royal, dramatic — <br />
            <span className="text-banana-500">with British Shorthair charm</span>
          </h1>
          
          <p className="mt-8 max-w-3xl text-lg text-ink/70 md:text-xl leading-relaxed">
            Banana Meow is named after our founding trio: <span className="text-royal font-semibold">Ba</span> – Bane, <span className="text-royal font-semibold">Na</span> – Nana,
            and <span className="text-royal font-semibold">AN</span> – Angela (reversed for flair). Together they reign over 12
            British Shorthair cats with plush coats, proud chins, and a touch of
            theatrical energy.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        
        <div className="group card-soft rounded-[2.5rem] bg-blush p-8 transition-transform hover:scale-[1.02]">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:animate-bounce">
            <Quote className="text-royal fill-royal/10" />
          </div>
          <h2 className="text-2xl font-bold text-royal tracking-tight">Royal Quotes</h2>
          <div className="mt-6 space-y-4">
            {funnyQuotes.map((quote, i) => (
              <p key={i} className="text-sm italic text-ink/80 leading-snug border-l-2 border-white/50 pl-4">
                "{quote}"
              </p>
            ))}
          </div>
        </div>

        <div className="group card-soft rounded-[2.5rem] bg-lilac p-8 shadow-xl md:-translate-y-6 transition-transform hover:scale-[1.02]">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:animate-bounce">
            <GraduationCap className="text-royal" />
          </div>
          <h2 className="text-2xl font-bold text-royal tracking-tight">Education Corner</h2>
          <div className="mt-6 space-y-6">
            {educationalPosts.map((post) => (
              <div key={post.title}>
                <p className="font-bold text-royal flex items-center gap-2">
                  <Sparkles size={14} className="text-banana-500 fill-banana-500" />
                  {post.title}
                </p>
                <p className="mt-1 text-sm text-ink/70 leading-relaxed group-hover:text-ink transition-colors">
                  {post.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="group card-soft rounded-[2.5rem] bg-banana-100 p-8 transition-transform hover:scale-[1.02]">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:animate-bounce">
            <MessageSquare className="text-royal fill-royal/10" />
          </div>
          <h2 className="text-2xl font-bold text-royal tracking-tight">Meme Captions</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {memeCaptions.map((caption) => (
              <span key={caption} className="rounded-xl bg-white/80 px-3 py-2 text-xs font-bold text-royal shadow-sm">
                {caption}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-center opacity-20 pb-10">
        <div className="h-1 w-24 bg-ink/20 rounded-full" />
      </div>
    </section>
  );
}