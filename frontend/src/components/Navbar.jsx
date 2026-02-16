import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Cat, Crown, ShoppingCart, User, Heart, Sparkles, Menu, X, LogOut, Settings, ChevronDown, Star, Camera } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Sparkles },
  { label: "Meet the Cats", href: "/cats", icon: Cat },
  { label: "Shop", href: "/shop", icon: ShoppingCart },
  { label: "About", href: "/about", icon: Heart },
  { label: "Gallery", href: "/gallery", icon: Camera }
];

export default function Navbar() {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const loginMenuRef = useRef(null);

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        loginMenuRef.current &&
        !loginMenuRef.current.contains(event.target)
      ) {
        setIsLoginOpen(false);
      }
    };

    if (isLoginOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isLoginOpen]);

  const handleLoginClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsLoginOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsLoginOpen(false);
    navigate("/");
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-soft' : 'bg-white/80 backdrop-blur-md'}`}>
      {/* Scroll Progress Bar with paw prints */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-royal via-banana-400 to-coral transition-all duration-150" style={{ width: `${scrollProgress}%` }}>
        {scrollProgress > 5 && (
          <span className="absolute -right-2 -top-2 transition-all duration-150" style={{ filter: 'drop-shadow(0 1px 2px rgba(90,62,133,0.3))' }}>
            <svg viewBox="0 0 48 48" fill="currentColor" className="w-3 h-3 text-royal">
              <ellipse cx="24" cy="34" rx="10" ry="8" />
              <ellipse cx="14" cy="21" rx="4.5" ry="5" />
              <ellipse cx="24" cy="17" rx="4.5" ry="5" />
              <ellipse cx="34" cy="21" rx="4.5" ry="5" />
              <ellipse cx="9" cy="28" rx="3.5" ry="4" />
              <ellipse cx="39" cy="28" rx="3.5" ry="4" />
            </svg>
          </span>
        )}
      </div>
      
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
          <div className="relative cat-ears cat-ears-inner">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-banana-200 via-banana-100 to-lilac/40 shadow-soft transition-all duration-300 group-hover:shadow-glow purr-hover">
              <Cat className="h-5 w-5 text-royal transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow-sm">
              <Crown className="h-3 w-3 text-banana-500" />
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-bold text-royal transition-colors">
              Banana Meow
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-medium flex items-center gap-1">
              Chonky Royals
              <svg viewBox="0 0 48 48" fill="currentColor" className="w-2.5 h-2.5 text-royal/40 inline-block">
                <ellipse cx="24" cy="34" rx="10" ry="8" />
                <ellipse cx="14" cy="21" rx="4.5" ry="5" />
                <ellipse cx="24" cy="17" rx="4.5" ry="5" />
                <ellipse cx="34" cy="21" rx="4.5" ry="5" />
                <ellipse cx="9" cy="28" rx="3.5" ry="4" />
                <ellipse cx="39" cy="28" rx="3.5" ry="4" />
              </svg>
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ease-out ${
                  active
                    ? "text-royal"
                    : "text-ink/60 hover:text-royal"
                }`}
              >
                <Icon className={`h-4 w-4 transition-all duration-300 ${active ? 'text-royal' : 'text-ink/40 group-hover:text-royal/70'}`} />
                <span className="text-sm font-medium">{link.label}</span>
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-banana-100/80 to-lilac/40 -z-10" />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-xl bg-royal/0 transition-all duration-300 group-hover:bg-royal/5 -z-10" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Donate button - Desktop */}
          <Link
            to="/donate"
            className={`hidden md:flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm transition-all duration-300 ease-out ${
              isActive("/donate")
                ? "bg-gradient-to-r from-coral/90 to-blush text-white shadow-warm"
                : "bg-gradient-to-r from-blush/80 to-lilac/80 text-royal hover:shadow-glow-pink hover:scale-105"
            }`}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${isActive("/donate") ? 'fill-white' : 'fill-coral text-coral'}`} />
            <span>Donate</span>
          </Link>

          {/* Cart button */}
          <Link
            to="/cart"
            className="group relative flex items-center justify-center w-11 h-11 rounded-xl border-2 border-royal/10 bg-white/80 backdrop-blur-sm text-royal transition-all duration-300 hover:border-royal/30 hover:bg-white hover:shadow-soft"
          >
            <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-coral to-blush text-[10px] font-bold text-white shadow-sm" style={{ animation: 'scale-pulse 2s ease-in-out infinite' }}>
                {itemCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          <div className="relative" ref={loginMenuRef}>
            <button
              type="button"
              onClick={handleLoginClick}
              className={`group flex items-center justify-center w-11 h-11 rounded-xl border-2 transition-all duration-300 hover:shadow-soft ${
                user 
                  ? "border-royal/30 bg-gradient-to-r from-banana-100 to-lilac/40 text-royal" 
                  : "border-royal/10 bg-white/80 backdrop-blur-sm text-royal hover:border-royal/30 hover:bg-white"
              }`}
              aria-haspopup="menu"
              aria-expanded={isLoginOpen}
            >
              <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              {user && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-r from-mint to-sky">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </button>
            
            {user && (
              <div
                className={`absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-glow border border-royal/5 transition-all duration-200 ${
                  isLoginOpen
                    ? "scale-100 opacity-100 translate-y-0"
                    : "pointer-events-none scale-95 opacity-0 -translate-y-2"
                }`}
              >
                <div className="px-3 py-3 border-b border-royal/5 mb-2">
                  <p className="text-sm font-semibold text-royal">{user.name || 'Royal Member'}</p>
                  <p className="text-xs text-ink/50 mt-0.5 truncate">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/70 transition-all duration-200 hover:bg-gradient-to-r hover:from-banana-50 hover:to-lilac/20 hover:text-royal"
                  onClick={() => setIsLoginOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/70 transition-all duration-200 hover:bg-gradient-to-r hover:from-blush/30 hover:to-coral/20 hover:text-coral"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-banana-100 to-lilac/40 text-royal shadow-soft transition-all duration-300 active:scale-95"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-2 bg-white/95 backdrop-blur-lg border-t border-royal/5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-banana-100 to-lilac/40 text-royal font-semibold"
                    : "text-ink/70 hover:bg-royal/5"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            to="/donate"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blush to-lilac text-royal font-semibold"
          >
            <Heart className="h-5 w-5 fill-coral text-coral" />
            <span>Donate</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
