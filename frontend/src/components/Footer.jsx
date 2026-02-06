export default function Footer() {
  return (
    <footer className="border-t-[6px] border-royal bg-white py-12 selection:bg-banana-400">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Copyright "Sticker" */}
          <div className="inline-block w-fit rotate-[-1deg] border-[3px] border-royal bg-white px-4 py-2 shadow-[4px_4px_0px_0px_#171717]">
            <p className="text-sm font-black uppercase tracking-tighter text-royal">
              © 2026 Banana Meow. <span className="text-royal/40 italic">All chonks reserved.</span>
            </p>
          </div>

          {/* Slogan */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-lilac rotate-1 group-hover:rotate-2 transition-transform opacity-30"></div>
            <p className="relative z-10 text-sm font-black uppercase tracking-[0.2em] text-royal">
              Built for <span className="bg-banana-400 px-1 border-2 border-royal">dramatic naps</span> and royal snuggles. 🐾
            </p>
          </div>

        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-8 flex items-center gap-4 opacity-20">
          <div className="h-[2px] flex-1 bg-royal"></div>
          <div className="text-xl">🐾</div>
          <div className="h-[2px] flex-1 bg-royal"></div>
        </div>
      </div>
    </footer>
  );
}