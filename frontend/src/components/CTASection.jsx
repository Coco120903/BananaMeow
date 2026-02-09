import { Link } from "react-router-dom";

const ctas = [
  {
    title: "Meet the Cats",
    description: "Twelve chonky nobles waiting for your admiration.",
    action: "Tour the Royal Court",
    image: "https://cdn.shopify.com/s/files/1/0589/9953/7796/files/british-shorthair-cat.jpg?v=1760607004", // Change pic later
    colorStyle: "bg-gradient-to-b from-banana-400/20 via-banana-500/50 to-banana-600/90",
    link: "/cats"
  },
  {
    title: "Donate for Their Care",
    description: "Keep the kingdom stocked with snacks and wellness.",
    action: "Support the Royals",
    image: "https://cdn.shopify.com/s/files/1/0344/6469/files/1412512017846_wps_107_BDG0GB_Animal_love_tabby.jpg?v=1564693366", // Change pic later
    colorStyle: "bg-gradient-to-b from-blush/20 via-blush/60 to-royal/80",
    link: "/donate"
  },
  {
    title: "Shop Banana Meow Merch",
    description: "Soft apparel and accessories fit for cat royalty.",
    action: "Enter the Shop",
    image: "https://assets-au-01.kc-usercontent.com/0a5c9512-a993-020c-49e0-57aca041fd7a/2816b6b5-db9b-4afb-8942-0a35a731b403/article-cat-meows-mean.jpg", // Change pic later
    colorStyle: "bg-gradient-to-b from-lilac/20 via-lilac/60 to-royal/80",
    link: "/shop"
  }
];

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <div className="flex flex-col gap-3 pb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Royal Invitations
        </p>
        <h2 className="text-3xl font-bold text-royal md:text-4xl">
          Pick your royal mission
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {ctas.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group relative h-[400px] overflow-hidden rounded-[2.5rem] shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
          >
            <img 
              src={card.image} 
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className={`absolute inset-0 transition-opacity duration-300 ${card.colorStyle} opacity-90 group-hover:opacity-100`} />

            <div className="relative flex h-full flex-col justify-end p-8 text-white">
              <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold leading-tight drop-shadow-md">
                  {card.title}
                </h3>
                
                <p className="mt-3 text-sm font-medium leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {card.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-wide">
                  <span className="h-0.5 w-8 bg-white transition-all group-hover:w-12" />
                  {card.action}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
