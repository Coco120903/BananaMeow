import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";
import { ShoppingCart, X } from "lucide-react";

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
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

  const updateQuantity = (productId, nextValue, maxStock) => {
    const maxAllowed = maxStock !== undefined ? Math.min(maxStock, 99) : 99;
    const clamped = Math.max(1, Math.min(maxAllowed, nextValue));
    setQuantities((prev) => ({ ...prev, [productId]: clamped }));
  };

  const handleAddToCart = (productId, product) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const qty = getQuantity(productId);
    const stock = product.inventory ?? 0;
    
    // Check stock availability
    if (stock <= 0) {
      return; // Do nothing if out of stock
    }
    
    // Limit quantity to available stock
    const actualQty = Math.min(qty, stock);
    
    for (let i = 0; i < actualQty; i += 1) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product._id,
          productId: product._id, // Include productId for stock validation
          name: product.name,
          price: product.price
        }
      });
    }
  };

  return (
    <>
      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-200 scale-100">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-cream hover:bg-blush/30 grid place-items-center transition-colors"
            >
              <X className="h-4 w-4 text-ink/60" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-royal" />
            </div>
            <h3 className="text-2xl font-bold text-royal text-center mb-2">
              Login Required
            </h3>
            <p className="text-ink/60 text-center mb-6">
              Please log in to add items to your cart and continue shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLoginModal(false); navigate("/login"); }}
                className="flex-1 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {withImages.map((product) => {
          const qty = getQuantity(product._id);
          const stock = product.inventory ?? 0;
          const inStock = stock > 0;
          const isLowStock = stock > 0 && stock <= 5;
          
          return (
            <article
              key={product._id}
              className="card-soft flex flex-col gap-3 rounded-[2rem] p-4"
            >
              <div className="flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-banana-100">
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
                  className="mt-1 block text-lg font-semibold text-royal line-clamp-2"
                >
                  {product.name}
                </Link>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-royal">
                <span>${product.price}</span>
                {/* Stock indicator */}
                {inStock ? (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isLowStock 
                      ? 'bg-coral/20 text-coral' 
                      : 'bg-mint/30 text-emerald-700'
                  }`}>
                    {isLowStock ? `Only ${stock} left!` : `In Stock: ${stock}`}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blush/50 text-coral">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(product._id, qty - 1, stock)}
                  disabled={!inStock}
                  className="rounded-full bg-cream px-3 py-2 text-base font-semibold text-ink/70 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold text-ink/70">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product._id, qty + 1, stock)}
                  disabled={!inStock || qty >= stock}
                  className="rounded-full bg-cream px-3 py-2 text-base font-semibold text-ink/70 transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAddToCart(product._id, product)}
                disabled={!inStock}
              >
                {inStock ? 'Add to cart' : 'Out of Stock'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
    </>
  );
}
