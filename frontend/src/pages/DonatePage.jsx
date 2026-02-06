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
        if (!response.ok) throw new Error("Failed to load cats");
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
      if (found) setSelectedCat(found);
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
    const payload = { amount, frequency, type: selectedType, cat: selectedCat.name };
    const response = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url;
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-12">
        <div className="flex items-center gap-2 w-fit bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal">
          Support the Royals <Heart className="h-3 w-3 fill-royal" />
        </div>
        <h1 className="text-4xl font-black text-royal md:text-6xl leading-tight">
          Become a royal sponsor
        </h1>
      </div>

      {/* Step 1: Cat Selection */}
      <div className="mb-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-royal p-2 rounded-lg text-white shadow-[4px_4px_0px_0px_#facc15]">
            <Cat className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-royal uppercase tracking-tighter">
            1. Choose Your Royal
          </h2>
        </div>
        
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {catList.map((cat, index) => {
            const isSelected = selectedCat?.name === cat.name;
            return (
              <button
                key={cat.name || index}
                type="button"
                onClick={() => { setSelectedCat(cat); setError(""); }}
                className={`group relative rounded-[2rem] border-[4px] p-4 text-left transition-all ${
                  isSelected
                    ? "border-royal bg-banana-400 translate-x-1 translate-y-1 shadow-none"
                    : "border-royal bg-white shadow-[6px_6px_0px_0px_#171717] hover:-translate-y-1"
                }`}
              >
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-royal bg-white ${isSelected ? 'rotate-3' : ''}`}>
                  <Cat className="h-6 w-6 text-royal" />
                </div>
                <h3 className="font-black text-royal text-lg leading-none">{cat.name}</h3>
                <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-royal' : 'text-royal/40'}`}>
                  {cat.nickname}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-10">
          {/* Step 2: Goal Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {donationTypes.map((type) => {
              const progress = Math.round((type.funded / type.goal) * 100);
              const IconComponent = type.icon;
              const isTypeSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`rounded-[2rem] border-[4px] p-5 text-left transition-all ${
                    isTypeSelected
                      ? "border-royal bg-white shadow-[8px_8px_0px_0px_#facc15]"
                      : "border-royal bg-cream/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <IconComponent className={`h-6 w-6 mb-2 ${isTypeSelected ? 'text-royal' : 'text-royal/40'}`} />
                  <p className="text-lg font-black text-royal leading-tight">{type.title}</p>
                  <div className="mt-4 h-4 w-full overflow-hidden rounded-full border-2 border-royal bg-white">
                    <div className="h-full bg-royal" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs font-black text-royal/60">{progress}% FUNDED</p>
                </button>
              );
            })}
          </div>

          {/* Step 3: Amount Toggles */}
          <div className="rounded-[3rem] border-[6px] border-royal bg-white p-8 shadow-[12px_12px_0px_0px_#171717]">
            <h2 className="flex items-center gap-3 text-2xl font-black text-royal uppercase tracking-tighter mb-8">
              {activeType?.icon && <activeType.icon className="h-7 w-7" />}
              {activeType?.title} Details
            </h2>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-royal/40 mb-3">Frequency</p>
                <div className="flex gap-3">
                  {["one-time", "monthly"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`flex-1 rounded-xl border-[3px] border-royal py-3 font-black uppercase tracking-tight transition-all ${
                        frequency === f ? "bg-royal text-white -translate-y-1 shadow-[4px_4px_0px_0px_#facc15]" : "bg-white text-royal hover:bg-blush"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-royal/40 mb-3">Amount</p>
                <div className="grid grid-cols-4 gap-3">
                  {[15, 25, 50, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value)}
                      className={`rounded-xl border-[3px] border-royal py-3 font-black transition-all ${
                        amount === value ? "bg-banana-400 text-royal -translate-y-1 shadow-[4px_4px_0px_0px_#171717]" : "bg-white text-royal"
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

        {/* Sidebar Summary */}
        <aside className="h-fit sticky top-8 rounded-[2.5rem] bg-blush border-[5px] border-royal p-8 shadow-[12px_12px_0px_0px_#171717]">
          <h3 className="text-3xl font-black text-royal uppercase tracking-tighter mb-6">Summary</h3>
          
          <div className="space-y-4 font-bold text-royal">
            <div className="flex justify-between border-b-2 border-royal/10 pb-2">
              <span className="opacity-60 uppercase text-[10px]">Royal</span>
              <span className={selectedCat ? "text-royal" : "text-royal/30"}>
                {selectedCat ? selectedCat.name : "Choose One 🐾"}
              </span>
            </div>
            <div className="flex justify-between border-b-2 border-royal/10 pb-2">
              <span className="opacity-60 uppercase text-[10px]">Support</span>
              <span>{activeType?.title}</span>
            </div>
            <div className="flex justify-between border-b-2 border-royal/10 pb-2">
              <span className="opacity-60 uppercase text-[10px]">Schedule</span>
              <span className="capitalize">{frequency}</span>
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <span className="text-xl font-black uppercase">Total</span>
              <span className="text-4xl font-black text-royal">${amount}</span>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-white border-[3px] border-royal p-4 rounded-xl font-bold text-sm text-red-500 animate-bounce">
              ⚠️ {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!selectedCat}
            className={`mt-8 w-full border-[4px] border-royal py-5 rounded-2xl text-xl font-black uppercase tracking-tight transition-all ${
              selectedCat 
                ? "bg-banana-400 text-royal shadow-[8px_8px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-white" 
                : "bg-royal/10 text-royal/30 cursor-not-allowed"
            }`}
          >
            {selectedCat ? "Proceed to Stripe 👑" : "Select a Royal"}
          </button>
        </aside>
      </div>
    </section>
  );
}