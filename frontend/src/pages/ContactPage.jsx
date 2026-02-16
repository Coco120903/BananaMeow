import { useState } from "react";
import {
  Mail, Send, User, MessageSquare, FileText, Loader2,
  CheckCircle, AlertCircle, Heart, Sparkles, Crown,
  Instagram, Twitter, Youtube, ExternalLink, MapPin,
  Clock, ArrowRight, Star, X
} from "lucide-react";
import { API_BASE } from "../lib/api.js";
import { FloatingCats } from "../components/CatDecorations.jsx";

/* ─── Social & Contact Data ─────────────────────────────────── */
const socialLinks = [
  {
    id: "email",
    label: "Email Us",
    value: "meow@bananameow.com",
    description: "Drop us a message anytime",
    icon: Mail,
    href: "mailto:meow@bananameow.com",
    gradient: "from-banana-100 to-banana-200/60",
    iconBg: "from-banana-200 to-banana-300/60",
    hoverBorder: "hover:border-banana-300/50",
    isEmail: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@bananameow",
    description: "Daily fluff & royal content",
    icon: Instagram,
    href: "https://instagram.com/bananameow",
    gradient: "from-blush to-coral/20",
    iconBg: "from-blush to-coral/40",
    hoverBorder: "hover:border-coral/40",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    value: "@bananameow",
    description: "Updates & cat wisdom",
    icon: Twitter,
    href: "https://twitter.com/bananameow",
    gradient: "from-sky to-lilac/30",
    iconBg: "from-sky to-lilac/50",
    hoverBorder: "hover:border-lilac/40",
  },
  {
    id: "youtube",
    label: "YouTube",
    value: "Banana Meow",
    description: "Chonky royals in action",
    icon: Youtube,
    href: "https://youtube.com/@bananameow",
    gradient: "from-blush/60 to-banana-100",
    iconBg: "from-coral/40 to-blush",
    hoverBorder: "hover:border-blush/60",
  },
];

export default function ContactPage() {
  /* ─── Form State (unchanged logic) ─── */
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  /* ─── Email modal state ─── */
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  /* ─── Social link click handler (email needs confirmation) ─── */
  const handleSocialClick = (e, link) => {
    if (link.isEmail) {
      e.preventDefault();
      setShowEmailModal(true);
    }
    // Non-email links open naturally via <a> tag
  };

  const handleEmailProceed = () => {
    setShowEmailModal(false);
    window.location.href = "mailto:meow@bananameow.com";
  };

  return (
    <>
      {/* ─── Email Confirmation Modal ─── */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-200 scale-100">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-cream hover:bg-blush/30 grid place-items-center transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-ink/60" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-royal" />
            </div>
            <h3 className="text-2xl font-bold text-royal text-center mb-2">
              Email Us
            </h3>
            <p className="text-ink/60 text-center mb-6">
              This will open your default email client to send a message to{" "}
              <span className="font-medium text-royal">meow@bananameow.com</span>. Continue?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailProceed}
                className="flex-1 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
              >
                Open Email
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8 overflow-hidden">
        {/* Background decorations */}
        <FloatingCats count={4} />
        <div className="floating-shape floating-shape-1 top-20 -right-10 opacity-40" />
        <div className="floating-shape floating-shape-2 bottom-40 -left-10 opacity-30" />
        <div className="floating-shape floating-shape-3 top-1/3 left-10 opacity-20" />
        <div className="floating-shape floating-shape-4 bottom-20 right-1/4 opacity-30" />

        {/* ═══════════════ HERO HEADER ═══════════════ */}
        <div className="relative text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-banana-100 to-lilac/40 px-5 py-2 mb-5 shadow-sm">
            <Sparkles className="h-4 w-4 text-royal" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Get in Touch</span>
            <Crown className="h-3.5 w-3.5 text-banana-400 animate-wiggle" />
          </div>
          <h1 className="text-3xl font-bold text-royal md:text-4xl lg:text-5xl">
            Contact the Royal Court
          </h1>
          <p className="mt-4 text-base text-ink/60 max-w-xl mx-auto md:text-lg leading-relaxed">
            Have a question about our chonky royals, your order, or a donation?
            We'd love to hear from you!
          </p>
        </div>

        {/* ═══════════════ TWO-COLUMN LAYOUT ═══════════════ */}
        <div className="relative grid gap-10 lg:grid-cols-5 lg:gap-12 items-start">

          {/* ── LEFT: Contact Info & Social ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Social & Contact Links */}
            <div>
              <div className="flex items-center gap-3 mb-5 px-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center shadow-sm">
                  <Star className="h-4 w-4 text-royal" />
                </div>
                <h2 className="text-lg font-bold text-royal">Follow Us</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => handleSocialClick(e, link)}
                      target={link.isEmail ? undefined : "_blank"}
                      rel={link.isEmail ? undefined : "noopener noreferrer"}
                      aria-label={`${link.label}: ${link.value}`}
                      className={`group flex items-center gap-4 rounded-2xl bg-gradient-to-r ${link.gradient} border border-transparent ${link.hoverBorder} p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft`}
                    >
                      {/* Icon */}
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.iconBg} grid place-items-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-5 w-5 text-royal" />
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-royal group-hover:text-ink transition-colors">{link.label}</p>
                        <p className="text-xs text-ink/50 truncate">{link.description}</p>
                      </div>
                      {/* Arrow */}
                      <ExternalLink className="h-4 w-4 text-royal/30 flex-shrink-0 transition-all duration-300 group-hover:text-royal/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                  <Heart className="h-4 w-4 text-royal" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-royal">We're Here to Help</h2>
                  <p className="text-xs text-ink/50">Reach out through any channel</p>
                </div>
              </div>

              {/* Response time badge */}
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-mint/30 to-sky/20 px-3 py-2.5 border border-mint/30">
                <Clock className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-800 font-medium">
                  We typically respond within <span className="font-bold">24–48 hours</span>
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5 text-sm text-ink/60">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-banana-50 to-lilac/20 grid place-items-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-royal" />
                </div>
                <div>
                  <p className="font-medium text-ink/80 text-xs">Location</p>
                  <p className="text-[11px] text-ink/50">The Royal Palace — BananaMeow HQ</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="lg:col-span-3">

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

            {/* Form Card */}
            <div className="card-cute p-[2px]">
              <div className="rounded-[1.85rem] bg-white">
                {/* Form header strip */}
                <div className="px-8 pt-7 pb-5 md:px-10 md:pt-8 md:pb-6 border-b border-royal/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center shadow-sm">
                      <Send className="h-5 w-5 text-royal" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-royal">Send a Message</h2>
                      <p className="text-xs text-ink/50">Fill out the form and we'll get back to you</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5" noValidate>

                  {/* Name & Email — side by side on md+ */}
                  <div className="grid gap-5 sm:grid-cols-2">
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
                            : "border-royal/10 focus:ring-royal/30 hover:border-royal/20"
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
                            : "border-royal/10 focus:ring-royal/30 hover:border-royal/20"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-coral flex items-center gap-1" role="alert">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>
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
                      className="w-full rounded-2xl border border-royal/10 bg-white px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-royal/30 hover:border-royal/20"
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
                          : "border-royal/10 focus:ring-royal/30 hover:border-royal/20"
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
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-ink/40">
              <Heart className="h-3.5 w-3.5 text-coral fill-coral" />
              <span>Your message is sent securely</span>
            </div>
          </div>
        </div>

        {/* ═══════════════ FAQ / HELP HINT ═══════════════ */}
        <div className="mt-16 md:mt-20">
          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-royal/10 to-transparent" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-banana-100 to-lilac/30 grid place-items-center shadow-sm">
              <Sparkles className="h-4 w-4 text-royal" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-royal/10 to-transparent" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-royal md:text-2xl">Common Questions</h2>
            <p className="text-sm text-ink/50 mt-2">Quick answers before you reach out</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                icon: "🛒",
                q: "Where's my order?",
                a: "Check your email for tracking info, or reach out and we'll help locate it.",
              },
              {
                icon: "🐱",
                q: "Can I adopt a cat?",
                a: "Our royals aren't up for adoption, but you can support them through donations!",
              },
              {
                icon: "🎁",
                q: "Do you ship internationally?",
                a: "Currently we ship within select regions. Contact us for specifics on your area.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="group rounded-2xl bg-white border border-royal/5 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:border-royal/10"
              >
                <div className="text-2xl mb-3">{faq.icon}</div>
                <h3 className="text-sm font-bold text-royal mb-2">{faq.q}</h3>
                <p className="text-xs text-ink/50 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
