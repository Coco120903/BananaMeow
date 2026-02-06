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
    category: "Cat items",
    price: 16,
    description: "Plush toy for dramatic pounces.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF7F0'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Toy</text></svg>"
  },
  {
    _id: "litter-1",
    name: "Lavender Litter Blend",
    category: "Cat items",
    price: 24,
    description: "Low-dust, royal-approved comfort blend.",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23EBDCF9'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Litter</text></svg>"
  },
  {
    _id: "wand-1",
    name: "Royal Feather Wand",
    category: "Cat items",
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
  }, []);

  const list = products.length > 0 ? products : fallbackProducts;
  const filtered = useMemo(
    () =>
      list.filter(
        (product) =>
          product.category?.toLowerCase() === category.toLowerCase()
      ),
    [list, category]
  );

  const withImages = useMemo(
    () =>
      filtered.map((product) => ({
        ...product,
        imageUrl:
          product.imageUrl ||
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180'><rect width='240' height='180' rx='24' fill='%23FFF7F0'/><circle cx='120' cy='90' r='48' fill='%235A3E85'/><text x='120' y='98' font-size='18' text-anchor='middle' fill='white'>Banana</text></svg>"
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
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-4 pb-16">
        <div className="inline-block w-fit bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal">
          👑 Banana Meow Shop
        </div>
        <h1 className="text-4xl font-black text-royal md:text-6xl leading-tight">
          {title}
        </h1>
        <p className="max-w-2xl text-xl font-bold text-ink/70 italic">
          "Browse {title.toLowerCase()} curated by the royal court."
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {withImages.map((product, index) => {
          const qty = getQuantity(product._id);
          return (
            <article
              key={product._id}
              className={`
                group relative flex flex-col gap-5 rounded-[2.5rem] border-[5px] border-royal p-6 transition-all hover:-translate-y-2
                ${index % 3 === 0 ? 'bg-white shadow-[8px_8px_0px_0px_#171717]' : 
                  index % 3 === 1 ? 'bg-blush shadow-[8px_8px_0px_0px_#171717]' : 
                  'bg-lilac shadow-[8px_8px_0px_0px_#171717]'}
              `}
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden rounded-3xl border-4 border-royal bg-white shadow-[4px_4px_0px_0px_#171717]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-royal/40">
                  {product.category}
                </p>
                <Link
                  to={`/shop/${product._id}`}
                  className="block text-2xl font-black text-royal tracking-tighter leading-tight hover:underline decoration-banana-400 decoration-4"
                >
                  {product.name}
                </Link>
              </div>

              {/* Price & Quantity Control */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-royal">${product.price}</span>
                
                <div className="flex items-center border-3 border-royal rounded-xl bg-white overflow-hidden shadow-[3px_3px_0px_0px_#171717]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, qty - 1)}
                    className="px-3 py-1 text-lg font-black hover:bg-blush border-r-3 border-royal transition-colors"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm font-black text-royal">{qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product._id, qty + 1)}
                    className="px-3 py-1 text-lg font-black hover:bg-banana-400 border-l-3 border-royal transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                className="mt-auto w-full bg-banana-400 border-[4px] border-royal py-3 rounded-2xl text-center text-sm font-black uppercase tracking-widest shadow-[5px_5px_0px_0px_#171717] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                onClick={() => handleAddToCart(product._id, product)}
              >
                Add to cart 🐾
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}