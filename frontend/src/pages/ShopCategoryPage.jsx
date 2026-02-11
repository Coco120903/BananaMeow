import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../lib/api.js";

const fallbackProducts = [
  {
    _id: "shirt-1",
    name: "Royal Banana Tee",
    category: "Apparel",
    price: 28,
    description: "Soft cotton tee with a chonky crown print.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF3CC'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Apparel</text></svg>"
  },
  {
    _id: "hoodie-1",
    name: "Crown Cozy Hoodie",
    category: "Apparel",
    price: 54,
    description: "Plush hoodie with embroidered royal crest.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FDE2E4'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Hoodie</text></svg>"
  },
  {
    _id: "cap-1",
    name: "Royal Court Cap",
    category: "Apparel",
    price: 22,
    description: "Adjustable cap with subtle banana stitch.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23EBDCF9'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Cap</text></svg>"
  },
  {
    _id: "toy-1",
    name: "Velvet Throne Toy",
    category: "Cat Items",
    price: 16,
    description: "Plush toy for dramatic pounces.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF7F0'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Toy</text></svg>"
  },
  {
    _id: "litter-1",
    name: "Lavender Litter Blend",
    category: "Cat Items",
    price: 24,
    description: "Low-dust, royal-approved comfort blend.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23EBDCF9'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Litter</text></svg>"
  },
  {
    _id: "wand-1",
    name: "Royal Feather Wand",
    category: "Cat Items",
    price: 14,
    description: "Gold handle with irresistible feather flutter.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF3CC'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Wand</text></svg>"
  },
  {
    _id: "mug-1",
    name: "Banana Meow Mug",
    category: "Accessories",
    price: 18,
    description: "Ceramic mug for royal-level sips.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF7F0'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Mug</text></svg>"
  },
  {
    _id: "sticker-1",
    name: "Chonky Royal Stickers",
    category: "Accessories",
    price: 8,
    description: "Glossy sticker pack with royal expressions.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FDE2E4'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Stickers</text></svg>"
  },
  {
    _id: "tote-1",
    name: "Royal Errands Tote",
    category: "Accessories",
    price: 20,
    description: "Canvas tote for snacks, treats, and drama.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF3CC'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Tote</text></svg>"
  }
];

export default function ShopCategoryPage({ title, category }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { dispatch } = useCart();

  useEffect(() => {
    setProducts([]);
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      }
    };

    loadProducts();
  }, [category]);

  const filtered = useMemo(() => {
    const categoryLower = category.toLowerCase().trim();
    const apiFiltered = products.filter(
      (product) => product.category?.toLowerCase().trim() === categoryLower
    );
    const fallbackFiltered = fallbackProducts.filter(
      (product) => product.category?.toLowerCase().trim() === categoryLower
    );
    return apiFiltered.length > 0 ? apiFiltered : fallbackFiltered;
  }, [products, category]);

  const withImages = useMemo(
    () =>
      filtered.map((product) => ({
        ...product,
        imageUrl:
          product.imageUrl && product.imageUrl.startsWith("/")
            ? `${API_BASE}${product.imageUrl}`
            : product.imageUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF7F0'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Banana</text></svg>"
      })),
    [filtered]
  );

  const getQuantity = (productId) => quantities[productId] ?? 1;

  const updateQuantity = (productId, nextValue) => {
    const clamped = Math.max(1, Math.min(99, nextValue));
    setQuantities((prev) => ({ ...prev, [productId]: clamped }));
  };

  const handleAddToCart = (productId, product) => {
    const qty = getQuantity(productId);
    for (let i = 0; i < qty; i += 1) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product._id,
          name: product.name,
          price: product.price
        }
      });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Banana Meow Shop
        </p>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">{title}</h1>
        <p className="text-base text-ink/70 md:text-lg">
          Browse {title.toLowerCase()} curated by the royal court.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {withImages.map((product) => {
          const qty = getQuantity(product._id);
          return (
            <article
              key={product._id}
              className="card-soft flex flex-col gap-4 rounded-[2rem] p-6"
            >
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-banana-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
                  {product.category}
                </p>
                <Link
                  to={`/shop/${product._id}`}
                  className="mt-2 block text-xl font-semibold text-royal"
                >
                  {product.name}
                </Link>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-royal">
                <span>${product.price}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(product._id, qty - 1)}
                  className="rounded-full bg-cream px-3 py-2 text-base font-semibold text-ink/70 transition hover:-translate-y-0.5"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold text-ink/70">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product._id, qty + 1)}
                  className="rounded-full bg-cream px-3 py-2 text-base font-semibold text-ink/70 transition hover:-translate-y-0.5"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() => handleAddToCart(product._id, product)}
              >
                Add to cart
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
