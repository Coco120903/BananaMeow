import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Crown, Mail, Lock, User, Sparkles, ArrowRight, Heart, Star, AlertCircle } from "lucide-react";

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
    <section className="relative mx-auto max-w-md px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 -right-20 top-10" />
      <div className="floating-shape floating-shape-2 -left-16 bottom-20" />
      <div className="floating-shape floating-shape-3 right-10 bottom-40" />
      
      <div className="card-cute p-[3px]">
        <div className="rounded-[2rem] bg-white p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 dots-pattern" />
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-lilac to-blush shadow-soft mb-4">
                <Crown className="h-8 w-8 text-royal" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-banana-400" />
                Create Account
                <Sparkles className="h-3 w-3 text-banana-400" />
              </p>
              <h1 className="mt-2 text-2xl font-bold text-royal">
                Join the royal court
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                Create your account to support the chonky royals.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Full Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your royal name"
                  className="input-soft"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="royal@example.com"
                  className="input-soft"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-soft"
                  required
              minLength={6}
                />
              </label>

              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-soft"
                  required
                />
              </label>

              <label className="flex items-start gap-2 text-sm text-ink/70 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-royal/20 text-royal focus:ring-royal/30"
                  required
                />
                <span>
                  I agree to the{" "}
                  <button type="button" className="text-royal transition hover:text-ink animated-underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-royal transition hover:text-ink animated-underline">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 group">
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="divider-elegant my-6">
              <Star className="h-4 w-4 text-banana-400" />
            </div>

            <div className="text-center text-sm text-ink/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-royal transition hover:text-ink inline-flex items-center gap-1 animated-underline"
              >
                Login
                <Heart className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
