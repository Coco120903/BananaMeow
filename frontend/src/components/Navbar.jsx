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
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105">
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-banana-200 via-banana-100 to-royal/20 shadow-soft transition-all duration-300 group-hover:shadow-lg">
            <Cat className="h-6 w-6 text-royal transition-transform duration-300 group-hover:scale-110" />
            <Crown className="absolute -right-1 -top-1 h-4 w-4 text-royal drop-shadow-sm" />
          </div>
          <div>
            <p className="text-lg font-bold text-royal transition-colors group-hover:text-royal/80">
              Banana Meow
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">
              Chonky Royals
            </p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`group relative px-3 py-1.5 rounded-full transition-all duration-300 ease-out ${
                  active
                    ? "font-semibold text-royal"
                    : "text-ink/70 hover:text-royal"
                }`}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                  {link.label}
                </span>
                {active ? (
                  <span className="absolute inset-0 rounded-full bg-royal/10 transition-all duration-300" />
                ) : (
                  <span className="absolute inset-0 rounded-full bg-royal/0 transition-all duration-300 group-hover:bg-royal/5" />
                )}
              </Link>
            );
          })}
          <Link
            to="/donate"
            className={`text-sm rounded-full px-4 py-2 font-semibold bg-royal text-white shadow-soft transition-all duration-300 ease-out hover:scale-105 hover:bg-ink ${
              isActive("/donate") ? "scale-105" : ""
            }`}
          >
            Donate
          </Link>
          <Link
            to="/cart"
            className="group relative flex items-center justify-center rounded-full border border-royal/20 px-3.5 py-3 text-royal transition-all hover:border-royal hover:bg-royal/5"
          >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-royal text-xs font-bold text-white shadow-sm">
                {itemCount}
              </span>
            ) : null}
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
