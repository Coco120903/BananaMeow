export default function OriginStory() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2.5rem] p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
              The Origin
            </p>
            <h2 className="mt-3 text-3xl font-bold text-royal md:text-4xl">
              Ba–Na–AN: a royal remix
            </h2>
          </div>
          <div className="flex items-center gap-3 text-2xl">
            <span className="rounded-full bg-banana-100 px-4 py-2">Ba</span>
            <span className="rounded-full bg-blush px-4 py-2">Na</span>
            <span className="rounded-full bg-lilac px-4 py-2">AN</span>
          </div>
        </div>
        <p className="mt-6 text-base leading-relaxed text-ink/80 md:text-lg">
          Banana Meow is named after our three founders of fluff: Bane, Nana,
          and Angela (reversed for extra drama). Together they rule a court of 12
          British Shorthair nobles who believe every day is a coronation.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Bane",
              detail: "Master of naps and silent judgment."
            },
            {
              title: "Nana",
              detail: "Queen of snacks and side-eye."
            },
            {
              title: "Angela",
              detail: "Royal stylist with a dramatic tail flick."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-cream px-5 py-4 text-sm transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <p className="text-lg font-semibold text-royal">{item.title}</p>
              <p className="mt-2 text-ink/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
