import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";
import { Bell, X, Clock } from "lucide-react";

/**
 * NotificationPopup – globally mounted at the App root.
 * Displays a stacked list of real-time notification pop-ups in the upper-right corner.
 *
 * Behavior:
 *  - Small card: shows title + short preview + X button
 *  - Click card → expand to show full message
 *  - Click outside expanded card → collapse back to small (does NOT close)
 *  - Click X → dismiss that notification from the pop-up stack
 *  - Only active for logged-in regular users (NOT admins); clears on logout
 *  - On login: fetches latest unread and shows as pop-up
 *  - Multiple notifications stack vertically (max 3 visible)
 */

const MAX_VISIBLE = 3;

export default function NotificationPopup() {
  const { token, isAuthenticated, user } = useAuth();
  const socketRef = useRef(null);
  const popupRef = useRef(null);

  // Queue of notification objects: { _id, title, message, createdAt }
  const [queue, setQueue] = useState([]);
  // Which notification _id is currently expanded (null = none)
  const [expandedId, setExpandedId] = useState(null);
  // Set of _id strings that are currently exiting (for animation)
  const [exitingIds, setExitingIds] = useState(new Set());
  // Track IDs already shown as popup to prevent duplicates
  const shownIdsRef = useRef(new Set());
  // Track previous auth state to detect login
  const prevAuthRef = useRef(false);

  // ─── Add a notification to the queue (deduped) ───
  const pushNotification = useCallback((notif) => {
    if (!notif?._id) return;
    const id = notif._id.toString();
    if (shownIdsRef.current.has(id)) return;
    shownIdsRef.current.add(id);
    setQueue((prev) => [notif, ...prev]);
  }, []);

  // ─── Dismiss a notification from the popup stack ───
  const dismissNotification = useCallback((id) => {
    setExitingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setQueue((prev) => prev.filter((n) => n._id !== id));
      setExitingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setExpandedId((prev) => (prev === id ? null : prev));
    }, 300);
  }, []);

  // ─── Click-outside handler: collapse expanded → small ───
  useEffect(() => {
    if (!expandedId) return;

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };

    // Delay listener slightly so the expand-click doesn't immediately trigger it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [expandedId]);

  // ─── Socket.IO connection + real-time listener ───
  useEffect(() => {
    // Hide popup for admins or unauthenticated users
    if (!isAuthenticated || !token || user?.role === 'admin') {
      // Not authenticated or is admin – disconnect any existing socket and clear popups
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setQueue([]);
      setExpandedId(null);
      shownIdsRef.current.clear();
      prevAuthRef.current = false;
      return;
    }

    // Connect Socket.IO
    const socket = io(API_BASE, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[NotificationPopup] Socket connected:", socket.id);
    });

    socket.on("new_notification", (data) => {
      console.log("[NotificationPopup] Received notification:", data?.title);
      pushNotification(data);
    });

    socket.on("connect_error", (err) => {
      console.warn("[NotificationPopup] Socket connect error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[NotificationPopup] Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, user?.role]);

  // ─── Fetch latest unread on login ───
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    // Only fetch when user transitions from not-auth → auth, and is NOT admin
    if (!isAuthenticated || !token || user?.role === 'admin') return;
    if (wasAuthenticated) return; // Already was authenticated, no re-fetch

    const fetchLatestUnread = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications?page=1&limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.notifications && data.notifications.length > 0) {
          const latest = data.notifications[0];
          if (!latest.isRead && latest.notification) {
            pushNotification({
              _id: latest.notification._id || latest._id,
              title: latest.notification.title,
              message: latest.notification.message,
              createdAt: latest.notification.createdAt,
            });
          }
        }
      } catch (err) {
        console.warn("[NotificationPopup] Failed to fetch unread:", err.message);
      }
    };

    // Small delay to let socket connect first
    const timer = setTimeout(fetchLatestUnread, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, user?.role]);

  // ─── Nothing to render ───
  // Hide popup for admins or unauthenticated users
  if (!isAuthenticated || !token || user?.role === 'admin' || queue.length === 0) return null;

  const visibleQueue = queue.slice(0, MAX_VISIBLE);
  const hiddenCount = Math.max(0, queue.length - MAX_VISIBLE);

  return (
    <div ref={popupRef} className="fixed top-20 right-4 z-[9999] flex flex-col gap-2" style={{ pointerEvents: "none" }}>
      {visibleQueue.map((notif, index) => {
        const isExpanded = expandedId === notif._id;
        const isExiting = exitingIds.has(notif._id);

        return (
          <div
            key={notif._id}
            className={`transition-all duration-300 ease-out ${
              isExiting ? "opacity-0 -translate-x-8 scale-95" : "opacity-100 translate-x-0 scale-100"
            }`}
            style={{
              maxWidth: isExpanded ? "min(420px, calc(100vw - 2rem))" : "320px",
              pointerEvents: "auto",
            }}
          >
            <div
              className={`bg-white rounded-2xl shadow-2xl border border-royal/10 overflow-hidden transition-all duration-300 ${
                isExpanded ? "" : "cursor-pointer hover:shadow-glow"
              }`}
              onClick={() => {
                if (!isExpanded) setExpandedId(notif._id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isExpanded) setExpandedId(notif._id);
              }}
              aria-label={isExpanded ? "Notification details" : "Click to expand notification"}
            >
              {/* Accent bar */}
              <div className="h-1 bg-gradient-to-r from-royal via-banana-400 to-coral" />

              <div className="p-4">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-banana-200 to-lilac/40 grid place-items-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-royal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-royal text-sm leading-tight truncate pr-6">
                      {notif.title}
                    </h4>
                    {!isExpanded && (
                      <p className="text-xs text-ink/50 mt-0.5 line-clamp-1">
                        {notif.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notif._id);
                    }}
                    className="w-7 h-7 rounded-lg hover:bg-cream transition-colors grid place-items-center flex-shrink-0 -mr-1 -mt-1"
                    aria-label="Close notification"
                  >
                    <X className="h-4 w-4 text-ink/40 hover:text-ink/70" />
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-3 animate-fade-in">
                    <p className="text-sm text-ink/70 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-royal/5">
                      <p className="text-[11px] text-ink/40 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notif._id);
                        }}
                        className="text-xs text-royal font-medium hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Click hint for first collapsed notification */}
            {!isExpanded && index === 0 && (
              <p className="text-[10px] text-ink/30 mt-1 ml-1">Click to expand</p>
            )}
          </div>
        );
      })}

      {/* Hidden count badge */}
      {hiddenCount > 0 && (
        <div className="text-[11px] text-ink/40 ml-1 mt-0.5" style={{ pointerEvents: "auto" }}>
          +{hiddenCount} more notification{hiddenCount > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
