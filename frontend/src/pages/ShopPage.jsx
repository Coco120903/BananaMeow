import { Link } from "react-router-dom";
import { Shirt, Sparkles, ShoppingBag } from "lucide-react";

const categories = [
  {
    id: "apparel",
    title: "Apparel",
    description: "Soft tees, hoodies, and royal everyday fits.",
    href: "/shop/apparel",
    icon: Shirt
  },
  {
    id: "cat-items",
    title: "Cat Items",
    description: "Toys, litter, and essentials for chonky royalty.",
    href: "/shop/cat-items",
    icon: Sparkles
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Stickers, mugs, totes, and royal extras.",
    href: "/shop/accessories",
    icon: ShoppingBag
  }
];

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-16">
        <div className="inline-block w-fit bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal">
          🛒 Banana Meow Shop
        </div>
        <h1 className="text-4xl font-black text-royal md:text-6xl leading-tight">
          Merch fit for royalty
        </h1>
        <p className="max-w-2xl text-xl font-bold text-ink/70 italic">
          "Apparel, cat items, and accessories curated by the royal court."
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <article
              key={category.id}
              className={`
                group relative flex flex-col gap-6 rounded-[2.5rem] border-[5px] border-royal p-8 transition-all hover:-translate-y-2
                ${index === 0 ? 'bg-banana-200 shadow-[10px_10px_0px_0px_#171717]' : 
                  index === 1 ? 'bg-blush shadow-[10px_10px_0px_0px_#171717]' : 
                  'bg-lilac shadow-[10px_10px_0px_0px_#171717]'}
              `}
            >
              {/* Icon Container */}
              <div className="relative flex h-32 items-center justify-center rounded-2xl border-4 border-royal bg-white shadow-[4px_4px_0px_0px_#171717] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-royal/5" />
                <Icon className="relative z-10 h-12 w-12 text-royal transition-transform group-hover:scale-125 group-hover:rotate-6" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-royal/40">
                  Collection
                </p>
                <h2 className="mt-1 text-3xl font-black text-royal tracking-tighter">
                  {category.title}
                </h2>
                <p className="mt-4 text-base font-bold text-royal/70 leading-snug">
                  {category.description}
                </p>
              </div>

              <Link
                to={category.href}
                className="mt-auto block w-full bg-white border-[4px] border-royal py-4 rounded-2xl text-center text-sm font-black uppercase tracking-widest shadow-[5px_5px_0px_0px_#171717] hover:bg-royal hover:text-white hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                Explore More 🐾
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}