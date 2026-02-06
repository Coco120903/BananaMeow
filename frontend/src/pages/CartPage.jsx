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
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-3 pb-12">
        <div className="inline-block w-fit bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal">
          👑 Royal Cart
        </div>
        <h1 className="text-4xl font-black text-royal md:text-6xl leading-tight">
          Your royal haul
        </h1>
      </div>

      {state.items.length === 0 ? (
        <div className="relative rounded-[3rem] bg-white border-[6px] border-royal p-12 text-center shadow-[16px_16px_0px_0px_#171717]">
          <p className="text-xl font-bold text-royal/70 italic">
            "The cart is empty. The cats are politely judging."
          </p>
          <Link 
            to="/shop" 
            className="mt-8 inline-block bg-banana-400 border-[4px] border-royal px-8 py-3 rounded-2xl font-black uppercase tracking-tight shadow-[6px_6px_0px_0px_#171717] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Visit the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          {/* Cart Items List */}
          <div className="space-y-6">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col gap-6 rounded-[2.5rem] bg-white border-[5px] border-royal p-6 shadow-[10px_10px_0px_0px_#171717] transition-all hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-2xl font-black text-royal leading-tight">
                    {item.name}
                  </h2>
                  <p className="font-bold text-banana-400 text-lg drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                    ${item.price}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border-4 border-royal rounded-2xl bg-white overflow-hidden shadow-[4px_4px_0px_0px_#171717]">
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
                      className="px-4 py-2 text-xl font-black hover:bg-blush border-r-4 border-royal transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 font-black text-royal">{item.quantity}</span>
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
                      className="px-4 py-2 text-xl font-black hover:bg-banana-400 border-l-4 border-royal transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "REMOVE_ITEM", payload: item.id })
                    }
                    className="rounded-xl border-2 border-royal bg-blush px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_#171717] hover:bg-white transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Sidebar */}
          <aside className="h-fit sticky top-8 rounded-[2.5rem] bg-lilac border-[5px] border-royal p-8 shadow-[12px_12px_0px_0px_#171717]">
            <h3 className="text-3xl font-black text-royal uppercase tracking-tighter mb-6">
              Summary
            </h3>
            
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between font-bold text-royal/80">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              
              <div className="mt-6 border-t-[4px] border-royal pt-4 flex justify-between items-center">
                <span className="text-xl font-black uppercase">Total</span>
                <span className="text-3xl font-black text-royal">${subtotal}</span>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-xs font-black uppercase tracking-widest text-royal mb-2">
                Receipt email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="royal@example.com"
                className="w-full rounded-2xl border-[3px] border-royal bg-white px-5 py-3 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
              />
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-8 w-full bg-banana-400 border-[4px] border-royal py-4 rounded-2xl text-xl font-black uppercase tracking-tight shadow-[8px_8px_0px_0px_#171717] hover:translate-y-1 hover:shadow-none transition-all active:translate-y-2"
            >
              Checkout Now 🐾
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}