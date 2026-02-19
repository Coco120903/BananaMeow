import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";
import { ShoppingCart, ArrowLeft, Package, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        productId: product._id, // Include productId for stock validation
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      }
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Resolve image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
          <Loader2 className="h-8 w-8 text-royal animate-spin mx-auto mb-3" />
          <p className="text-base text-ink/60">Loading product details...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
          <AlertCircle className="h-10 w-10 text-coral mx-auto mb-3" />
          <p className="text-lg font-semibold text-royal mb-2">Product Not Found</p>
          <p className="text-sm text-ink/60 mb-6">{error || "This product doesn't exist or has been removed."}</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = getImageUrl(product.imageUrl);
  const inStock = product.inventory > 0;

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

    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2.5rem] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-banana-50 to-lilac/20 p-8 flex items-center justify-center min-h-[300px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-80 w-full object-contain rounded-2xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div className={`flex flex-col items-center gap-3 text-ink/30 ${imageUrl ? "hidden" : ""}`}>
              <Package className="h-20 w-20" />
              <span className="text-sm">No image available</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-royal md:text-4xl">
              {product.name}  
            </h1>
            <p className="mt-4 text-base text-ink/70 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-royal">
                ${product.price.toFixed(2)}
              </span>
              {inStock ? (
                <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-semibold text-emerald-700">
                  In Stock ({product.inventory})
                </span>
              ) : (
                <span className="rounded-full bg-blush/50 px-3 py-1 text-xs font-semibold text-coral">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>
              <Link to="/shop" className="btn-secondary text-center inline-flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
