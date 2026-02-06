import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Cat, Crown, ShoppingCart, User, PawPrint } from "lucide-react";

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
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

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

  return (
    <header className="sticky top-4 z-50 px-4 md:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-[2rem] border border-royal/10 bg-white/80 px-6 py-3 shadow-soft backdrop-blur-xl transition-all duration-300 hover:shadow-lg md:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-banana-200 via-banana-100 to-royal/20 shadow-soft transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-lg">
            <Cat className="h-6 w-6 text-royal transition-transform duration-300 group-hover:scale-110" />
            <Crown className="absolute -right-1 -top-1 h-4 w-4 text-royal drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-black tracking-tight text-royal">BANANA MEOW</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-royal/60 transition-colors group-hover:text-banana-500">
            Chonky Royals
            </p>
            <div className="mt-0.5 h-0.5 w-0 bg-banana-400 transition-all duration-300 group-hover:w-full" />
          </div>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`group relative px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "text-royal" : "text-ink/60 hover:text-royal"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-royal animate-bounce">
                    <PawPrint size={10} fill="currentColor" />
                  </div>
                )}
                <div className="absolute inset-0 scale-75 rounded-full bg-banana-100 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
              </Link>
            );
          })}
          </div>

          <div className="flex items-center gap-3">
          <Link
            to="/donate"
            className="hidden rounded-full bg-royal px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-ink sm:block"
          >
            Donate
          </Link>

          <div className="h-8 w-px bg-royal/10 mx-1 hidden md:block" />
          
          <Link to="/cart" className="relative p-2 text-royal transition-transform hover:scale-110">
            <ShoppingCart size={22} strokeWidth={2.5} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-banana-400 text-[10px] font-black text-royal ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </Link>
          <div className="relative" ref={loginMenuRef}>
            <button
              type="button"
              onClick={handleLoginClick}
              className="group flex items-center justify-center rounded-full border border-royal/20 px-3.5 py-3 text-royal transition-all hover:border-royal hover:bg-royal/5"
              aria-haspopup="menu"
              aria-expanded={isLoginOpen}
            >
              <User className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>
            {user ? (
              <div
                className={`absolute right-0 mt-2 w-40 origin-top-right rounded-2xl border border-royal/10 bg-white p-2 text-sm shadow-soft transition-all duration-200 ${
                  isLoginOpen
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
              >
                <Link
                  to="/profile"
                  className="block rounded-xl px-3 py-2 text-ink/80 transition hover:bg-cream"
                  onClick={() => setIsLoginOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-3 py-2 text-left text-ink/80 transition hover:bg-cream"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <button className="rounded-full bg-banana-200 px-4 py-2 text-sm font-semibold text-royal transition-transform duration-200 ease-out active:scale-95 md:hidden">
          Menu
        </button>
      </nav>
    </header>
  );
}
