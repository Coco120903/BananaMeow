import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../lib/api.js";

export default function ProductPage() {
  const { productId } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to load product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setProduct(null);
      }
    };

    loadProduct();
  }, [productId]);

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-8 font-sans">
        <div className="rounded-[2rem] bg-white border-[5px] border-royal p-12 text-center shadow-[12px_12px_0px_0px_#171717]">
          <p className="text-2xl font-black text-royal italic animate-pulse">
            Product details are loading...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      <div className="relative group">
        {/* Animated Floating Paws */}
        <div className="absolute -top-12 -left-4 text-4xl animate-bounce opacity-20 select-none">🐾</div>
        <div className="absolute -bottom-12 -right-4 text-4xl animate-bounce delay-300 opacity-20 select-none">🐾</div>

        {/* Product Card Container */}
        <div className="relative z-10 rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-16 shadow-[16px_16px_0px_0px_#171717] hover:shadow-[20px_20px_0px_0px_#171717] transition-all">
          
          <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-royal">
            📦 {product.category}
          </div>
          
          <h1 className="text-4xl font-black text-royal md:text-6xl leading-[1.1] mb-6">
            {product.name}
          </h1>
          
          <div className="bg-lilac/10 border-l-[6px] border-royal p-6 mb-8">
            <p className="text-lg font-bold text-ink/80 md:text-xl leading-relaxed italic">
              "{product.description}"
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative inline-block">
              <span className="relative z-10 text-4xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:text-5xl">
                ${product.price}
              </span>
              <span className="absolute inset-x-0 bottom-1 h-4 bg-banana-400 -rotate-1"></span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="bg-banana-400 border-[4px] border-royal px-8 py-4 rounded-2xl text-lg font-black uppercase tracking-tight shadow-[6px_6px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-white"
                onClick={() =>
                  dispatch({
                    type: "ADD_ITEM",
                    payload: {
                      id: product._id,
                      name: product.name,
                      price: product.price
                    }
                  })
                }
              >
                Add to cart 🐾
              </button>
              
              <Link 
                to="/shop" 
                className="bg-white border-[4px] border-royal px-8 py-4 rounded-2xl text-lg font-black uppercase tracking-tight text-center shadow-[6px_6px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}