import { funnyQuotes } from "../content/funnyQuotes.js";
import { educationalPosts } from "../content/educationalPosts.js";
import { memeCaptions } from "../content/memeCaptions.js";
import { Crown, Sparkles, Heart, Star, Quote, BookOpen, MessageCircle, Cat, Users, Gift, Award } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    { name: "Bane", role: "Chief Nap Officer", icon: Cat },
    { name: "Nana", role: "Head of Judgment", icon: Crown },
    { name: "Angela", role: "Royal Stylist", icon: Sparkles }
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 top-20 right-10" />
      <div className="floating-shape floating-shape-2 bottom-40 left-10" />
      <div className="floating-shape floating-shape-3 top-1/2 right-1/4" />
      
      {/* Hero Card */}
      <div className="card-cute p-[3px] mb-12">
        <div className="rounded-[2.3rem] bg-white p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 dots-pattern" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-banana-400 to-coral" />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
                About Banana Meow
              </p>
              <Crown className="h-4 w-4 text-banana-400 animate-wiggle" />
            </div>
            <h1 className="text-3xl font-bold text-royal md:text-4xl flex items-center gap-3 flex-wrap">
              Cute, royal, dramatic
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac shadow-soft">
                <Star className="h-6 w-6 text-royal" />
              </span>
            </h1>
            <p className="mt-4 text-base text-ink/70 md:text-lg max-w-3xl leading-relaxed">
              Banana Meow is named after our founding trio: <span className="font-semibold text-royal">Ba – Bane</span>, <span className="font-semibold text-royal">Na – Nana</span>,
              and <span className="font-semibold text-royal">AN – Angela</span> (reversed for flair). Together they reign over 12
              British Shorthair cats with plush coats, proud chins, and a touch of
              theatrical energy.
            </p>
            
            {/* Team cards */}
            <div className="mt-8 grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-4">
              {teamMembers.map((member, index) => {
                const Icon = member.icon;
                return (
                  <div
                    key={member.name}
                    className="group flex flex-col md:flex-row items-center gap-2 md:gap-3 rounded-lg md:rounded-2xl bg-gradient-to-br from-banana-50 to-lilac/20 px-2 py-2 md:px-5 md:py-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-7 w-7 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/80 flex items-center justify-center group-hover:rotate-6 transition-transform flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 md:h-5 md:w-5 text-royal" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="font-semibold text-xs md:text-base text-royal">{member.name}</p>
                      <p className="text-[0.65rem] md:text-xs text-ink/60">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Cat, value: "12", label: "Royal Cats" },
          { icon: Users, value: "5K+", label: "Supporters" },
          { icon: Gift, value: "100%", label: "Love Given" },
          { icon: Award, value: "2+", label: "Years Running" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="feature-card hover-bounce text-center py-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/50 flex items-center justify-center shadow-soft mb-3">
                <Icon className="h-6 w-6 text-royal" />
              </div>
              <p className="text-2xl font-bold text-royal">{stat.value}</p>
              <p className="text-sm text-ink/60">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Royal Quotes */}
        <div className="feature-card hover-tilt p-6 bg-gradient-to-br from-blush/40 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
              <Quote className="h-5 w-5 text-royal" />
            </div>
            <h2 className="text-lg font-semibold text-royal">Royal Quotes</h2>
          </div>
          <ul className="space-y-3 text-sm text-ink/70">
            {funnyQuotes.map((quote, index) => (
              <li key={index} className="flex items-start gap-2 p-3 rounded-xl bg-white/60 transition-all duration-300 hover:bg-white hover:shadow-soft">
                <Heart className="h-4 w-4 text-coral mt-0.5 flex-shrink-0" />
                <span>"{quote}"</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Education Corner */}
        <div className="feature-card hover-tilt p-6 bg-gradient-to-br from-lilac/40 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-royal" />
            </div>
            <h2 className="text-lg font-semibold text-royal">Education Corner</h2>
          </div>
          <ul className="space-y-3 text-sm text-ink/70">
            {educationalPosts.map((post, index) => (
              <li key={index} className="p-3 rounded-xl bg-white/60 transition-all duration-300 hover:bg-white hover:shadow-soft">
                <p className="font-semibold text-royal flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-banana-400" />
                  {post.title}
                </p>
                <p className="mt-1 text-ink/60">{post.summary}</p>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Meme Captions */}
        <div className="feature-card hover-tilt p-6 bg-gradient-to-br from-banana-100/60 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white shadow-soft flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-royal" />
            </div>
            <h2 className="text-lg font-semibold text-royal">Meme Captions</h2>
          </div>
          <ul className="space-y-3 text-sm text-ink/70">
            {memeCaptions.map((caption, index) => (
              <li key={index} className="flex items-start gap-2 p-3 rounded-xl bg-white/60 transition-all duration-300 hover:bg-white hover:shadow-soft">
                <Star className="h-4 w-4 text-banana-400 mt-0.5 flex-shrink-0" />
                <span>{caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="card-cute inline-block p-[2px]">
          <div className="rounded-2xl bg-white px-8 py-6">
            <p className="text-lg font-semibold text-royal flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 text-coral fill-coral" />
              Want to join the kingdom?
            </p>
            <p className="text-sm text-ink/60 mt-1">Become a supporter and help our royal cats thrive!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
