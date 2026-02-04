import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../lib/api.js";

export default function CartPage() {
  const { state, dispatch, subtotal } = useCart();
  const [email, setEmail] = useState("");

  const handleCheckout = async () => {
    const response = await fetch(
      `${API_BASE}/api/payments/create-order-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items: state.items, email })
      }
    );

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url;
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Royal Cart
        </p>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">
          Your royal haul
        </h1>
      </div>

      {state.items.length === 0 ? (
        <div className="card-soft rounded-[2rem] p-8 text-center">
          <p className="text-base text-ink/70">
            The cart is empty. The cats are politely judging.
          </p>
          <Link to="/shop" className="btn-primary mt-6 inline-block">
            Visit the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="card-soft flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-royal">
                    {item.name}
                  </h2>
                  <p className="text-sm text-ink/60">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QTY",
                        payload: {
                          id: item.id,
                          quantity: Math.max(1, item.quantity - 1)
                        }
                      })
                    }
                    className="rounded-full bg-cream px-3 py-1 text-lg font-semibold text-ink/70"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QTY",
                        payload: {
                          id: item.id,
                          quantity: item.quantity + 1
                        }
                      })
                    }
                    className="rounded-full bg-cream px-3 py-1 text-lg font-semibold text-ink/70"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "REMOVE_ITEM", payload: item.id })
                    }
                    className="rounded-full bg-blush px-3 py-1 text-sm font-semibold text-royal"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[2.5rem] bg-blush p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-royal">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm text-ink/70">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-royal/10 pt-3 text-base font-semibold text-royal">
                <span>Total</span>
                <span>${subtotal}</span>
              </div>
            </div>
            <label className="mt-6 block text-sm font-semibold text-ink/60">
              Receipt email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="royal@example.com"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
            />
            <button
              type="button"
              onClick={handleCheckout}
              className="btn-primary mt-6 w-full"
            >
              Checkout with Stripe
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
