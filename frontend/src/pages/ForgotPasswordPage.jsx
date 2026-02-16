import { useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Mail, Sparkles, ArrowRight, AlertCircle, Loader2, CheckCircle } from "lucide-react";

import { API_BASE } from "../lib/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "If an account with that email exists, a password reset link has been sent.");
        setEmail("");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-md md:max-w-lg lg:max-w-xl px-4 py-12 md:px-8 overflow-hidden">
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
                Reset Password
                <Sparkles className="h-3 w-3 text-banana-400" />
              </p>
              <h1 className="mt-2 text-2xl font-bold text-royal">
                Forgot your password?
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl bg-mint/10 border border-mint/20 px-4 py-3 text-sm text-royal flex items-center gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
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

              <button 
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2 group"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-ink/70">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-royal transition hover:text-ink inline-flex items-center gap-1.5 animated-underline"
              >
                Back to Login
                <ArrowRight className="h-3 w-3 inline align-middle" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
