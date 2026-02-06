export default function OriginStory() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400">
      {/* Main Container - Large Card Style */}
      <div className="relative rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-16 shadow-[20px_20px_0px_0px_#171717]">
        
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal mb-6">
              👑 The Origin
            </div>
            <h2 className="text-4xl font-black text-royal md:text-6xl leading-none">
              Ba–Na–AN: <br />
              <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">a royal remix</span>
            </h2>
            <p className="mt-8 text-xl font-bold leading-relaxed text-ink/80 italic border-l-8 border-lilac pl-6">
              "Banana Meow is named after our three founders of fluff: Bane, Nana,
              and Angela (reversed for extra drama). Together they rule a court of 12
              British Shorthair nobles who believe every day is a coronation."
            </p>
          </div>

          {/* Initial Sticker Badges */}
          <div className="flex flex-row md:flex-col items-center gap-4 text-3xl font-black">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-royal bg-banana-400 shadow-[6px_6px_0px_0px_#171717] -rotate-6">
              Ba
            </span>
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-royal bg-blush shadow-[6px_6px_0px_0px_#171717] rotate-6">
              Na
            </span>
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-royal bg-lilac shadow-[6px_6px_0px_0px_#171717] -rotate-3">
              AN
            </span>
          </div>
        </div>

        {/* Founder Detail Grid - Notebook Style Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Bane",
              detail: "Master of naps and silent judgment.",
              color: "bg-white"
            },
            {
              title: "Nana",
              detail: "Queen of snacks and side-eye.",
              color: "bg-blush"
            },
            {
              title: "Angela",
              detail: "Royal stylist with a dramatic tail flick.",
              color: "bg-lilac"
            }
          ].map((item, idx) => (
            <div
              key={item.title}
              className={`group relative rounded-[2rem] ${item.color} border-[5px] border-royal p-8 shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-2 hover:bg-banana-200 ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              <p className="text-2xl font-black text-royal uppercase tracking-tighter">
                {item.title}
              </p>
              <div className="my-4 h-1 w-12 bg-royal" />
              <p className="text-md font-bold text-royal/70 leading-snug">
                {item.detail}
              </p>
              <div className="absolute -bottom-2 -right-2 text-2xl opacity-20 group-hover:opacity-100 transition-opacity">🐾</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}