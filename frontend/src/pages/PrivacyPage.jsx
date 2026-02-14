import { Shield, Heart, Lock, Eye, Mail, Crown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function PrivacyPage() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  const handleProceed = () => {
    setShowContactModal(false);
    window.location.href = "mailto:privacy@bananameow.com";
  };

  const handleCancel = () => {
    setShowContactModal(false);
  };

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information you provide when creating an account, making purchases, or donating to support our royal cats. This includes your name, email, shipping address, and payment details processed securely through Stripe."
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: "Your information helps us process orders, send donation receipts, share updates about our cats, and improve your experience. We never sell your data to third parties."
    },
    {
      icon: Shield,
      title: "Data Security",
      content: "We use industry-standard encryption and secure payment processing through Stripe. Your payment information is never stored on our servers."
    },
    {
      icon: Heart,
      title: "Cookies & Tracking",
      content: "We use essential cookies to keep you logged in and remember your cart. We may use analytics to understand how visitors use our site to improve it."
    },
    {
      icon: Mail,
      title: "Your Rights",
      content: "You can access, update, or delete your account information at any time. Contact us at privacy@bananameow.com for data requests or questions."
    }
  ];

  return (
    <>
      {/* Contact Confirmation Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-200 scale-100">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-cream hover:bg-blush/30 grid place-items-center transition-colors"
            >
              <X className="h-4 w-4 text-ink/60" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-royal" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-royal text-center mb-2">
              Contact Privacy Team
            </h3>
            <p className="text-ink/60 text-center mb-6">
              This will open your default email client to send a message to privacy@bananameow.com. Continue?
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
              >
                Open Email
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:px-8">
      {/* Floating decorative shapes */}
      <div className="floating-shape floating-shape-1 -right-20 top-40" />
      <div className="floating-shape floating-shape-2 -left-16 top-80" />

      {/* Header */}
      <div className="mb-12 text-center" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center shadow-soft">
            <Shield className="h-6 w-6 text-royal" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-royal md:text-5xl mb-4">
          Privacy Policy
        </h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          We care about your privacy as much as we care about our 12 chonky royals. Here's how we protect your information.
        </p>
        <p className="text-sm text-ink/40 mt-2">
          Last updated: February 2026
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 mb-12">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.title}
              className="relative group"
              style={{ animation: `slide-up-fade 0.5s ease-out ${0.1 * index}s backwards` }}
            >
              <div className="flex gap-4 p-6 rounded-2xl border-2 border-royal/10 bg-gradient-to-br from-cream/50 to-white/50 backdrop-blur-sm transition-all duration-300 hover:border-royal/20 hover:shadow-soft">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center shadow-soft group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-royal" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-royal mb-2">{section.title}</h2>
                  <p className="text-ink/70 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-banana-50/60 to-lilac/20 border border-royal/10">
        <Crown className="h-8 w-8 text-royal mx-auto mb-3" />
        <h3 className="text-xl font-bold text-royal mb-2">Questions About Privacy?</h3>
        <p className="text-ink/60 mb-4">
          Our team is here to help you feel safe and secure in the royal court.
        </p>
        <button 
          onClick={handleContactClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
        >
          <Mail className="h-4 w-4" />
          Contact Privacy Team
        </button>
      </div>

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-royal hover:text-ink transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </section>
    </>
  );
}
