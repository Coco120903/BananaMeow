import { Link } from "react-router-dom";

const ctas = [
  {
    title: "Meet the Cats",
    description: "Twelve chonky nobles waiting for your admiration.",
    action: "Tour the Royal Court",
    tone: "bg-banana-400", // Saturated for the system
    link: "/cats"
  },
  {
    title: "Donate for Their Care",
    description: "Keep the kingdom stocked with snacks and wellness.",
    action: "Support the Royals",
    tone: "bg-blush",
    link: "/donate"
  },
  {
    title: "Shop Banana Meow Merch",
    description: "Soft apparel and accessories fit for cat royalty.",
    action: "Enter the Shop",
    tone: "bg-lilac",
    link: "/shop"
  }
];

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-32 pt-12 md:px-8 font-sans selection:bg-banana-400">
      {/* Section Header */}
      <div className="flex flex-col gap-4 pb-12">
        <div className="inline-block w-fit bg-white text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal shadow-[4px_4px_0px_0px_#171717]">
          📬 Royal Invitations
        </div>
        <h2 className="text-4xl font-black text-royal md:text-5xl uppercase tracking-tighter">
          Pick your royal mission
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-10 md:grid-cols-3">
        {ctas.map((card, index) => (
          <div
            key={card.title}
            className={`
              group flex flex-col justify-between gap-8 rounded-[2.5rem] border-[5px] border-royal p-8 
              shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0px_0px_#171717] 
              ${card.tone} ${index % 2 !== 0 ? 'rotate-1' : '-rotate-1'}
            `}
          >
            <div>
              <div className="mb-4 inline-block rounded-lg bg-white border-2 border-royal px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                Mission {index + 1}
              </div>
              <h3 className="text-3xl font-black text-royal leading-none tracking-tighter">
                {card.title}
              </h3>
              <p className="mt-4 text-md font-bold leading-relaxed text-royal/80">
                {card.description}
              </p>
            </div>

            <Link 
              className="relative bg-royal text-white border-4 border-royal py-4 rounded-2xl font-black uppercase tracking-widest text-center shadow-[4px_4px_0px_0px_#facc15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:bg-ink" 
              to={card.link}
            >
              {card.action} 🐾
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}