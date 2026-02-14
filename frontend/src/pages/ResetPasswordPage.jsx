import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Crown, Lock, Sparkles, ArrowRight, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset token");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Password reset successfully!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may be invalid or expired.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
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
                New Password
                <Sparkles className="h-3 w-3 text-banana-400" />
              </p>
              <h1 className="mt-2 text-2xl font-bold text-royal">
                Create New Password
              </h1>
              <p className="mt-2 text-sm text-ink/60">
                Enter your new password below.
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
                <br />
                <span className="text-xs">Redirecting to login...</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  New Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="input-soft pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-ink/40 mt-1">Must be at least 6 characters</p>
              </label>

              <label className="block text-sm font-semibold text-ink/60">
                <span className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  Confirm New Password
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className="input-soft pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-royal transition-colors"
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </label>

              <button 
                type="submit" 
                className="btn-primary w-full flex items-center justify-center gap-2 group"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
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
