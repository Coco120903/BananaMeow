import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE } from "../lib/api.js";
import { Utensils, Pill, HeartPulse, Heart, Cat, Crown, Check } from "lucide-react";
import { catBios } from "../content/catBios.js";

const donationTypes = [
  {
    id: "food",
    title: "Cat Food",
    icon: Utensils,
    subtitle: "Feed a Chonk",
    goal: 1200,
    funded: 720
  },
  {
    id: "vitamins",
    title: "Vitamins",
    icon: Pill,
    subtitle: "Shiny Coat Sponsor",
    goal: 800,
    funded: 520
  },
  {
    id: "vet",
    title: "Vet Visits",
    icon: HeartPulse,
    subtitle: "Health Guardian",
    goal: 2000,
    funded: 1320
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
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Support the Royals
          <Heart className="h-4 w-4 text-royal" />
        </p>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">
          Become a royal sponsor
        </h1>
        <p className="text-base text-ink/70 md:text-lg">
          Choose a royal to support and keep the court thriving.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Cat className="h-5 w-5 text-royal" />
          <Crown className="h-5 w-5 text-royal" />
          <h2 className="text-xl font-semibold text-royal">
            Choose a Royal to Support
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catList.map((cat, index) => {
            const isSelected = selectedCat?.name === cat.name;
            return (
              <button
                key={cat._id || cat.id || cat.name || index}
                type="button"
                onClick={() => {
                  setSelectedCat(cat);
                  setError("");
                }}
                className={`group relative rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-royal bg-white shadow-soft"
                    : "border-royal/20 bg-cream hover:border-royal/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-royal">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-banana-100">
                  <Cat className="h-8 w-8 text-royal" />
                </div>
                <h3 className="font-semibold text-royal">{cat.name}</h3>
                <p className="mt-1 text-xs text-ink/60">{cat.nickname}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {donationTypes.map((type) => {
              const progress = Math.round((type.funded / type.goal) * 100);
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-[2rem] border px-5 py-4 text-left transition ${
                    selectedType === type.id
                      ? "border-royal bg-white shadow-soft"
                      : "border-transparent bg-cream"
                  }`}
                >
                  <p className="flex items-center gap-2 text-lg font-semibold text-royal">
                    <IconComponent className="h-5 w-5" />
                    {type.title}
                  </p>
                  <p className="text-sm text-ink/60">{type.subtitle}</p>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-banana-100">
                    <div
                      className="h-full rounded-full bg-royal"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-ink/60">
                    {progress}% funded
                  </p>
                </button>
              );
            })}
          </div>

          <div className="card-soft rounded-[2rem] p-6">
            <p className="text-sm font-semibold text-ink/60">Donation Type</p>
            <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-royal">
              {activeType?.icon && (() => {
                const ActiveIcon = activeType.icon;
                return <ActiveIcon className="h-6 w-6" />;
              })()}
              {activeType?.title}
            </h2>
            <p className="mt-2 text-sm text-ink/60">{activeType?.subtitle}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setFrequency("one-time")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  frequency === "one-time"
                    ? "bg-royal text-white"
                    : "bg-cream text-ink/70"
                }`}
              >
                One-time
              </button>
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  frequency === "monthly"
                    ? "bg-royal text-white"
                    : "bg-cream text-ink/70"
                }`}
              >
                Monthly
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-ink/60">
                Donation amount
              </label>
              <div className="mt-3 flex items-center gap-3">
                {[15, 25, 50, 100].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      amount === value
                        ? "bg-royal text-white"
                        : "bg-cream text-ink/70"
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[2.5rem] bg-blush p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-royal">
            Royal checkout
          </h3>
          <p className="mt-3 text-sm text-ink/70">
            Secure Stripe checkout in test mode. Your generosity keeps the
            kingdom fluffy and fabulous.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-ink/70">
            <p className="font-semibold text-ink">Summary</p>
            <p className="mt-2">Type: {activeType?.subtitle}</p>
            <p>Frequency: {frequency}</p>
            <p>Amount: ${amount}</p>
            <p className={selectedCat ? "" : "text-ink/50"}>
              Sponsor: {selectedCat ? selectedCat.name : "Not selected"}
            </p>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl bg-blush/50 border border-royal/20 px-4 py-3 text-sm text-royal">
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!selectedCat}
            className={`mt-6 w-full rounded-full px-6 py-3 text-base font-semibold text-white shadow-soft transition-transform transition-colors duration-200 ease-out ${
              selectedCat
                ? "bg-royal hover:-translate-y-0.5 hover:bg-ink cursor-pointer"
                : "bg-ink/40 cursor-not-allowed"
            }`}
          >
            {selectedCat ? "Proceed to Stripe" : "Select a Royal First"}
          </button>
        </aside>
      </div>
    </section>
  );
}
