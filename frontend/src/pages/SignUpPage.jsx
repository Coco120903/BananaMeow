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
    <section className="mx-auto max-w-md px-4 py-12 md:px-8">
      <div className="card-soft rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink/50">
          Create Account
        </p>
        <h1 className="mt-3 text-2xl font-bold text-royal">
          Join the royal court
        </h1>
        <p className="mt-3 text-base text-ink/70">
          Create your account to support the chonky royals.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl bg-blush/50 border border-royal/20 px-4 py-3 text-sm text-royal">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-ink/60">
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your royal name"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-ink/60">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="royal@example.com"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-ink/60">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
              minLength={6}
            />
          </label>

          <label className="block text-sm font-semibold text-ink/60">
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-royal/30"
              required
            />
          </label>

          <label className="flex items-start gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-royal/20 text-royal focus:ring-royal/30"
              required
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-royal transition hover:text-ink"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-royal transition hover:text-ink"
              >
                Privacy Policy
              </button>
            </span>
          </label>

          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ink/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-royal transition hover:text-ink"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
