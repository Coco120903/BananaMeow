import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE } from "../lib/api.js";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Sparkles,
  Clock,
  Mail,
  MailOpen,
} from "lucide-react";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const fetchNotifications = async (page) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/notifications?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setPagination(data.pagination);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (notif) => {
    const isExpanding = expandedId !== notif._id;
    setExpandedId(isExpanding ? notif._id : null);

    // Mark as read when expanding if not already read
    if (isExpanding && !notif.isRead) {
      try {
        await fetch(`${API_BASE}/api/notifications/${notif._id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const goToPage = (page) => {
    setExpandedId(null);
    fetchNotifications(page);
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-royal flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center shadow-soft">
              <Bell className="h-6 w-6 text-royal" />
            </div>
            Notifications
          </h1>
          <p className="text-ink/50 mt-2">
            Stay updated with the latest from BananaMeow
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-banana-100 to-lilac/40 text-royal font-medium hover:shadow-soft transition-all disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            {markingAll ? "Marking..." : `Mark all read (${unreadCount})`}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-6 shadow-soft">
            <Sparkles className="h-12 w-12 text-royal/40" />
          </div>
          <h2 className="text-xl font-bold text-royal mb-2">No notifications yet</h2>
          <p className="text-ink/50 max-w-sm mx-auto">
            When BananaMeow has updates, you'll see them here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isExpanded = expandedId === notif._id;
            const notification = notif.notification;
            return (
              <div
                key={notif._id}
                className={`bg-white rounded-2xl border shadow-soft overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md ${
                  notif.isRead ? "border-royal/5" : "border-royal/20 ring-1 ring-royal/10"
                }`}
                onClick={() => handleExpand(notif)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleExpand(notif); } }}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 transition-colors ${
                      notif.isRead
                        ? "bg-cream"
                        : "bg-gradient-to-br from-banana-200 to-lilac/40"
                    }`}>
                      {notif.isRead ? (
                        <MailOpen className="h-5 w-5 text-ink/40" />
                      ) : (
                        <Mail className="h-5 w-5 text-royal" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className={`font-bold text-sm sm:text-base truncate ${notif.isRead ? "text-ink/70" : "text-royal"}`}>
                          {notification?.title}
                        </h3>
                        {!notif.isRead ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-royal/10 text-royal text-xs font-semibold shrink-0">
                            Unread
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-ink/5 text-ink/50 text-xs font-medium shrink-0">
                            Read
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <p className="text-xs text-ink/40 flex items-center gap-1 mb-2">
                        <Clock className="h-3 w-3" />
                        {notification?.createdAt
                          ? new Date(notification.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>

                      {/* Preview / Full message */}
                      {isExpanded ? (
                        <div className="mt-2">
                          <p className="text-sm text-ink/70 whitespace-pre-wrap leading-relaxed">
                            {notification?.message}
                          </p>
                          {notif.readAt && (
                            <p className="text-[11px] text-ink/30 mt-3">
                              Read on {new Date(notif.readAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-ink/50 line-clamp-2">
                          {notification?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            type="button"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm text-ink/70">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
