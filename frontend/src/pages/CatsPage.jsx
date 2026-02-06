import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cat } from "lucide-react";
import { catBios } from "../content/catBios.js";
import { API_BASE } from "../lib/api.js";

export default function CatsPage() {
  const [cats, setCats] = useState([]);

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

  const list = cats.length > 0 ? cats : catBios;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-16">
        <div className="inline-block w-fit bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-royal">
          🐾 Meet the 12 Cats
        </div>
        <h1 className="text-4xl font-black text-royal md:text-6xl leading-tight">
          The Chonky Royal Court
        </h1>
        <p className="max-w-2xl text-xl font-bold text-ink/70 italic">
          "Each royal comes with a title, a personality, and a slightly dramatic fun fact."
        </p>
      </div>

      {/* Grid of Cat Cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((cat, index) => (
          <article
            key={cat.name ?? index}
            className={`
              group relative flex h-full flex-col gap-6 rounded-[2.5rem] border-[5px] border-royal p-6 transition-all hover:-translate-y-2
              ${index % 3 === 0 ? 'bg-white shadow-[10px_10px_0px_0px_#171717]' : 
                index % 3 === 1 ? 'bg-blush shadow-[10px_10px_0px_0px_#171717]' : 
                'bg-lilac shadow-[10px_10px_0px_0px_#171717]'}
            `}
          >
            {/* Visual Container */}
            <div className="relative overflow-hidden rounded-3xl border-4 border-royal bg-white h-52 flex items-center justify-center shadow-[4px_4px_0px_0px_#171717]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-banana-100 via-transparent to-transparent opacity-50" />
              <Cat className="h-20 w-20 text-royal transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-banana-400 border-2 border-royal px-3 py-1 rounded-lg text-[10px] font-black uppercase rotate-6">
                Royal Resident
              </div>
            </div>

            {/* Title & Nickname */}
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-royal tracking-tighter">
                {cat.name}
              </h2>
              <span className="text-sm font-black uppercase tracking-widest text-royal/50">
                aka "{cat.nickname}"
              </span>
            </div>

            {/* Traits Tags */}
            <div>
              <p className="text-xs font-black uppercase text-royal/40 mb-3 tracking-widest">Traits</p>
              <div className="flex flex-wrap gap-2">
                {(cat.traits || []).map((trait, idx) => (
                  <span
                    key={trait}
                    className={`
                      border-2 border-royal px-3 py-1 text-xs font-black rounded-lg shadow-[2px_2px_0px_0px_#171717]
                      ${idx % 2 === 0 ? 'bg-white' : 'bg-banana-200'}
                    `}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio Details */}
            <div className="space-y-3 text-sm font-bold text-royal/80">
              {cat.personality && (
                <p className="leading-snug">
                  <span className="bg-white border-b-2 border-royal">Personality:</span> {cat.personality}
                </p>
              )}
              <p className="leading-snug">
                <span className="bg-white border-b-2 border-royal">Fun fact:</span> {cat.funFact}
              </p>
              <p className="italic text-royal">
                <span className="not-italic font-black text-royal">Fav:</span> {cat.favoriteThing}
              </p>
            </div>

            {/* Button */}
            <Link
              to={`/donate?cat=${encodeURIComponent(cat.name)}`}
              className="mt-auto block w-full bg-banana-400 border-4 border-royal py-3 rounded-2xl text-center text-sm font-black uppercase tracking-widest shadow-[5px_5px_0px_0px_#171717] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Support Me 🐾
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}