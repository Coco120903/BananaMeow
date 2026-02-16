import { Crown, Sparkles, Heart, Star, Moon, Zap, Cat } from "lucide-react";
import { FloatingCats } from "./CatDecorations.jsx";

/* ── Inline SVG decorations ── */

function PawPrintSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      <ellipse cx="24" cy="34" rx="10" ry="8" />
      <ellipse cx="14" cy="21" rx="4.5" ry="5" />
      <ellipse cx="24" cy="17" rx="4.5" ry="5" />
      <ellipse cx="34" cy="21" rx="4.5" ry="5" />
      <ellipse cx="9" cy="28" rx="3.5" ry="4" />
      <ellipse cx="39" cy="28" rx="3.5" ry="4" />
    </svg>
  );
}

function CuteCatFaceSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      {/* Left ear — realistic curved triangular shape with fur edge */}
      <path
        d="M22 42C18 28 16 14 20 4c1.5-0.5 3 0.5 4.5 2C28 10 32 22 35 34"
        fill="currentColor" opacity="0.88"
      />
      {/* Left ear fur edge */}
      <path
        d="M18 30c0.5-3 1.5-6 3-9 0.8 2 2 4.5 3.5 7"
        fill="currentColor" opacity="0.6"
      />
      {/* Left inner ear — warm pink with realistic cavity */}
      <path
        d="M23 38C21 28 20 18 22.5 9c1.5 1 3 4 4.5 8 2 5 3.5 12 5 19"
        fill="#FDE2E4" opacity="0.75"
      />
      <path
        d="M24 34c-0.5-5 0-11 1-15.5 1 2 2.2 5 3.2 8.5 0.8 3 1.5 6.5 2 9.5"
        fill="#FFB5A7" opacity="0.45"
      />

      {/* Right ear — realistic curved triangular shape with fur edge */}
      <path
        d="M78 42C82 28 84 14 80 4c-1.5-0.5-3 0.5-4.5 2C72 10 68 22 65 34"
        fill="currentColor" opacity="0.88"
      />
      {/* Right ear fur edge */}
      <path
        d="M82 30c-0.5-3-1.5-6-3-9-0.8 2-2 4.5-3.5 7"
        fill="currentColor" opacity="0.6"
      />
      {/* Right inner ear */}
      <path
        d="M77 38C79 28 80 18 77.5 9c-1.5 1-3 4-4.5 8-2 5-3.5 12-5 19"
        fill="#FDE2E4" opacity="0.75"
      />
      <path
        d="M76 34c0.5-5 0-11-1-15.5-1 2-2.2 5-3.2 8.5-0.8 3-1.5 6.5-2 9.5"
        fill="#FFB5A7" opacity="0.45"
      />

      {/* Head — slightly squished circle like a real British Shorthair */}
      <ellipse cx="50" cy="58" rx="34" ry="30" fill="currentColor" opacity="0.92" />
      {/* Forehead fur highlight */}
      <ellipse cx="50" cy="42" rx="18" ry="6" fill="white" opacity="0.04" />
      {/* Cheek fluff (left) */}
      <ellipse cx="24" cy="64" rx="8" ry="6" fill="currentColor" opacity="0.3" />
      {/* Cheek fluff (right) */}
      <ellipse cx="76" cy="64" rx="8" ry="6" fill="currentColor" opacity="0.3" />

      {/* Eyes — big round anime-style */}
      <ellipse cx="37" cy="55" rx="6" ry="7" fill="white" />
      <ellipse cx="63" cy="55" rx="6" ry="7" fill="white" />
      {/* Iris */}
      <ellipse cx="37.5" cy="56" rx="4" ry="5" fill="#5A3E85" />
      <ellipse cx="63.5" cy="56" rx="4" ry="5" fill="#5A3E85" />
      {/* Pupil */}
      <ellipse cx="37.8" cy="56.5" rx="2.2" ry="3" fill="#2E2437" />
      <ellipse cx="63.8" cy="56.5" rx="2.2" ry="3" fill="#2E2437" />
      {/* Eye sparkle — main */}
      <circle cx="35.5" cy="53.5" r="2" fill="white" />
      <circle cx="61.5" cy="53.5" r="2" fill="white" />
      {/* Eye sparkle — secondary */}
      <circle cx="39" cy="57.5" r="1" fill="white" opacity="0.7" />
      <circle cx="65" cy="57.5" r="1" fill="white" opacity="0.7" />
      {/* Eye sparkle — tiny */}
      <circle cx="36.5" cy="58.5" r="0.5" fill="white" opacity="0.5" />
      <circle cx="62.5" cy="58.5" r="0.5" fill="white" opacity="0.5" />

      {/* Eyelid curve */}
      <path d="M31 50c2-2 5-3 8-2" stroke="currentColor" strokeWidth="0.6" opacity="0.3" fill="none" />
      <path d="M61 48c3-1 6 0 8 2" stroke="currentColor" strokeWidth="0.6" opacity="0.3" fill="none" />

      {/* Nose — heart-shaped triangle */}
      <path d="M48 64c0-1.5 1-3 2-3s2 1.5 2 3c0 1-1 2-2 2.5-1-0.5-2-1.5-2-2.5z" fill="#FFB5A7" />
      {/* Nose highlight */}
      <ellipse cx="49.5" cy="63.5" rx="0.8" ry="0.6" fill="white" opacity="0.4" />

      {/* Mouth — w-shape like a real cat */}
      <path d="M50 66.5c-1 0.5-2.5 2.5-5 3.5-2 0.8-3.5 0.5-4.5-0.5" stroke="#2E2437" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M50 66.5c1 0.5 2.5 2.5 5 3.5 2 0.8 3.5 0.5 4.5-0.5" stroke="#2E2437" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* Whiskers — 3 per side, slightly curved */}
      <path d="M4 52c10 2 18 4 26 5" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M2 58c12 0.5 20 1.5 28 1.5" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M4 64c10-1 18-2.5 26-3" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M96 52c-10 2-18 4-26 5" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M98 58c-12 0.5-20 1.5-28 1.5" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      <path d="M96 64c-10-1-18-2.5-26-3" stroke="currentColor" strokeWidth="0.6" opacity="0.35" fill="none" strokeLinecap="round" />
      {/* Whisker dots */}
      <circle cx="30" cy="60" r="0.8" fill="currentColor" opacity="0.25" />
      <circle cx="30" cy="62.5" r="0.8" fill="currentColor" opacity="0.25" />
      <circle cx="70" cy="60" r="0.8" fill="currentColor" opacity="0.25" />
      <circle cx="70" cy="62.5" r="0.8" fill="currentColor" opacity="0.25" />

      {/* Rosy blush cheeks */}
      <ellipse cx="28" cy="66" rx="5" ry="3" fill="#FDE2E4" opacity="0.55" />
      <ellipse cx="72" cy="66" rx="5" ry="3" fill="#FDE2E4" opacity="0.55" />
      {/* Inner blush glow */}
      <ellipse cx="28" cy="66" rx="3" ry="1.8" fill="#FFB5A7" opacity="0.3" />
      <ellipse cx="72" cy="66" rx="3" ry="1.8" fill="#FFB5A7" opacity="0.3" />
    </svg>
  );
}

function YarnBallSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2.5" />
      <path d="M18 22c8 6 18 2 26 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 34c10-4 20 4 30-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 14c2 10 10 18 6 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M52 36c-4 4-8 2-10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Loose thread */}
      <path d="M50 18c4 6 6 2 8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
    </svg>
  );
}

function FishSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 48 28" fill="currentColor" className={className}>
      <path d="M36 14c0 0 6-6 10-6-4 4-4 8 0 12-4 0-10-6-10-6z" opacity="0.7" />
      <ellipse cx="18" cy="14" rx="16" ry="11" />
      <circle cx="10" cy="12" r="2.5" fill="white" opacity="0.7" />
      <circle cx="10.5" cy="12" r="1.2" fill="#2E2437" />
      {/* Fin detail */}
      <path d="M22 6c2 4 2 8 0 12" stroke="white" strokeWidth="0.8" opacity="0.3" fill="none" />
    </svg>
  );
}

function CrownSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 48 32" fill="currentColor" className={className}>
      <path d="M4 28L8 10l10 8 6-14 6 14 10-8 4 18z" />
      <circle cx="8" cy="10" r="2.5" />
      <circle cx="24" cy="4" r="2.5" />
      <circle cx="40" cy="10" r="2.5" />
      <rect x="4" y="26" width="40" height="3" rx="1.5" opacity="0.8" />
    </svg>
  );
}

function HeartTrailSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 160 24" fill="none" className={className}>
      {[0, 32, 64, 96, 128].map((x, i) => (
        <path
          key={i}
          d={`M${x + 8} 12c0-4 3-7 6-7s6 3 6 7c0 5-6 9-6 9s-6-4-6-9z`}
          fill="currentColor"
          opacity={0.15 + i * 0.06}
        />
      ))}
    </svg>
  );
}

function SparkleStarSvg({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} style={style}>
      <path d="M16 0l2 12 12 2-12 2-2 12-2-12L2 14l12-2z" />
    </svg>
  );
}

/* Tiny animated banana-cat mascot */
function BananaCatSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 80 60" fill="none" className={className}>
      {/* Banana body */}
      <path
        d="M20 48c-2-8 0-20 8-30 6-8 16-12 26-12 8 0 14 4 16 10 2 8-2 18-10 26-6 6-14 10-22 10-8 0-16-1-18-4z"
        fill="#FFD966"
      />
      {/* Banana highlight */}
      <path
        d="M30 12c6-4 14-6 20-4 4 2 7 6 7 12"
        stroke="#FFE699" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"
      />
      {/* Cat face on banana */}
      <ellipse cx="42" cy="28" rx="11" ry="10" fill="#FFE699" />
      {/* Cat ears */}
      <path d="M34 20c-1-5 0-9 2-10 1 2 3 5 4 8" fill="#FFD966" />
      <path d="M50 20c1-5 0-9-2-10-1 2-3 5-4 8" fill="#FFD966" />
      <path d="M35 20c-0.5-3 0.5-6 1.5-7 0.5 1.5 1.5 3.5 2.5 5.5" fill="#FDE2E4" opacity="0.6" />
      <path d="M49 20c0.5-3-0.5-6-1.5-7-0.5 1.5-1.5 3.5-2.5 5.5" fill="#FDE2E4" opacity="0.6" />
      {/* Eyes */}
      <ellipse cx="38" cy="27" rx="2.5" ry="3" fill="white" />
      <ellipse cx="46" cy="27" rx="2.5" ry="3" fill="white" />
      <ellipse cx="38.3" cy="27.5" rx="1.5" ry="2" fill="#2E2437" />
      <ellipse cx="46.3" cy="27.5" rx="1.5" ry="2" fill="#2E2437" />
      <circle cx="37.3" cy="26.5" r="0.8" fill="white" />
      <circle cx="45.3" cy="26.5" r="0.8" fill="white" />
      {/* Nose & mouth */}
      <path d="M41 31l1 1.2 1-1.2" fill="#FFB5A7" />
      <path d="M42 32.2c-1 1-2 1-2.5 0.5" stroke="#2E2437" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M42 32.2c1 1 2 1 2.5 0.5" stroke="#2E2437" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="34" cy="31" rx="2" ry="1.2" fill="#FDE2E4" opacity="0.5" />
      <ellipse cx="50" cy="31" rx="2" ry="1.2" fill="#FDE2E4" opacity="0.5" />
      {/* Tiny crown */}
      <path d="M38 17l-1.5-4 2 2.5 1.5-3.5 1.5 3.5 2-2.5-1.5 4z" fill="#FFCC33" />
    </svg>
  );
}

/* Milk bowl SVG for cute detail */
function MilkBowlSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" className={className}>
      <ellipse cx="24" cy="24" rx="20" ry="7" fill="currentColor" opacity="0.15" />
      <path d="M6 18c0-6 8-12 18-12s18 6 18 12c0 4-2 7-4 8H10c-2-1-4-4-4-8z" fill="white" stroke="currentColor" strokeWidth="1" opacity="0.8" />
      <ellipse cx="24" cy="16" rx="14" ry="4" fill="#E8E4F0" opacity="0.5" />
      {/* Milk ripple */}
      <ellipse cx="20" cy="15" rx="3" ry="1" fill="white" opacity="0.6" />
      {/* Heart on bowl */}
      <path d="M22 22c0-1 0.8-1.8 1.5-1.8S25 21 25 22c0 1.2-1.5 2.5-1.5 2.5S22 23.2 22 22z" fill="#FFB5A7" opacity="0.6" />
    </svg>
  );
}

export default function OriginStory() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 md:px-8 overflow-hidden">
      {/* Floating cat silhouettes */}
      <FloatingCats count={5} />

      {/* ── Ambient floating shapes ── */}
      <div className="floating-shape floating-shape-1 top-12 left-6" />
      <div className="floating-shape floating-shape-2 bottom-12 right-6" />
      <div className="floating-shape floating-shape-3 top-1/2 left-1/2 -translate-x-1/2" />
      <div className="floating-shape floating-shape-4 bottom-28 left-16" />

      {/* ── Large blurred background orbs ── */}
      <div className="absolute -top-32 -left-28 w-80 h-80 rounded-full bg-gradient-to-br from-lilac/25 to-blush/15 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-28 -right-24 w-72 h-72 rounded-full bg-gradient-to-tl from-banana-200/30 to-banana-100/20 blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/4 right-0 w-56 h-56 rounded-full bg-gradient-to-bl from-blush/20 to-coral/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-16 w-44 h-44 rounded-full bg-gradient-to-tr from-mint/15 to-sky/10 blur-3xl pointer-events-none animate-float" style={{ animationDelay: "4s" }} />
      <div className="absolute top-0 left-1/3 w-36 h-36 rounded-full bg-banana-100/20 blur-2xl pointer-events-none" />

      {/* Scattered sparkles in the outer area */}
      <SparkleStarSvg className="absolute top-16 right-20 w-4 h-4 text-banana-400/20 animate-sparkle" />
      <SparkleStarSvg className="absolute bottom-24 left-28 w-3 h-3 text-lilac/30 animate-sparkle" style={{ animationDelay: "0.5s" }} />
      <SparkleStarSvg className="absolute top-1/2 right-12 w-3.5 h-3.5 text-coral/15 animate-sparkle" style={{ animationDelay: "1s" }} />

      <div className="card-cute p-[3px]">
        <div className="rounded-[2.3rem] bg-gradient-to-b from-white/[0.97] to-cream/90 backdrop-blur-sm p-8 md:p-14 relative overflow-hidden">

          {/* ── Rich layered background art ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.03] dots-pattern" />

            {/* Dual radial glows */}
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(235,220,249,0.15) 0%, transparent 65%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,230,153,0.1) 0%, transparent 65%)" }} />

            {/* Diagonal stripe texture */}
            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(90,62,133,0.15) 0px, rgba(90,62,133,0.15) 1px, transparent 1px, transparent 16px)",
              }}
            />

            {/* Cross-hatch overlay in centre */}
            <div
              className="absolute top-1/4 left-1/4 w-1/2 h-1/2 opacity-[0.01] rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(90,62,133,0.2) 0px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, rgba(90,62,133,0.2) 0px, transparent 1px, transparent 12px)",
              }}
            />

            {/* Scattered paw prints */}
            <PawPrintSvg className="absolute top-6 right-10 w-10 h-10 text-royal/[0.04] rotate-12" />
            <PawPrintSvg className="absolute bottom-10 left-12 w-8 h-8 text-coral/[0.05] -rotate-[20deg]" />
            <PawPrintSvg className="absolute top-1/3 left-5 w-6 h-6 text-banana-400/[0.05] rotate-45" />
            <PawPrintSvg className="absolute top-2/3 right-8 w-5 h-5 text-lilac/[0.06] -rotate-12" />
            <PawPrintSvg className="absolute bottom-1/3 left-1/3 w-7 h-7 text-mint/[0.04] rotate-[30deg]" />

            {/* Yarn ball — animated */}
            <YarnBallSvg className="absolute bottom-14 right-16 w-18 h-18 text-lilac/[0.06] animate-yarn-roll" />
            <YarnBallSvg className="absolute top-20 left-16 w-12 h-12 text-coral/[0.04] animate-yarn-roll" style={{ animationDelay: "2s", animationDirection: "reverse" }} />

            {/* Cute cat face watermark */}
            <CuteCatFaceSvg className="absolute -bottom-4 right-[18%] w-24 h-24 text-royal/[0.025]" />
            <CuteCatFaceSvg className="absolute top-8 left-[12%] w-16 h-16 text-banana-400/[0.03] rotate-[-8deg]" />

            {/* Fish treat */}
            <FishSvg className="absolute bottom-20 left-8 w-12 h-7 text-royal/[0.035] rotate-12 animate-float" style={{ animationDelay: "1s" }} />
            <FishSvg className="absolute top-1/2 right-6 w-8 h-5 text-coral/[0.03] -rotate-6 animate-float" style={{ animationDelay: "3s" }} />

            {/* Crown watermark */}
            <CrownSvg className="absolute top-14 right-[30%] w-14 h-10 text-banana-400/[0.03]" />

            {/* Banana-cat mascot watermark */}
            <BananaCatSvg className="absolute top-16 right-10 w-20 h-16 opacity-[0.04]" />
            <MilkBowlSvg className="absolute bottom-24 right-[40%] w-12 h-8 text-royal/[0.04]" />

            {/* Heart trail */}
            <HeartTrailSvg className="absolute bottom-6 left-1/4 w-40 text-coral/[0.04]" />

            {/* Sparkle stars scattered */}
            <SparkleStarSvg className="absolute top-12 right-1/3 w-4 h-4 text-banana-300/[0.06] animate-sparkle" />
            <SparkleStarSvg className="absolute bottom-16 left-1/2 w-3 h-3 text-lilac/[0.07] animate-sparkle" style={{ animationDelay: "0.7s" }} />
            <SparkleStarSvg className="absolute top-1/2 left-10 w-3.5 h-3.5 text-coral/[0.05] animate-sparkle" style={{ animationDelay: "1.3s" }} />

            {/* Soft gradient washes at edges */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-lilac/[0.04] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-banana-50/[0.06] to-transparent" />
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-blush/[0.03] to-transparent" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-lilac/[0.03] to-transparent" />
          </div>

          {/* ── Header row ── */}
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-banana-400 via-coral to-lilac" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-ink/40">
                  The Origin
                </p>
                <Sparkles className="h-4 w-4 text-banana-400 animate-sparkle" />
                <div className="h-1.5 w-6 rounded-full bg-gradient-to-r from-lilac to-banana-300 opacity-40" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-royal md:text-4xl lg:text-[2.75rem] leading-tight flex items-center gap-3 flex-wrap">
                Ba&ndash;Na&ndash;AN<span className="bg-gradient-to-r from-banana-400 to-coral bg-clip-text text-transparent">:</span> a royal remix
                <Crown className="h-9 w-9 text-banana-400 animate-wiggle drop-shadow-sm" />
              </h2>
              {/* Underline accent */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-banana-300 via-coral/50 to-lilac/60" />
                <div className="h-1 w-3 rounded-full bg-banana-300/40" />
                <div className="h-1 w-1.5 rounded-full bg-coral/30" />
              </div>
            </div>

            {/* Syllable pills */}
            <div className="flex items-center gap-3">
              {[
                { label: "Ba", Icon: Moon, from: "from-banana-100", to: "to-banana-200", hover: "hover:-rotate-3", iconIdle: "text-royal/50", iconHover: "group-hover:text-royal", shadow: "hover:shadow-[0_8px_25px_rgba(255,217,102,0.3)]" },
                { label: "Na", Icon: Crown, from: "from-blush", to: "to-coral/30", hover: "hover:rotate-3", iconIdle: "text-coral/50", iconHover: "group-hover:text-coral", shadow: "hover:shadow-[0_8px_25px_rgba(255,181,167,0.3)]" },
                { label: "AN", Icon: Sparkles, from: "from-lilac", to: "to-royal/20", hover: "hover:-rotate-3", iconIdle: "text-royal/50", iconHover: "group-hover:text-royal", shadow: "hover:shadow-[0_8px_25px_rgba(235,220,249,0.4)]" },
              ].map((p) => (
                <span
                  key={p.label}
                  className={`group relative rounded-full bg-gradient-to-br ${p.from} ${p.to} px-6 py-3 shadow-soft transition-all duration-300 hover:scale-110 ${p.hover} ${p.shadow} cursor-pointer flex items-center gap-2 overflow-hidden`}
                >
                  {/* Shine overlay */}
                  <span className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  {/* Inner glow ring */}
                  <span className="absolute inset-[2px] rounded-full border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative font-bold tracking-wide text-royal">{p.label}</span>
                  <p.Icon className={`relative h-4 w-4 ${p.iconIdle} ${p.iconHover} transition-colors duration-300`} />
                </span>
              ))}
            </div>
          </div>

          {/* ── Description card ── */}
          <div className="relative mt-10 rounded-3xl bg-gradient-to-br from-cream/70 via-white to-lilac/10 border border-royal/[0.06] px-7 py-6 md:px-10 md:py-8 shadow-[0_4px_20px_rgba(90,62,133,0.05)]">
            {/* Decorative left bar */}
            <div className="absolute left-0 top-5 bottom-5 w-1.5 rounded-full bg-gradient-to-b from-banana-400 via-coral to-lilac" />
            {/* Top-right corner flourish */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-banana-50/50 to-transparent rounded-bl-[3rem] pointer-events-none" />
            {/* Tiny cat icon */}
            <Cat className="absolute top-4 right-5 w-4 h-4 text-royal/[0.08]" />
            <p className="text-base leading-[1.8] text-ink/75 md:text-lg pl-4">
              Banana Meow is named after our three founders of fluff:{" "}
              <span className="font-bold text-royal bg-banana-50/60 px-1.5 py-0.5 rounded-lg">Bane</span>,{" "}
              <span className="font-bold text-royal bg-blush/40 px-1.5 py-0.5 rounded-lg">Nana</span>, and{" "}
              <span className="font-bold text-royal bg-lilac/30 px-1.5 py-0.5 rounded-lg">Angela</span> (reversed for
              extra drama). Together they rule a court of 12 British Shorthair
              nobles who believe every day is a coronation.
            </p>
            {/* Paw prints decorating bottom-right */}
            <PawPrintSvg className="absolute bottom-3 right-6 w-5 h-5 text-royal/[0.05] rotate-[25deg]" />
            <PawPrintSvg className="absolute bottom-5 right-14 w-3.5 h-3.5 text-coral/[0.06] -rotate-12" />
          </div>

          {/* ── Divider with cat face ── */}
          <div className="divider-elegant my-12">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-banana-100 via-blush/80 to-lilac flex items-center justify-center shadow-soft ring-2 ring-white/60">
              <CuteCatFaceSvg className="w-7 h-7 text-royal/70" />
            </div>
          </div>

          {/* ── Founder cards ── */}
          <div className="relative grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Bane",
                subtitle: "The Sleepy King",
                icon: Moon,
                detail: "Master of naps and silent judgment. Reigns over the softest cushion in the palace.",
                gradient: "from-banana-50 via-banana-50/70 to-banana-100/80",
                iconColor: "text-banana-500",
                accentBorder: "border-banana-300/30",
                ring: "ring-banana-200/50",
                glow: "group-hover:shadow-[0_12px_35px_rgba(255,217,102,0.2)]",
                accentLine: "from-banana-300 to-banana-400",
              },
              {
                title: "Nana",
                subtitle: "The Snack Queen",
                icon: Crown,
                detail: "Queen of snacks and side-eye. Her disapproving gaze commands the whole court.",
                gradient: "from-blush/60 via-blush/30 to-lilac/30",
                iconColor: "text-coral",
                accentBorder: "border-blush/40",
                ring: "ring-blush/50",
                glow: "group-hover:shadow-[0_12px_35px_rgba(255,181,167,0.2)]",
                accentLine: "from-coral to-blush",
              },
              {
                title: "Angela",
                subtitle: "The Royal Stylist",
                icon: Zap,
                detail: "Royal stylist with a dramatic tail flick. Every entrance is a runway moment.",
                gradient: "from-lilac/50 via-lilac/30 to-mint/30",
                iconColor: "text-royal",
                accentBorder: "border-lilac/40",
                ring: "ring-lilac/50",
                glow: "group-hover:shadow-[0_12px_35px_rgba(235,220,249,0.3)]",
                accentLine: "from-lilac to-royal/40",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group rounded-3xl bg-gradient-to-br ${item.gradient} border ${item.accentBorder} px-6 pt-6 pb-7 text-sm transition-all duration-300 ease-out hover:-translate-y-3 hover:ring-2 ${item.ring} ${item.glow} cursor-pointer relative overflow-hidden`}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {/* Corner glow arc */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-bl-[5rem] pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
                  {/* Secondary corner decoration */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-[3rem] pointer-events-none" />
                  {/* Watermark paw */}
                  <PawPrintSvg className="absolute top-3 right-3 w-8 h-8 text-ink/[0.035] rotate-12 pointer-events-none group-hover:rotate-[20deg] transition-transform duration-500" />
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.accentLine} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-royal flex items-center gap-2">
                        {item.title}
                        <Star className="h-3.5 w-3.5 text-banana-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-[72deg]" />
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/35 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-1 ring-white/50">
                      <Icon className={`h-5.5 w-5.5 ${item.iconColor}`} />
                    </div>
                  </div>
                  <p className="relative mt-4 text-ink/65 leading-relaxed">{item.detail}</p>
                  {/* Hover sparkle */}
                  <SparkleStarSvg className="absolute bottom-4 right-5 w-3 h-3 text-banana-300/0 group-hover:text-banana-300/30 transition-colors duration-500" />
                </div>
              );
            })}
          </div>

          {/* ── Fun fact ribbon ── */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-banana-50 via-blush/30 to-lilac/30 border border-royal/[0.06] px-5 py-2.5 text-xs text-ink/60">
              <Cat className="w-3.5 h-3.5 text-royal/50" />
              <span>12 British Shorthairs &middot; 1 royal court &middot; Infinite fluff</span>
              <PawPrintSvg className="w-3.5 h-3.5 text-royal/30" />
            </div>
          </div>

          {/* ── Banana Cat Mascot Banner ── */}
          <div className="mt-8 flex items-center justify-center">
            <div className="relative flex items-center gap-5 rounded-3xl bg-gradient-to-r from-banana-50/80 via-banana-100/50 to-cream/60 border border-banana-300/20 px-6 py-4 shadow-[0_2px_16px_rgba(255,204,51,0.1)]">
              {/* Mascot */}
              <div className="flex-shrink-0 animate-float" style={{ animationDuration: "4s" }}>
                <BananaCatSvg className="w-16 h-12" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-royal flex items-center gap-1.5">
                  Royal Mascot
                  <CrownSvg className="w-4 h-3 text-banana-400" />
                </p>
                <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">
                  The banana-cat guards this realm with adorable vigilance.
                </p>
              </div>
              {/* Sparkles around mascot */}
              <SparkleStarSvg className="absolute -top-2 left-8 w-3 h-3 text-banana-400/30 animate-sparkle" />
              <SparkleStarSvg className="absolute -bottom-1 right-12 w-2.5 h-2.5 text-lilac/40 animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <SparkleStarSvg className="absolute top-1 right-4 w-2 h-2 text-coral/25 animate-sparkle" style={{ animationDelay: "1s" }} />
            </div>
          </div>

          {/* ── Quote banner ── */}
          <div className="mt-8 flex items-center justify-center">
            <div className="group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-royal via-royal/90 to-royal/80 px-8 py-5 text-sm font-medium text-white shadow-glow overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(90,62,133,0.35)]">
              {/* Animated shine strip */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              {/* Decorative dot texture */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
              {/* Top shimmer edge */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <Heart className="relative h-5 w-5 fill-coral text-coral animate-pulse-soft flex-shrink-0" />
              <span className="relative text-[0.9rem] leading-relaxed">&ldquo;Every cat is royalty, but some are more chonky than others.&rdquo;</span>
              <CuteCatFaceSvg className="relative h-6 w-6 text-banana-200/80 flex-shrink-0" />
            </div>
          </div>

          {/* ── Bottom decorative footer ── */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {/* Mini cat & milk bowl scene */}
            <div className="flex items-end gap-3 opacity-[0.12]">
              <CuteCatFaceSvg className="w-8 h-8 text-royal" />
              <MilkBowlSvg className="w-10 h-7 text-royal" />
              <FishSvg className="w-7 h-4 text-royal rotate-6" />
            </div>
            {/* Heart trail */}
            <HeartTrailSvg className="w-44 text-coral/20" />
            {/* Tiny paw trail */}
            <div className="flex items-center gap-4">
              {[18, -12, 22, -8, 15, -20, 10].map((rot, i) => (
                <PawPrintSvg
                  key={i}
                  className="w-2.5 h-2.5 text-royal/[0.07]"
                  style={{ transform: `rotate(${rot}deg)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
