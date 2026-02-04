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
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-royal">
            Product details are loading...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2.5rem] p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          {product.category}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-royal md:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base text-ink/70 md:text-lg">
          {product.description}
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-2xl font-semibold text-royal">
            ${product.price}
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn-primary"
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
              Add to cart
            </button>
            <Link to="/shop" className="btn-secondary text-center">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
