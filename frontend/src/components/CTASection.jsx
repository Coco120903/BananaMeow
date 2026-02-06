import { Link } from "react-router-dom";

const ctas = [
  {
    title: "Meet the Cats",
    description: "Twelve chonky nobles waiting for your admiration.",
    action: "Tour the Royal Court",
    tone: "bg-banana-100",
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
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Royal Invitations
        </p>
        <h2 className="text-3xl font-bold text-royal md:text-4xl">
          Pick your royal mission
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {ctas.map((card) => (
          <div
            key={card.title}
            className={`flex flex-col justify-between gap-6 rounded-[2.5rem] p-6 shadow-soft transition-all duration-200 ease-out hover:-translate-y-2 hover:scale-[1.02] ${card.tone}`}
          >
            <div>
              <h3 className="text-xl font-semibold text-royal">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {card.description}
              </p>
            </div>
            <Link className="btn-primary w-full bg-royal/90 text-center" to={card.link}>
              {card.action}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
