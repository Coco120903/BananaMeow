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
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Banana Meow Shop
        </p>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">
          Merch fit for royalty
        </h1>
        <p className="text-base text-ink/70 md:text-lg">
          Apparel, cat items, and accessories curated by the royal court.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
          <article
            key={category.id}
            className="card-soft flex flex-col gap-4 rounded-[2rem] p-6"
          >
            <div className="flex h-32 items-center justify-center rounded-2xl bg-banana-100">
              <Icon className="h-10 w-10 text-royal" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
                Category
              </p>
              <h2 className="mt-2 text-xl font-semibold text-royal">
                {category.title}
              </h2>
              <p className="mt-3 text-sm text-ink/70">
                {category.description}
              </p>
            </div>
            <Link
              to={category.href}
              className="btn-secondary text-sm text-center"
            >
              View More
            </Link>
          </article>
          );
        })}
      </div>
    </section>
  );
}
