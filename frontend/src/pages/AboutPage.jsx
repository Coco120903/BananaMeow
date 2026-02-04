import { funnyQuotes } from "../content/funnyQuotes.js";
import { educationalPosts } from "../content/educationalPosts.js";
import { memeCaptions } from "../content/memeCaptions.js";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2.5rem] p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          About Banana Meow
        </p>
        <h1 className="mt-3 text-3xl font-bold text-royal md:text-4xl">
          Cute, royal, dramatic — with British Shorthair charm
        </h1>
        <p className="mt-4 text-base text-ink/70 md:text-lg">
          Banana Meow is named after our founding trio: Ba – Bane, Na – Nana,
          and AN – Angela (reversed for flair). Together they reign over 12
          British Shorthair cats with plush coats, proud chins, and a touch of
          theatrical energy.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card-soft rounded-[2rem] bg-blush p-6">
          <h2 className="text-lg font-semibold text-royal">Royal Quotes</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {funnyQuotes.map((quote) => (
              <li key={quote}>"{quote}"</li>
            ))}
          </ul>
        </div>
        <div className="card-soft rounded-[2rem] bg-lilac p-6">
          <h2 className="text-lg font-semibold text-royal">Education Corner</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {educationalPosts.map((post) => (
              <li key={post.title}>
                <p className="font-semibold text-ink">{post.title}</p>
                <p>{post.summary}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-soft rounded-[2rem] bg-banana-100 p-6">
          <h2 className="text-lg font-semibold text-royal">Meme Captions</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            {memeCaptions.map((caption) => (
              <li key={caption}>{caption}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
