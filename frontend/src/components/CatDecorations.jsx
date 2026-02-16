/**
 * CatDecorations - Reusable cat-themed decorative elements
 * Adds floating cat silhouettes, whisker dividers, paw trails, 
 * speech bubbles, and yarn ball accents throughout the site.
 */

// Floating cat silhouettes for backgrounds
export function FloatingCats({ count = 5, className = "" }) {
  const catPoses = [
    // Sitting cat
    (size) => (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d="M35 20 L30 5 L40 15 M65 20 L70 5 L60 15 M30 25 Q25 25 22 35 Q20 50 25 65 Q28 75 35 80 L40 90 L45 85 L55 85 L60 90 L65 80 Q72 75 75 65 Q80 50 78 35 Q75 25 70 25 Q55 18 50 20 Q45 18 30 25 M40 40 Q42 42 44 40 M56 40 Q58 42 60 40 M48 48 Q50 50 52 48" 
          fill="currentColor" stroke="none" />
      </svg>
    ),
    // Stretching cat
    (size) => (
      <svg viewBox="0 0 120 60" width={size * 1.2} height={size * 0.6}>
        <path d="M15 15 L10 3 L20 12 M30 15 L35 3 L25 12 M10 20 Q5 20 5 30 Q5 40 15 45 L20 50 L25 45 Q30 42 40 40 L80 38 Q95 38 100 42 L105 50 L110 42 Q115 35 110 28 Q105 20 95 20 Q80 18 70 20 Q55 15 40 18 Q25 15 10 20 M18 28 Q20 30 22 28 M25 28 Q27 30 29 28 M20 33 Q22 35 24 33"
          fill="currentColor" stroke="none" />
      </svg>
    ),
    // Cat lying down
    (size) => (
      <svg viewBox="0 0 100 50" width={size} height={size * 0.5}>
        <path d="M20 10 L15 0 L25 8 M35 10 L40 0 L30 8 M15 15 Q8 15 5 25 Q5 35 15 38 L20 42 L25 38 Q35 36 50 35 L75 35 Q85 35 90 38 L95 42 L98 38 Q100 32 95 28 Q88 20 75 22 Q60 15 45 18 Q30 12 15 15 M22 22 Q24 24 26 22 M30 22 Q32 24 34 22 M25 27 Q27 28 29 27"
          fill="currentColor" stroke="none" />
      </svg>
    )
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(count)].map((_, i) => {
        const PoseSvg = catPoses[i % catPoses.length];
        const size = 40 + Math.random() * 30;
        return (
          <div
            key={i}
            className="cat-silhouette text-royal"
            style={{
              left: `${5 + Math.random() * 85}%`,
              top: `${5 + Math.random() * 85}%`,
              opacity: 0.03 + Math.random() * 0.03,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {PoseSvg(size)}
          </div>
        );
      })}
    </div>
  );
}

// Whisker divider between sections — SVG cat face instead of emoji
export function WhiskerDivider({ className = "" }) {
  return (
    <div className={`paw-divider ${className}`}>
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-banana-100 via-blush/60 to-lilac/40 shadow-soft"
        style={{ animation: 'lazy-cat 3s ease-in-out infinite' }}
      >
        {/* Detailed cat face SVG */}
        <svg viewBox="0 0 64 64" width="26" height="26" fill="none" className="text-royal">
          {/* Ears */}
          <path d="M14 24L8 6l14 12" fill="currentColor" opacity="0.85" />
          <path d="M50 24l6-18-14 12" fill="currentColor" opacity="0.85" />
          {/* Inner ears */}
          <path d="M14 22l-3-10 8 7" fill="#FDE2E4" />
          <path d="M50 22l3-10-8 7" fill="#FDE2E4" />
          {/* Head */}
          <ellipse cx="32" cy="36" rx="22" ry="20" fill="currentColor" opacity="0.9" />
          {/* Eyes */}
          <ellipse cx="24" cy="32" rx="3.5" ry="4" fill="white" />
          <ellipse cx="40" cy="32" rx="3.5" ry="4" fill="white" />
          <ellipse cx="24.5" cy="32.5" rx="2" ry="2.5" fill="#2E2437" />
          <ellipse cx="40.5" cy="32.5" rx="2" ry="2.5" fill="#2E2437" />
          {/* Eye shine */}
          <circle cx="23" cy="31" r="1" fill="white" />
          <circle cx="39" cy="31" r="1" fill="white" />
          {/* Nose */}
          <path d="M30 38l2 2.5 2-2.5" fill="#FFB5A7" />
          {/* Mouth */}
          <path d="M32 40.5c-2 2-4 2-5 1" stroke="#2E2437" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M32 40.5c2 2 4 2 5 1" stroke="#2E2437" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="6" y1="34" x2="20" y2="36" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          <line x1="6" y1="38" x2="20" y2="38" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          <line x1="6" y1="42" x2="20" y2="40" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          <line x1="58" y1="34" x2="44" y2="36" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          <line x1="58" y1="38" x2="44" y2="38" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          <line x1="58" y1="42" x2="44" y2="40" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
          {/* Blush spots */}
          <ellipse cx="18" cy="40" rx="3" ry="2" fill="#FDE2E4" opacity="0.7" />
          <ellipse cx="46" cy="40" rx="3" ry="2" fill="#FDE2E4" opacity="0.7" />
        </svg>
      </span>
    </div>
  );
}

// Inline paw-print SVG (replaces emoji)
function PawSvg({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      {/* Main pad */}
      <ellipse cx="24" cy="34" rx="10" ry="8" />
      {/* Toe beans */}
      <ellipse cx="14" cy="21" rx="4.5" ry="5" />
      <ellipse cx="24" cy="17" rx="4.5" ry="5" />
      <ellipse cx="34" cy="21" rx="4.5" ry="5" />
      {/* Extra outer toes */}
      <ellipse cx="9" cy="28" rx="3.5" ry="4" />
      <ellipse cx="39" cy="28" rx="3.5" ry="4" />
    </svg>
  );
}

// Paw print trail decoration — SVG paws instead of emoji
export function PawTrail({ count = 5, direction = "horizontal", className = "" }) {
  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col' : ''} items-center gap-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <span
          key={i}
          className="inline-block w-5 h-5 text-royal opacity-20"
          style={{
            animation: `slide-up-fade 0.4s ease-out ${i * 0.15}s backwards`,
            transform: `rotate(${direction === 'horizontal' ? 90 + (i % 2 === 0 ? -15 : 15) : (i % 2 === 0 ? -25 : 25)}deg)`
          }}
        >
          <PawSvg />
        </span>
      ))}
    </div>
  );
}

// Cat speech bubble (meow tooltip)
export function MeowBubble({ text = "Meow!", children, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className="meow-bubble absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 pointer-events-none whitespace-nowrap z-20">
        <span className="text-sm font-medium text-royal">{text}</span>
      </div>
    </div>
  );
}

// Yarn ball accent (animated circular decoration)
export function YarnBall({ size = "md", color = "royal", className = "" }) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-14 h-14" };
  const colors = {
    royal: "from-lilac to-royal/30",
    banana: "from-banana-200 to-banana-400/30",
    coral: "from-blush to-coral/30",
    mint: "from-mint to-sky/30"
  };

  return (
    <div className={`yarn-ball ${sizes[size]} rounded-full bg-gradient-to-br ${colors[color]} grid place-items-center shadow-soft ${className}`}>
      <div className="w-2/3 h-2/3 rounded-full border-2 border-white/40 border-dashed" 
        style={{ animation: 'spin 8s linear infinite' }} 
      />
    </div>
  );
}

// Cat ears wrapper - adds cat ears to any element  
export function CatEars({ children, className = "", small = false }) {
  return (
    <div className={`relative ${className}`}>
      {/* Left ear */}
      <div 
        className={`absolute ${small ? '-top-2 left-1 w-3 h-3' : '-top-3 left-2 w-5 h-5'} bg-gradient-to-br from-lilac to-blush rounded-[2px_10px_0_10px] -rotate-[15deg] z-10 transition-transform duration-300`}
        style={{ transformOrigin: 'bottom center' }}
      >
        <div className={`absolute ${small ? 'top-[2px] left-[2px] w-1.5 h-1.5' : 'top-[3px] left-[3px] w-2.5 h-2.5'} bg-gradient-to-br from-blush to-coral/50 rounded-[1px_6px_0_6px] -rotate-[0deg]`} />
      </div>
      {/* Right ear */}
      <div 
        className={`absolute ${small ? '-top-2 right-1 w-3 h-3' : '-top-3 right-2 w-5 h-5'} bg-gradient-to-br from-lilac to-blush rounded-[10px_2px_10px_0] rotate-[15deg] z-10 transition-transform duration-300`}
        style={{ transformOrigin: 'bottom center' }}
      >
        <div className={`absolute ${small ? 'top-[2px] right-[2px] w-1.5 h-1.5' : 'top-[3px] right-[3px] w-2.5 h-2.5'} bg-gradient-to-br from-blush to-coral/50 rounded-[6px_1px_6px_0] rotate-[0deg]`} />
      </div>
      {children}
    </div>
  );
}

// Floating fish decoration
export function FloatingFish({ className = "" }) {
  return (
    <span className={`inline-block ${className}`} style={{ animation: 'float 3s ease-in-out infinite' }}>
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
        <path d="M18 8C18 8 22 4 24 4C22 6 22 10 24 12C22 12 18 8 18 8Z" fill="currentColor" opacity="0.3" />
        <ellipse cx="10" cy="8" rx="10" ry="7" fill="currentColor" opacity="0.15" />
        <circle cx="6" cy="7" r="1.5" fill="currentColor" opacity="0.3" />
      </svg>
    </span>
  );
}

export default {
  FloatingCats,
  WhiskerDivider,
  PawTrail,
  MeowBubble,
  YarnBall,
  CatEars,
  FloatingFish
};
