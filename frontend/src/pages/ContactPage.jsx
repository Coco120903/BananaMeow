import { useState } from "react";
import { Mail, Send, User, MessageSquare, FileText, Loader2, CheckCircle, AlertCircle, Heart, Sparkles } from "lucide-react";
import { API_BASE } from "../lib/api.js";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
      } else {
        setServerError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setServerError("Failed to send message. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-banana-100 to-lilac/40 px-4 py-1.5 mb-4">
          <Sparkles className="h-4 w-4 text-royal" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Get in Touch</span>
        </div>
        <h1 className="text-3xl font-bold text-royal md:text-4xl">
          Contact the Royal Court
        </h1>
        <p className="mt-3 text-base text-ink/60 max-w-md mx-auto">
          Have a question about our chonky royals, your order, or a donation? We'd love to hear from you!
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-mint/30 to-sky/20 border border-mint/50 px-5 py-4" role="alert">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-800">{success}</p>
        </div>
      )}

      {/* Server error message */}
      {serverError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blush/40 to-coral/20 border border-coral/30 px-5 py-4" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-medium text-red-700">{serverError}</p>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="card-soft rounded-[2.5rem] p-8 md:p-10 space-y-6" noValidate>

        {/* Name field */}
        <div>
          <label htmlFor="contact-name" className="flex items-center gap-2 text-sm font-semibold text-ink/70 mb-2">
            <User className="h-4 w-4 text-royal/60" />
            Name <span className="text-coral">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-required="true"
            aria-invalid={!!errors.name}
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-coral/50 focus:ring-coral/30"
                : "border-royal/10 focus:ring-royal/30"
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-coral flex items-center gap-1" role="alert">
              <AlertCircle className="h-3 w-3" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="contact-email" className="flex items-center gap-2 text-sm font-semibold text-ink/70 mb-2">
            <Mail className="h-4 w-4 text-royal/60" />
            Email <span className="text-coral">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-coral/50 focus:ring-coral/30"
                : "border-royal/10 focus:ring-royal/30"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-coral flex items-center gap-1" role="alert">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Subject field (optional) */}
        <div>
          <label htmlFor="contact-subject" className="flex items-center gap-2 text-sm font-semibold text-ink/70 mb-2">
            <FileText className="h-4 w-4 text-royal/60" />
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            className="w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-royal/30"
          />
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="contact-message" className="flex items-center gap-2 text-sm font-semibold text-ink/70 mb-2">
            <MessageSquare className="h-4 w-4 text-royal/60" />
            Message <span className="text-coral">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us what's on your mind..."
            aria-required="true"
            aria-invalid={!!errors.message}
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
              errors.message
                ? "border-coral/50 focus:ring-coral/30"
                : "border-royal/10 focus:ring-royal/30"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-coral flex items-center gap-1" role="alert">
              <AlertCircle className="h-3 w-3" /> {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot field (hidden from real users, bots fill it) */}
        <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            value={form.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Extra info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-ink/50">
          <Heart className="h-4 w-4 text-coral fill-coral" />
          <span>We typically respond within 24-48 hours</span>
        </div>
      </div>
    </section>
  );
}
