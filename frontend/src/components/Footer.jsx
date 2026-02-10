import { Link } from "react-router-dom";
import { Cat, Heart, Instagram, Twitter, Youtube, Mail, Sparkles, Crown, MapPin, Phone, ArrowUpRight, Star } from "lucide-react";

const quickLinks = [
  { label: "Meet the Cats", href: "/cats", icon: Cat },
  { label: "Shop", href: "/shop", icon: Sparkles },
  { label: "Donate", href: "/donate", icon: Heart },
  { label: "About Us", href: "/about", icon: Star }
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" }
];

export default function Footer() {
  return (
    <footer className="relative border-t border-royal/5 bg-gradient-to-b from-cream to-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="floating-shape floating-shape-1 -left-20 top-20 opacity-30" />
      <div className="floating-shape floating-shape-2 right-10 top-40 opacity-20" />
      <div className="floating-shape floating-shape-3 left-1/3 bottom-10 opacity-25" />
      
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 relative z-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="group flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-banana-200 via-banana-100 to-lilac/40 grid place-items-center shadow-soft transition-transform duration-300 group-hover:scale-105">
                  <Cat className="h-6 w-6 text-royal" />
                </div>
                <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-white shadow-sm grid place-items-center">
                  <Crown className="h-3 w-3 text-banana-500" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-royal">Banana Meow</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-medium">Chonky Royals</p>
              </div>
            </Link>
            <p className="text-sm text-ink/60 leading-relaxed mb-6">
              A kingdom of 12 British Shorthair royals waiting to brighten your day with their majestic fluffiness.
            </p>
            
            {/* Newsletter mini form */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-banana-50/80 to-lilac/20 border border-royal/5 overflow-hidden">
              <p className="text-sm font-semibold text-royal mb-2">Join the Royal Court</p>
              <p className="text-xs text-ink/50 mb-3">Get updates on our fluffy royals</p>
              <div className="flex gap-2 w-full">
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2 text-sm rounded-xl border border-royal/10 bg-white focus:outline-none focus:border-royal/30"
                />
                <button className="flex-shrink-0 px-4 py-2 rounded-xl bg-royal text-white text-sm font-medium hover:bg-ink transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold text-royal uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                <ArrowUpRight className="h-3.5 w-3.5 text-royal" />
              </div>
              Quick Links
            </h4>
            <div className="space-y-1">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.label}
                    to={link.href} 
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink/60 transition-all duration-200 hover:bg-gradient-to-r hover:from-banana-50 hover:to-lilac/20 hover:text-royal"
                  >
                    <Icon className="h-4 w-4 text-ink/40 transition-colors group-hover:text-royal" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold text-royal uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                <Mail className="h-3.5 w-3.5 text-royal" />
              </div>
              Contact
            </h4>
            <div className="space-y-4">
              <a 
                href="mailto:meow@bananameow.com" 
                className="flex items-center gap-3 text-sm text-ink/60 hover:text-royal transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-banana-50 to-lilac/20 grid place-items-center">
                  <Mail className="h-4 w-4 text-royal" />
                </div>
                <div>
                  <p className="font-medium text-ink/80">Email Us</p>
                  <p className="text-xs text-ink/50">meow@bananameow.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-banana-50 to-lilac/20 grid place-items-center">
                  <MapPin className="h-4 w-4 text-royal" />
                </div>
                <div>
                  <p className="font-medium text-ink/80">Location</p>
                  <p className="text-xs text-ink/50">The Royal Palace</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/60">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-banana-50 to-lilac/20 grid place-items-center">
                  <Phone className="h-4 w-4 text-royal" />
                </div>
                <div>
                  <p className="font-medium text-ink/80">Support</p>
                  <p className="text-xs text-ink/50">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Follow */}
          <div className="lg:col-span-1">
            <h4 className="text-sm font-bold text-royal uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center">
                <Star className="h-3.5 w-3.5 text-royal" />
              </div>
              Follow Us
            </h4>
            <p className="text-sm text-ink/50 mb-4">
              Stay updated with daily royal content
            </p>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group w-11 h-11 rounded-xl bg-gradient-to-br from-banana-50 to-lilac/30 border border-royal/5 grid place-items-center text-royal transition-all duration-300 hover:shadow-soft hover:scale-110 hover:bg-gradient-to-br hover:from-banana-100 hover:to-lilac/50"
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-banana-50/80 to-lilac/20 text-center">
                <p className="text-lg font-bold text-royal">12</p>
                <p className="text-xs text-ink/50">Royal Cats</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blush/30 to-coral/10 text-center">
                <p className="text-lg font-bold text-royal">5K+</p>
                <p className="text-xs text-ink/50">Supporters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-elegant mt-12 mb-8">
          <div className="divider-icon">
            <Cat className="h-4 w-4 text-royal" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-ink/50">
          <div className="flex items-center gap-2">
            <span>© 2026 Banana Meow.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="h-4 w-4 fill-coral text-coral" />
            <span>for our chonky royals</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-royal transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-royal transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
