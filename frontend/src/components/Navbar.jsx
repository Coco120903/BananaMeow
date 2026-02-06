import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Cat, Crown, ShoppingCart, User } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Meet the Cats", href: "/cats" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" }
];

export default function Navbar() {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginMenuRef = useRef(null);

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
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

  return (
    <header className="sticky top-0 z-30 border-b-[6px] border-royal bg-white py-2 font-sans selection:bg-banana-400">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-8">
        
        {/* Logo Section - Sticker Style */}
        <Link to="/" className="group flex items-center gap-4 transition-transform active:scale-95">
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl border-[4px] border-royal bg-banana-400 shadow-[4px_4px_0px_0px_#171717] transition-all group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1">
            <Cat className="h-8 w-8 text-royal" />
            <Crown className="absolute -right-2 -top-2 h-6 w-6 text-royal drop-shadow-[2px_2px_0px_white] rotate-12" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xl font-black text-royal leading-none uppercase tracking-tighter">
              Banana Meow
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-royal/40 mt-1">
              Chonky Royals
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-black uppercase tracking-tight transition-all ${
                  active ? "text-royal" : "text-royal/60 hover:text-royal"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <span className="absolute inset-x-1 bottom-2 h-3 bg-banana-400 -rotate-1 z-0" />
                )}
              </Link>
            );
          })}

          <div className="ml-4 flex items-center gap-4">
            {/* Donate Button */}
            <Link
              to="/donate"
              className="rounded-xl border-[3px] border-royal bg-blush px-6 py-2 text-xs font-black uppercase tracking-widest text-royal shadow-[4px_4px_0px_0px_#171717] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Donate
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-royal bg-white text-royal shadow-[4px_4px_0px_0px_#171717] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-lg border-2 border-royal bg-banana-400 text-[10px] font-black">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Icon & Dropdown */}
            <div className="relative" ref={loginMenuRef}>
              <button
                type="button"
                onClick={handleLoginClick}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-royal bg-white text-royal shadow-[4px_4px_0px_0px_#171717] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <User className="h-5 w-5" />
              </button>
              
              {user && (
                <div
                  className={`absolute right-0 mt-4 w-48 border-[4px] border-royal bg-white p-2 shadow-[8px_8px_0px_0px_#171717] transition-all ${
                    isLoginOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
                  }`}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 font-black uppercase text-xs text-royal hover:bg-lilac transition-colors"
                    onClick={() => setIsLoginOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left font-black uppercase text-xs text-royal hover:bg-blush transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="rounded-xl border-[3px] border-royal bg-banana-400 px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_#171717] active:shadow-none active:translate-x-1 active:translate-y-1 md:hidden">
          Menu
        </button>
      </nav>
    </header>
  );
}