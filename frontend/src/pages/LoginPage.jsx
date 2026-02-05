import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Crown, Mail, Lock, Sparkles, ArrowRight, Heart, Star, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);
    
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="relative mx-auto max-w-md px-4 py-12 md:px-8 overflow-hidden">
      {/* Floating decorations */}
      <div className="floating-shape floating-shape-1 -right-20 top-10" />
      <div className="floating-shape floating-shape-2 -left-16 bottom-20" />
      
      <div className="card-cute p-[3px]">
        <div className="rounded-[2rem] bg-white p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 dots-pattern" />
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac shadow-soft mb-4">
                <Crown className="h-8 w-8 text-royal" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-banana-400" />
                Login
                <Sparkles className="h-3 w-3 text-banana-400" />
              </p>
              <h1 className="mt-2 text-2xl font-bold text-royal">
                Welcome back, royal friend
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                Enter your details to access the royal lounge.
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
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="input-soft"
                  required
                />
              </label>

              <div className="flex flex-col gap-3 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-royal/20 text-royal focus:ring-royal/30"
                  />
                  <span className="group-hover:text-royal transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-royal transition hover:text-ink animated-underline"
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2 group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Kingdom</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="divider-elegant my-6">
              <Star className="h-4 w-4 text-banana-400" />
            </div>

            <div className="text-center text-sm text-ink/70">
              New here?{" "}
              <Link
                to="/signup"
                className="font-semibold text-royal transition hover:text-ink inline-flex items-center gap-1 animated-underline"
              >
                Create an account
                <Heart className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
