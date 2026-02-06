import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ email });
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 font-sans selection:bg-banana-400 selection:text-white">
      {/* Neo-Brutalist Container Wrapper */}
      <div className="relative group">
        {/* Animated Floating Paws */}
        <div className="absolute -top-12 -left-6 text-5xl animate-bounce opacity-30 select-none">🐾</div>
        <div className="absolute -bottom-10 -right-6 text-5xl animate-bounce delay-300 opacity-30 select-none rotate-12">🐾</div>

        {/* Enhanced Cat Ears */}
        <div className="absolute -top-10 left-10 w-20 h-24 bg-royal rounded-t-full -rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        <div className="absolute -top-10 right-10 w-20 h-24 bg-royal rounded-t-full rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>

        {/* The Main "Face" Card */}
        <div className="relative z-10 rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-12 shadow-[16px_16px_0px_0px_#171717]">
          <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-royal">
            🔐 Royal Access
          </div>
          
          <h1 className="text-4xl font-black text-royal md:text-5xl leading-none mb-4">
            Welcome back, <br />
            <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">royal friend</span>
          </h1>
          
          <p className="mb-8 text-lg font-bold text-ink/70 italic leading-relaxed">
            "Enter your details to access the royal lounge. <br />
            Our feline guards are watching."
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="royal@example.com"
                className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-4 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-4 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between font-bold text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border-4 border-royal text-royal focus:ring-0 checked:bg-royal transition-all cursor-pointer"
                />
                <span className="text-royal/70">Remember me</span>
              </label>
              <button
                type="button"
                className="text-royal underline decoration-4 decoration-banana-400 underline-offset-4 hover:decoration-royal transition-all"
              >
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-banana-400 border-[4px] border-royal py-5 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-white"
            >
              Login 🐾
            </button>
          </form>

          <div className="mt-8 text-center font-bold text-royal/60">
            New here?{" "}
            <Link
              to="/signup"
              className="text-royal border-b-4 border-blush hover:border-royal transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}