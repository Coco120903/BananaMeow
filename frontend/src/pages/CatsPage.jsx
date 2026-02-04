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
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex flex-col gap-3 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Meet the 12 Cats
        </p>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">
          The Chonky Royal Court
        </h1>
        <p className="text-base text-ink/70 md:text-lg">
          Each royal comes with a title, a personality, and a slightly dramatic
          fun fact.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((cat, index) => (
          <article
            key={cat.name ?? index}
            className="card-soft flex h-full flex-col gap-4 rounded-[2rem] p-6"
          >
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-banana-100 via-banana-200 to-royal/10">
              <Cat className="h-16 w-16 text-royal" />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-royal">
                {cat.name}
              </h2>
              <span className="rounded-full bg-banana-100 px-3 py-1 text-xs font-semibold text-royal">
                {cat.nickname}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink/70">Traits</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(cat.traits || []).map((trait) => (
                  <span
                    key={trait}
                    className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink/60"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-sm text-ink/70">
              {cat.personality ? (
                <p>
                  <span className="font-semibold text-ink">Personality:</span>{" "}
                  {cat.personality}
                </p>
              ) : null}
              <p>
                <span className="font-semibold text-ink">Fun fact:</span>{" "}
                {cat.funFact}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-ink">Favorite:</span>{" "}
                {cat.favoriteThing}
              </p>
            </div>
            <Link
              to={`/donate?cat=${encodeURIComponent(cat.name)}`}
              className="btn-primary mt-auto w-full text-center"
            >
              Support Me
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
