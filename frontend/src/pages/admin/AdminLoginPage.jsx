import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { Cat, Lock, User, Crown } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-banana-50 to-lilac/30 p-4">
      {/* Floating decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-banana-200 rounded-full opacity-40 animate-pulse" />
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-blush rounded-full opacity-50 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-lilac rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-royal to-royal/80 rounded-3xl shadow-lg mb-4">
            <Crown className="w-10 h-10 text-banana-300" />
          </div>
          <h1 className="text-3xl font-bold text-royal">Royal Admin Portal</h1>
          <p className="text-ink/60 mt-2 flex items-center justify-center gap-2">
            <Cat className="w-4 h-4" />
            Banana Meow Control Center
            <Cat className="w-4 h-4" />
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>🙀</span> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink/70">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-cream/50 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30 focus:border-royal/50 transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink/70">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-cream/50 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30 focus:border-royal/50 transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-royal to-royal/90 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entering the Palace...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Enter Royal Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink/10 text-center">
            <p className="text-xs text-ink/50 flex items-center justify-center gap-2">
              <Cat className="w-3.5 h-3.5 text-royal/40" />
              Only authorized royal servants may enter
              <Cat className="w-3.5 h-3.5 text-royal/40" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
