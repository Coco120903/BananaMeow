import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../lib/api.js";
import { ShoppingCart, ArrowLeft, Package, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function ProductPage() {
  const { productId } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

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
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
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
  );
}
