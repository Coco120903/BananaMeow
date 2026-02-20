import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Crown, X, Sparkles } from "lucide-react";

/**
 * WelcomeBackPopup – Shows a warm welcome message when a verified user logs back in.
 * 
 * Behavior:
 * - Only shows once per session (uses sessionStorage)
 * - Triggers after successful login
 * - Auto-fades after 2 seconds
 * - Can be manually closed with X button
 * - Smooth fade in/out animations
 * - Matches Banana Meow design aesthetic
 */

const STORAGE_KEY = "hasSeenWelcomePopup";

export default function WelcomeBackPopup() {
  const { user, isAuthenticated } = useAuth();
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const autoCloseTimerRef = useRef(null);
  const prevAuthRef = useRef(false);
  const isInitialMountRef = useRef(true);

  // Check if popup should be shown
  useEffect(() => {
    // Only show for authenticated, verified users (non-admin)
    // Since all logged-in users have completed verification, we check isAuthenticated
    const shouldShow = isAuthenticated && user && user.role !== "admin";
    const wasAuthenticated = prevAuthRef.current;
    const isInitialMount = isInitialMountRef.current;
    
    // On initial mount, set the ref to current auth state
    if (isInitialMount) {
      prevAuthRef.current = isAuthenticated;
      isInitialMountRef.current = false;
      return; // Don't show popup on initial mount
    }
    
    // Update ref for next render
    prevAuthRef.current = isAuthenticated;

    // Only trigger on login (transition from not-auth to auth)
    // Don't show if already authenticated or if shouldShow is false
    if (!shouldShow || wasAuthenticated) {
      return;
    }

    // Check if already shown in this session
    const hasSeen = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeen) {
      return;
    }

    // Small delay to let the page settle after login redirect
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  // Auto-close after 2 seconds
  useEffect(() => {
    if (!show) return;

    autoCloseTimerRef.current = setTimeout(() => {
      handleClose();
    }, 2000);

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [show]);

  const handleClose = () => {
    setIsExiting(true);
    // Remove from DOM after animation
    setTimeout(() => {
      setShow(false);
      setIsExiting(false);
    }, 300);
  };

  // Clear session flag on logout
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [isAuthenticated]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-[9998] transition-all duration-300 ease-out ${
        isExiting
          ? "opacity-0 translate-x-8 scale-95"
          : "opacity-100 translate-x-0 scale-100"
      }`}
      style={{
        maxWidth: "min(400px, calc(100vw - 2rem))",
        pointerEvents: "auto",
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-royal/10 overflow-hidden relative">
        {/* Accent gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-banana-400 via-royal to-lilac" />

        <div className="p-5 relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-lg hover:bg-cream transition-colors grid place-items-center flex-shrink-0 z-10"
            aria-label="Close welcome message"
          >
            <X className="h-4 w-4 text-ink/40 hover:text-ink/70" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-4 pr-8">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center flex-shrink-0 shadow-soft">
              <Crown className="h-6 w-6 text-royal" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="font-bold text-royal text-lg mb-1.5 flex items-center gap-2">
                Welcome Back, Royal Human 👑🐱
                <Sparkles className="h-4 w-4 text-banana-400" />
              </h3>

              {/* Message */}
              <p className="text-sm text-ink/70 leading-relaxed">
                The Banana Meow Royals missed you. Ready to serve the chonky kingdom again?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
