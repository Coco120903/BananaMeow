import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Star,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" }
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= rating ? "text-banana-400 fill-banana-400" : "text-ink/20"
          }`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-banana-100 text-amber-700",
    approved: "bg-mint/40 text-emerald-700",
    rejected: "bg-blush/50 text-coral"
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-cream text-ink/60"
      }`}
    >
      {status === "pending" && <Clock className="w-3 h-3" />}
      {status === "approved" && <CheckCircle className="w-3 h-3" />}
      {status === "rejected" && <XCircle className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminReviewsPage() {
  const { token } = useAdminAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [actionLoading, setActionLoading] = useState(null); // track which review is being acted on
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: pageNum, limit: 15 });
      if (activeTab) params.append("status", activeTab);
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(`${API_BASE}/api/site-reviews/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
        setCounts(data.counts);
        setPage(data.page);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [token, activeTab]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/api/site-reviews/admin/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Review approved successfully");
        fetchReviews(page);
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to approve", "error");
      }
    } catch {
      showToast("Failed to approve review", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/api/site-reviews/admin/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Review rejected");
        fetchReviews(page);
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to reject", "error");
      }
    } catch {
      showToast("Failed to reject review", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE}/api/site-reviews/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Review deleted");
        fetchReviews(page);
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete review", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-fade-in ${
            toast.type === "error"
              ? "bg-coral/90 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-royal" />
            Customer Reviews
          </h1>
          <p className="text-ink/60">Manage and moderate customer feedback</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-gradient-to-r from-banana-100 to-banana-200 px-4 py-2 rounded-xl">
            <p className="text-xs text-ink/60">Pending</p>
            <p className="text-lg font-bold text-amber-700">{counts.pending}</p>
          </div>
          <div className="bg-gradient-to-r from-mint/30 to-mint/50 px-4 py-2 rounded-xl">
            <p className="text-xs text-ink/60">Approved</p>
            <p className="text-lg font-bold text-emerald-700">{counts.approved}</p>
          </div>
          <div className="bg-gradient-to-r from-blush/30 to-blush/50 px-4 py-2 rounded-xl">
            <p className="text-xs text-ink/60">Rejected</p>
            <p className="text-lg font-bold text-coral">{counts.rejected}</p>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-royal text-white shadow-md"
                : "bg-white/80 text-ink/70 hover:bg-cream border border-ink/10"
            }`}
          >
            {tab.label}
            {tab.key === "" && ` (${counts.all})`}
            {tab.key === "pending" && ` (${counts.pending})`}
            {tab.key === "approved" && ` (${counts.approved})`}
            {tab.key === "rejected" && ` (${counts.rejected})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search by username, title, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-5 transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {review.profileImage ? (
                    <img
                      src={
                        review.profileImage.startsWith("http")
                          ? review.profileImage
                          : `${API_BASE}${review.profileImage.startsWith("/") ? "" : "/"}${review.profileImage}`
                      }
                      alt={review.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-banana-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-banana-100 to-lilac flex items-center justify-center">
                      <span className="text-lg font-bold text-royal">
                        {review.username?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{review.username}</span>
                      <StatusBadge status={review.status} />
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  {review.title && (
                    <p className="text-sm font-medium text-royal mb-1">{review.title}</p>
                  )}
                  <p className="text-sm text-ink/70 leading-relaxed">{review.message}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-ink/50">
                    <span>{review.email}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    {review.reviewedAt && (
                      <span>
                        Reviewed: {new Date(review.reviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {review.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      disabled={actionLoading === review._id}
                      className="p-2 rounded-xl bg-mint/30 text-emerald-700 hover:bg-mint/50 transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {review.status !== "rejected" && (
                    <button
                      onClick={() => handleReject(review._id)}
                      disabled={actionLoading === review._id}
                      className="p-2 rounded-xl bg-banana-100 text-amber-700 hover:bg-banana-200 transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={actionLoading === review._id}
                    className="p-2 rounded-xl bg-blush/30 text-coral hover:bg-blush/50 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <p className="text-ink/50 text-lg">
            {searchTerm
              ? "No reviews match your search"
              : activeTab
              ? `No ${activeTab} reviews yet`
              : "No reviews yet"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => fetchReviews(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-xl bg-white border border-ink/10 hover:bg-cream transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-royal" />
          </button>
          <span className="text-sm text-ink/60">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchReviews(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-xl bg-white border border-ink/10 hover:bg-cream transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-royal" />
          </button>
        </div>
      )}
    </div>
  );
}
