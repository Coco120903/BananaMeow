import { FileText, ShoppingBag, Heart, AlertCircle, Crown, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function TermsPage() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  const handleProceed = () => {
    setShowContactModal(false);
    window.location.href = "mailto:support@bananameow.com";
  };

  const handleCancel = () => {
    setShowContactModal(false);
  };

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By using Banana Meow, you agree to these terms. We're a community celebrating 12 British Shorthair cats through merchandise sales and donations to support cat welfare."
    },
    {
      icon: ShoppingBag,
      title: "Shop & Orders",
      content: "All merchandise sales are final unless items arrive damaged or incorrect. Shipping times vary by location. We'll do our best to get your royal merch to you quickly!"
    },
    {
      icon: Heart,
      title: "Donations",
      content: "Donations support the care of our cats and cat rescue initiatives. All donations are non-refundable. Monthly subscriptions can be cancelled anytime from your account."
    },
    {
      icon: AlertCircle,
      title: "User Accounts",
      content: "You're responsible for keeping your account secure. Don't share your password. We reserve the right to suspend accounts that violate our terms or engage in fraudulent activity."
    },
    {
      icon: Crown,
      title: "Intellectual Property",
      content: "All content, images, and cat bios on Banana Meow are our property. Please don't use them without permission. Our cats' likenesses are protected by royal decree."
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
              Contact Support
            </h3>
            <p className="text-ink/60 text-center mb-6">
              This will open your default email client to send a message to support@bananameow.com. Continue?
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
            <FileText className="h-6 w-6 text-royal" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-royal md:text-5xl mb-4">
          Terms of Service
        </h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          The rules of the royal court. Simple, fair, and designed to keep everyone happy—especially the cats.
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

        {/* Important Notes */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blush/30 to-coral/10 border border-royal/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-royal flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-royal mb-2">Important Notes</h3>
            <ul className="space-y-2 text-sm text-ink/70">
              <li>• We reserve the right to update these terms at any time</li>
              <li>• Continued use after changes means you accept the new terms</li>
              <li>• These terms are governed by the laws of the Royal Cat Court</li>
            </ul>
          </div>
        </div>
        </div>

        {/* Contact Section */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-banana-50/60 to-lilac/20 border border-royal/10">
        <Crown className="h-8 w-8 text-royal mx-auto mb-3" />
        <h3 className="text-xl font-bold text-royal mb-2">Questions About Terms?</h3>
        <p className="text-ink/60 mb-4">
          Need clarification on something? We're here to help make things clear.
        </p>
        <button 
          onClick={handleContactClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft"
        >
          <Mail className="h-4 w-4" />
          Contact Support
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
