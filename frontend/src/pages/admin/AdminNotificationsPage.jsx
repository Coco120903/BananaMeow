import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Bell,
  Plus,
  X,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Megaphone,
} from "lucide-react";

// --- Themed Modal ---
function NotifModal({ isOpen, onClose, type, title, message, onConfirm, confirmText, cancelText }) {
  if (!isOpen) return null;
  let bgColor, accentColor, icon;
  switch (type) {
    case "confirm":
      bgColor = "bg-amber-50"; accentColor = "bg-amber-500";
      icon = <AlertTriangle className="h-6 w-6 text-amber-700" />;
      break;
    case "error":
      bgColor = "bg-red-50"; accentColor = "bg-red-500";
      icon = <X className="h-6 w-6 text-red-700" />;
      break;
    case "success":
      bgColor = "bg-green-50"; accentColor = "bg-green-500";
      icon = <CheckCircle className="h-6 w-6 text-green-700" />;
      break;
    default:
      bgColor = "bg-white"; accentColor = "bg-royal"; icon = null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl max-w-sm w-full ${bgColor}`}>
        {accentColor && <div className={`h-2 rounded-t-2xl ${accentColor}`} />}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            {icon && <div className="w-10 h-10 rounded-full grid place-items-center bg-white shadow-sm">{icon}</div>}
            <h3 className="text-xl font-bold text-royal">{title}</h3>
          </div>
          <p className="text-ink/70">{message}</p>
          <div className="flex justify-end gap-3">
            {cancelText && (
              <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors">{cancelText}</button>
            )}
            {onConfirm && (
              <button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-white font-medium ${type === "confirm" ? "bg-amber-500 hover:bg-amber-600" : "bg-royal hover:bg-ink"} transition-colors`}>{confirmText || "Confirm"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Toast ---
function Toast({ isVisible, message, type }) {
  if (!isVisible) return null;
  let bgColor = "bg-green-500";
  if (type === "error") bgColor = "bg-red-500";
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-white shadow-lg ${bgColor} transition-opacity duration-300 z-50`}>{message}</div>
  );
}

export default function AdminNotificationsPage() {
  const { token } = useAdminAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Modal & toast
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", onConfirm: null, confirmText: "", cancelText: "Cancel" });
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((p) => ({ ...p, isVisible: false })), 3000);
  };

  const showConfirm = (title, message, confirmText) => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true, type: "confirm", title, message,
        onConfirm: () => { setModal((p) => ({ ...p, isOpen: false })); resolve(true); },
        confirmText, cancelText: "Cancel",
      });
    });
  };

  const showError = (title, message) => {
    setModal({ isOpen: true, type: "error", title, message, onConfirm: () => setModal((p) => ({ ...p, isOpen: false })), confirmText: "OK", cancelText: null });
  };

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showError("Missing Fields", "Please provide both a title and message.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/notifications/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: formData.title.trim(), message: formData.message.trim() }),
      });

      if (res.ok) {
        showToast("Notification sent to all users!");
        setFormData({ title: "", message: "" });
        setShowForm(false);
        loadNotifications();
      } else {
        const err = await res.json().catch(() => ({}));
        showError("Send Failed", err.message || "Failed to send notification.");
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      showError("Network Error", "Unable to reach the server.");
    } finally {
      setSending(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications/admin/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadNotifications();
        showToast("Notification visibility updated.");
      }
    } catch (err) {
      console.error("Error toggling:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Delete Notification?", "This will permanently remove the notification. This action cannot be undone.", "Yes, Delete");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/api/notifications/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadNotifications();
        showToast("Notification deleted.");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(notifications.length / postsPerPage);
  const startIdx = (currentPage - 1) * postsPerPage;
  const currentNotifs = notifications.slice(startIdx, startIdx + postsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} />
      <NotifModal isOpen={modal.isOpen} onClose={() => setModal((p) => ({ ...p, isOpen: false }))} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} confirmText={modal.confirmText} cancelText={modal.cancelText} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-royal" />
            Notifications / Updates
          </h1>
          <p className="text-ink/60">Send real-time notifications to all users</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal text-white hover:bg-ink transition-colors shadow-soft"
        >
          <Plus className="h-4 w-4" />
          New Notification
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-royal/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-royal flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Notification
              </h2>
              <button type="button" onClick={() => { setShowForm(false); setFormData({ title: "", message: "" }); }} className="w-8 h-8 rounded-lg hover:bg-cream transition-colors grid place-items-center">
                <X className="h-5 w-5 text-ink/60" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-xl border-2 border-royal/10 px-4 py-3 focus:outline-none focus:border-royal/30 transition-colors"
                  placeholder="e.g. New Feature Available!"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-ink/40 mt-1">{formData.title.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-royal mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  rows={6}
                  className="w-full rounded-xl border-2 border-royal/10 px-4 py-3 focus:outline-none focus:border-royal/30 transition-colors resize-none"
                  placeholder="Write the detailed notification message here..."
                  maxLength={5000}
                  required
                />
                <p className="text-xs text-ink/40 mt-1">{formData.message.length}/5000</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setFormData({ title: "", message: "" }); }} className="flex-1 px-6 py-3 rounded-xl border-2 border-royal/20 text-royal font-medium hover:bg-cream transition-colors" disabled={sending}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-royal text-white font-medium hover:bg-ink transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed" disabled={sending}>
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send to All Users
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-soft border border-royal/5">
          <p className="text-xs text-ink/50 mb-1">Total</p>
          <p className="text-2xl font-bold text-royal">{notifications.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft border border-royal/5">
          <p className="text-xs text-ink/50 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{notifications.filter((n) => n.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft border border-royal/5">
          <p className="text-xs text-ink/50 mb-1">Hidden</p>
          <p className="text-2xl font-bold text-ink/40">{notifications.filter((n) => !n.isActive).length}</p>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-banana-100 to-lilac/40 grid place-items-center mx-auto mb-4 shadow-soft">
            <Bell className="h-10 w-10 text-royal/50" />
          </div>
          <p className="text-lg font-semibold text-royal">No notifications yet</p>
          <p className="text-ink/50 mt-1">Send your first notification to all users!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentNotifs.map((notif) => (
            <div key={notif._id} className={`bg-white rounded-xl border shadow-soft overflow-hidden transition-all ${notif.isActive ? "border-royal/10" : "border-ink/10 opacity-60"}`}>
              <div className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 ${notif.isActive ? "bg-gradient-to-br from-banana-100 to-lilac/40" : "bg-ink/10"}`}>
                  <Bell className={`h-5 w-5 ${notif.isActive ? "text-royal" : "text-ink/40"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-royal text-sm truncate">{notif.title}</h3>
                    {!notif.isActive && (
                      <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded-full flex-shrink-0">Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50 mb-2">
                    {new Date(notif.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {" · "}by {notif.createdBy}
                  </p>
                  {expandedId === notif._id ? (
                    <p className="text-sm text-ink/70 whitespace-pre-wrap">{notif.message}</p>
                  ) : (
                    <p className="text-sm text-ink/70 line-clamp-2">{notif.message}</p>
                  )}
                  {notif.message.length > 100 && (
                    <button type="button" onClick={() => setExpandedId(expandedId === notif._id ? null : notif._id)} className="text-xs text-royal font-medium mt-1 hover:underline">
                      {expandedId === notif._id ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button type="button" onClick={() => handleToggle(notif._id)} className="p-2 rounded-lg hover:bg-cream transition-colors" title={notif.isActive ? "Hide notification" : "Show notification"}>
                    {notif.isActive ? <Eye className="h-4 w-4 text-royal" /> : <EyeOff className="h-4 w-4 text-ink/40" />}
                  </button>
                  <button type="button" onClick={() => handleDelete(notif._id)} className="p-2 rounded-lg hover:bg-coral/10 transition-colors" title="Delete notification">
                    <Trash2 className="h-4 w-4 text-coral" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {notifications.length > postsPerPage && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm text-ink/70">Page {currentPage} of {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border-2 border-royal/20 text-royal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
