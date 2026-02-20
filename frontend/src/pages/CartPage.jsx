import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { state, dispatch, subtotal } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  // Show success UI when Stripe redirects back, clear cart and remove URL params
  const [showSuccess, setShowSuccess] = useState(isSuccess);
  useEffect(() => {
    let timer;
    if (isSuccess) {
      dispatch({ type: "CLEAR_CART" });
      setShowSuccess(true);
      // Remove the query param so refresh won't re-trigger the success state
      setSearchParams({}, { replace: true });
      // Keep showing confirmation briefly (8s) so users have time to read
      timer = setTimeout(() => setShowSuccess(false), 8000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess, dispatch, setSearchParams]);

  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    try {
      // Map cart items to include productId for stock validation
      const checkoutItems = state.items.map(item => ({
        productId: item.productId || item.id, // Use productId if available, fallback to id
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      const response = await fetch(
        `${API_BASE}/api/payments/create-order-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: checkoutItems,
            email: email || (user?.email ?? ""),
            ...(user?._id ? { userId: user._id } : {}),
            ...(user?.name ? { customerName: user.name } : {})
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Unable to connect to payment service. Please try again.");
      setLoading(false);
    }
  };

  // Success state — after Stripe redirect
  if (isSuccess || showSuccess) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-8 text-center">
        <div className="card-soft rounded-[2.5rem] p-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-r from-mint/40 to-sky/30">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-royal mb-3">Order Confirmed!</h1>
          <p className="text-ink/60 mb-2">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <p className="text-sm text-ink/50 mb-8">
            {email ? `A confirmation will be sent to ${email}.` : "Check your email for order details."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </Link>
            <Link to="/" className="btn-secondary text-center">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Canceled state — user backed out of Stripe
  if (isCanceled) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-8 text-center">
        <div className="card-soft rounded-[2.5rem] p-10">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-r from-blush/40 to-coral/20">
            <XCircle className="h-10 w-10 text-coral" />
          </div>
          <h1 className="text-2xl font-bold text-royal mb-3">Checkout Canceled</h1>
          <p className="text-ink/60 mb-8">
            No worries — your cart items are still saved. Come back when you're ready!
          </p>
          <Link
            to="/cart"
            onClick={() => setSearchParams({})}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </div>
      </section>
    );
  }

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
              disabled={loading}
              className="btn-primary mt-6 w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Checkout with Stripe"
              )}
            </button>
            {error && (
              <p className="mt-3 text-sm text-coral text-center">{error}</p>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}
