import { useEffect, useRef, useCallback } from "react";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const STORAGE_KEY = "lastActivityTime";
const LOGOUT_EVENT_KEY = "forceLogout";

/**
 * Custom hook to handle user inactivity and auto-logout
 * Tracks user activity and logs out after 30 minutes of inactivity
 * Supports multi-tab synchronization via localStorage events
 */
export function useInactivityTimer(isAuthenticated, onLogout) {
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Reset timer function - clears existing timer and starts a new one
  const resetTimer = useCallback(() => {
    // Clear existing timeout to prevent duplicate timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only set timer if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Update last activity time
    const now = Date.now();
    lastActivityRef.current = now;
    
    // Store in localStorage for multi-tab sync
    try {
      localStorage.setItem(STORAGE_KEY, now.toString());
    } catch (err) {
      console.error("Failed to store activity time:", err);
    }

    // Start new 30-minute timer
    timeoutRef.current = setTimeout(() => {
      console.log("[INACTIVITY] 30-minute inactivity timeout reached");
      
      // Trigger logout in all tabs via localStorage event
      try {
        localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
        localStorage.removeItem(LOGOUT_EVENT_KEY);
      } catch (err) {
        console.error("Failed to broadcast logout event:", err);
      }
      
      // Execute logout
      if (onLogout) {
        onLogout("You have been logged out due to inactivity.");
      }
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, onLogout]);

  // Handle user activity - resets the timer
  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Check if session expired while tab was inactive
  const checkExpiredSession = useCallback(() => {
    if (!isAuthenticated) return;

    try {
      const storedTime = localStorage.getItem(STORAGE_KEY);
      if (storedTime) {
        const lastActivity = parseInt(storedTime, 10);
        const timeSinceActivity = Date.now() - lastActivity;
        
        // If more than 30 minutes have passed, logout immediately
        if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
          console.log("[INACTIVITY] Session expired while tab was inactive");
          if (onLogout) {
            onLogout("You have been logged out due to inactivity.");
          }
          return;
        }
        
        // If less than 30 minutes, reset timer with remaining time
        const remainingTime = INACTIVITY_TIMEOUT - timeSinceActivity;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (onLogout) {
            onLogout("You have been logged out due to inactivity.");
          }
        }, remainingTime);
        
        lastActivityRef.current = lastActivity;
      }
    } catch (err) {
      console.error("Failed to check expired session:", err);
    }
  }, [isAuthenticated, onLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timer if user is not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Check for expired session on mount or when authentication changes
    checkExpiredSession();

    // Set up activity event listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    // Add event listeners with passive option for better performance
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible - check if session expired
        checkExpiredSession();
      } else {
        // Tab became hidden - store current time
        try {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        } catch (err) {
          console.error("Failed to store activity time:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle multi-tab logout synchronization
    const handleStorageChange = (e) => {
      if (e.key === LOGOUT_EVENT_KEY && e.newValue) {
        // Another tab triggered logout
        console.log("[INACTIVITY] Logout triggered from another tab");
        if (onLogout) {
          onLogout("You have been logged out due to inactivity.");
        }
      } else if (e.key === STORAGE_KEY && e.newValue) {
        // Another tab updated activity - reset timer
        const newActivityTime = parseInt(e.newValue, 10);
        if (newActivityTime > lastActivityRef.current) {
          lastActivityRef.current = newActivityTime;
          resetTimer();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      // Remove all event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAuthenticated, handleActivity, resetTimer, checkExpiredSession, onLogout]);

  return {
    resetTimer,
    handleActivity,
  };
}
