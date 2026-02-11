import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE } from "../lib/api.js";
import { Utensils, Pill, HeartPulse, Heart, Cat, Crown, Check, Sparkles, Star, Shield, Gift, ArrowRight } from "lucide-react";
import { catBios } from "../content/catBios.js";

const donationTypes = [
  {
    id: "food",
    title: "Cat Food",
    icon: Utensils,
    subtitle: "Feed a Chonk",
    goal: 1200,
    funded: 720,
    color: "from-banana-100 to-banana-200/50"
  },
  {
    id: "vitamins",
    title: "Vitamins",
    icon: Pill,
    subtitle: "Shiny Coat Sponsor",
    goal: 800,
    funded: 520,
    color: "from-mint/40 to-sky/30"
  },
  {
    id: "vet",
    title: "Vet Visits",
    icon: HeartPulse,
    subtitle: "Health Guardian",
    goal: 2000,
    funded: 1320,
    color: "from-blush to-coral/30"
  }
];

export default function DonatePage() {
  const [searchParams] = useSearchParams();
  const preselectedCatName = searchParams.get("cat");
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedType, setSelectedType] = useState(donationTypes[0].id);
  const [frequency, setFrequency] = useState("one-time");
  const [amount, setAmount] = useState(25);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/cats`);
        if (!response.ok) {
          throw new Error("Failed to load cats");
        }
        const data = await response.json();
        setCats(data);
      } catch (error) {
        setCats([]);
      }
    };

    loadCats();
  }, []);

  const catList = cats.length > 0 ? cats : catBios;

  // Separate main cats (Bane, Nana, Angela) from others - in specific order
  const mainCatsOrder = ["Bane", "Nana", "Angela"];
  const highlightedCats = useMemo(() => {
    return mainCatsOrder
      .map(name => catList.find(cat => cat.name === name))
      .filter(Boolean); // Remove undefined if cat not found
  }, [catList]);
  
  const otherCats = useMemo(() => {
    return catList.filter(cat => !mainCatsOrder.includes(cat.name));
  }, [catList]);

  useEffect(() => {
    if (preselectedCatName) {
      const found = catList.find(
        (cat) => cat.name.toLowerCase() === preselectedCatName.toLowerCase()
      );
      if (found) {
        setSelectedCat(found);
      }
    }
  }, [preselectedCatName, catList]);

  const activeType = useMemo(
    () => donationTypes.find((type) => type.id === selectedType),
    [selectedType]
  );

  const handleCheckout = async () => {
    if (!selectedCat) {
      setError("Please select a royal to support before proceeding.");
      return;
    }

    setError("");

    const payload = {
      amount,
      frequency,
      type: selectedType,
      cat: selectedCat.name,
      catId: selectedCat._id || selectedCat.id || null
    };

    const response = await fetch(
      `${API_BASE}/api/payments/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url;
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 top-20 right-10" />
      <div className="floating-shape floating-shape-2 bottom-40 left-10" />
      <div className="floating-shape floating-shape-3 top-1/2 right-1/4" />
      
      {/* Page Header */}
      <div className="flex flex-col gap-3 pb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
            Support the Royals
          </p>
          <Heart className="h-4 w-4 text-coral fill-coral animate-pulse-soft" />
        </div>
        <h1 className="text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
          Become a royal sponsor
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-banana-100 to-lilac shadow-soft">
            <Crown className="h-5 w-5 text-royal" />
          </div>
        </h1>
        <p className="text-base text-ink/70 md:text-lg max-w-xl">
          Choose a royal to support and keep the court thriving with love and treats.
        </p>
      </div>

      {/* Cat Selection */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
            <Cat className="h-4 w-4 text-royal" />
          </div>
          <h2 className="text-xl font-semibold text-royal">
            Choose a Royal to Support
          </h2>
          <Sparkles className="h-4 w-4 text-banana-400" />
        </div>

        {/* The Founding Royals Section */}
        {highlightedCats.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-banana-400" />
              <h3 className="text-lg font-semibold text-royal">The Founding Royals</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {highlightedCats.map((cat, index) => {
                const isSelected = selectedCat?.name === cat.name;
                return (
                  <button
                    key={cat._id || cat.id || cat.name || index}
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat);
                      setError("");
                    }}
                    className={`group relative rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                      isSelected
                        ? "bg-white shadow-glow border-2 border-royal/20"
                        : "bg-white/80 backdrop-blur-sm border-2 border-royal/20 hover:bg-white hover:shadow-soft"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-royal to-royal/80 shadow-soft">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-soft">
                      <Crown className="h-3 w-3 text-banana-400" />
                      <span className="text-xs font-semibold text-royal">Featured Royal</span>
                    </div>
                    {cat.imageUrl ? (
                      <div className="mb-3 mt-8 flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden shadow-soft group-hover:scale-105 transition-transform">
                        <img
                          src={`${API_BASE}${cat.imageUrl}`}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-banana-100 to-lilac/50 shadow-soft group-hover:scale-105 transition-transform mt-8">
                        <Cat className="h-8 w-8 text-royal" />
                      </div>
                    )}
                    <h3 className="font-semibold text-royal flex items-center gap-1">
                      {cat.name}
                      {isSelected && <Star className="h-3 w-3 text-banana-400 fill-banana-200" />}
                    </h3>
                    <p className="mt-1 text-xs text-ink/60">{cat.nickname}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Separator */}
        {highlightedCats.length > 0 && otherCats.length > 0 && (
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
            <div className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-royal/40" />
              <span className="text-sm text-ink/40 font-medium">The Royal Court</span>
              <Cat className="h-5 w-5 text-royal/40" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-royal/20 to-transparent"></div>
          </div>
        )}

        {/* Other Cats Grid */}
        {otherCats.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {otherCats.map((cat, index) => {
              const isSelected = selectedCat?.name === cat.name;
              return (
                <button
                  key={cat._id || cat.id || cat.name || index}
                  type="button"
                  onClick={() => {
                    setSelectedCat(cat);
                    setError("");
                  }}
                  className={`group relative rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "bg-white shadow-glow border-2 border-royal/20"
                      : "bg-white/60 backdrop-blur-sm border border-royal/10 hover:bg-white hover:shadow-soft"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-royal to-royal/80 shadow-soft">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {cat.imageUrl ? (
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden shadow-soft group-hover:scale-105 transition-transform">
                      <img
                        src={`${API_BASE}${cat.imageUrl}`}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-banana-100 to-lilac/50 shadow-soft group-hover:scale-105 transition-transform">
                      <Cat className="h-8 w-8 text-royal" />
                    </div>
                  )}
                  <h3 className="font-semibold text-royal flex items-center gap-1">
                    {cat.name}
                    {isSelected && <Star className="h-3 w-3 text-banana-400 fill-banana-200" />}
                  </h3>
                  <p className="mt-1 text-xs text-ink/60">{cat.nickname}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          {/* Donation Type Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {donationTypes.map((type) => {
              const progress = Math.round((type.funded / type.goal) * 100);
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`group relative rounded-[2rem] px-5 py-5 text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                    selectedType === type.id
                      ? "bg-white shadow-glow border-2 border-royal/20"
                      : "bg-white/60 backdrop-blur-sm border border-royal/10 hover:bg-white hover:shadow-soft"
                  }`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-30 transition-opacity group-hover:opacity-50`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-white shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="h-5 w-5 text-royal" />
                      </div>
                      {selectedType === type.id && (
                        <div className="h-6 w-6 rounded-full bg-royal flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-royal">{type.title}</p>
                    <p className="text-sm text-ink/60">{type.subtitle}</p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-royal/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-royal to-royal/70 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-ink/60 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-banana-400" />
                      {progress}% funded
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Donation Options Card */}
          <div className="card-cute p-[2px]">
            <div className="rounded-[1.85rem] bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
                  {activeType?.icon && (() => {
                    const ActiveIcon = activeType.icon;
                    return <ActiveIcon className="h-4 w-4 text-royal" />;
                  })()}
                </div>
                <div>
                  <p className="text-sm text-ink/60">Donation Type</p>
                  <h2 className="text-xl font-semibold text-royal">{activeType?.title}</h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row mb-6">
                {["one-time", "monthly"].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      frequency === freq
                        ? "bg-royal text-white shadow-soft"
                        : "bg-royal/5 text-ink/70 hover:bg-royal/10"
                    }`}
                  >
                    {freq === "one-time" ? "One-time" : "Monthly"}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-semibold text-ink/60 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Donation amount
                </label>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {[15, 25, 50, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        amount === value
                          ? "bg-royal text-white shadow-soft scale-105"
                          : "bg-royal/5 text-ink/70 hover:bg-royal/10"
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <aside className="card-cute p-[2px] h-fit sticky top-24">
          <div className="rounded-[2rem] bg-gradient-to-br from-blush/50 to-lilac/30 p-6">
            <h3 className="text-xl font-semibold text-royal flex items-center gap-2">
              <Crown className="h-5 w-5 text-banana-400" />
              Royal checkout
            </h3>
            <p className="mt-3 text-sm text-ink/70">
              Secure Stripe checkout in test mode. Your generosity keeps the
              kingdom fluffy and fabulous.
            </p>
            
            <div className="mt-6 rounded-2xl bg-white/80 backdrop-blur-sm p-4 text-sm text-ink/70 shadow-soft">
              <p className="font-semibold text-royal flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-banana-400 fill-banana-200" />
                Summary
              </p>
              <div className="space-y-2">
                <p className="flex justify-between"><span>Type:</span> <span className="font-medium text-ink">{activeType?.subtitle}</span></p>
                <p className="flex justify-between"><span>Frequency:</span> <span className="font-medium text-ink capitalize">{frequency}</span></p>
                <p className="flex justify-between"><span>Amount:</span> <span className="font-medium text-ink">${amount}</span></p>
                <div className="h-px bg-royal/10 my-2" />
                <p className="flex justify-between">
                  <span>Sponsor:</span> 
                  <span className={`font-medium ${selectedCat ? "text-royal" : "text-ink/40"}`}>
                    {selectedCat ? selectedCat.name : "Not selected"}
                  </span>
                </p>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!selectedCat}
              className={`mt-6 w-full rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-soft transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedCat
                  ? "bg-royal hover:-translate-y-1 hover:bg-ink hover:shadow-glow cursor-pointer"
                  : "bg-ink/30 cursor-not-allowed"
              }`}
            >
              {selectedCat ? (
                <>
                  Proceed to Stripe
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "Select a Royal First"
              )}
            </button>
            
            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-xs text-ink/50">
                <Shield className="h-4 w-4" />
                Secure
              </div>
              <div className="flex items-center gap-1 text-xs text-ink/50">
                <Heart className="h-4 w-4" />
                100% to Cats
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
