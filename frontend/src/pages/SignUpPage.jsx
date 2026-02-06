import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    register({
      name: formData.name,
      email: formData.email
    });
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 font-sans selection:bg-banana-400 selection:text-white overflow-hidden">
      
      {/* Hero Section - The "Giant Cat Head" Container */}
      <div className="relative group">
        {/* Animated Floating Paws */}
        <div className="absolute -top-12 -left-6 text-5xl animate-bounce opacity-20 select-none">🐾</div>
        <div className="absolute -bottom-10 -right-6 text-5xl animate-bounce delay-300 opacity-20 select-none rotate-12">🐾</div>

        {/* Enhanced Cat Ears with inner-ear detail */}
        <div className="absolute -top-10 left-10 w-20 h-24 bg-royal rounded-t-full -rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        <div className="absolute -top-10 right-10 w-20 h-24 bg-royal rounded-t-full rotate-12 transition-all duration-500 group-hover:-translate-y-4">
           <div className="absolute inset-2 bg-blush rounded-t-full"></div>
        </div>
        
        {/* The Main "Face" Card */}
        <div className="relative z-10 rounded-[3rem] bg-white border-[6px] border-royal p-8 md:p-12 shadow-[16px_16px_0px_0px_#171717]">
          <div className="inline-block bg-banana-400 text-royal px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border-2 border-royal">
            ✨ Create Account
          </div>
          
          <h1 className="text-4xl font-black text-royal md:text-5xl leading-none mb-4">
            Join the <br />
            <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">royal court</span>
          </h1>
          
          <p className="mb-8 text-lg font-bold text-ink/70 italic leading-relaxed">
            "Create your account to support the chonky royals. <br />
            Membership has its plush privileges."
          </p>

          {error && (
            <div className="mb-6 rounded-2xl bg-blush border-[3px] border-royal px-4 py-3 text-sm font-black text-royal animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your royal name"
                  className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-3 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="royal@example.com"
                  className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-3 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-3 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-royal/60 ml-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border-[4px] border-royal bg-white px-5 py-3 font-bold shadow-[4px_4px_0px_0px_#171717] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group/check py-2">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded-lg border-4 border-royal text-royal focus:ring-0 checked:bg-royal transition-all cursor-pointer"
                required
              />
              <span className="text-sm font-bold text-royal/70 leading-snug">
                I agree to the{" "}
                <button type="button" className="text-royal border-b-2 border-banana-400 hover:border-royal transition-all">Terms of Service</button>
                {" "}and{" "}
                <button type="button" className="text-royal border-b-2 border-banana-400 hover:border-royal transition-all">Privacy Policy</button>
              </span>
            </label>

            <button 
              type="submit" 
              className="w-full bg-banana-400 border-[4px] border-royal py-5 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_#171717] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-white"
            >
              Create Account 🐾
            </button>
          </form>

          <div className="mt-8 text-center font-bold text-royal/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-royal border-b-4 border-blush hover:border-royal transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}