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
    <section className="mx-auto max-w-md px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Login
        </p>
        <h1 className="mt-3 text-2xl font-bold text-royal">
          Welcome back, royal friend
        </h1>
        <p className="mt-3 text-base text-ink/70">
          Enter your details to access the royal lounge.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-ink/60">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="royal@example.com"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-ink/60">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
            />
          </label>

          <div className="flex flex-col gap-3 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-royal/20 text-royal focus:ring-royal/30"
              />
              Remember me
            </label>
            <button
              type="button"
              className="text-royal transition hover:text-ink"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink/70">
          New here?{" "}
          <Link
            to="/signup"
            className="font-semibold text-royal transition hover:text-ink"
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
