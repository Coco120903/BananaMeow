import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Cat,
  Package,
  Heart,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Crown,
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Royal Cats",
      value: stats?.stats?.catsCount || 0,
      icon: Cat,
      color: "from-royal/20 to-royal/10",
      iconColor: "text-royal"
    },
    {
      title: "Products",
      value: stats?.stats?.productsCount || 0,
      icon: Package,
      color: "from-banana-200 to-banana-100",
      iconColor: "text-amber-600"
    },
    {
      title: "Total Donations",
      value: `$${(stats?.stats?.totalDonationAmount || 0).toFixed(2)}`,
      icon: Heart,
      color: "from-blush to-blush/50",
      iconColor: "text-pink-500"
    },
    {
      title: "Total Orders",
      value: `$${(stats?.stats?.totalOrderAmount || 0).toFixed(2)}`,
      icon: ShoppingCart,
      color: "from-mint to-mint/50",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-royal to-royal/80 rounded-2xl flex items-center justify-center">
          <Crown className="w-7 h-7 text-banana-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-royal">Royal Dashboard</h1>
          <p className="text-ink/60 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Welcome back to the kingdom
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.iconColor}`} />
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="text-sm text-ink/60">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Recent Donations
          </h2>
          {stats?.recentDonations?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentDonations.slice(0, 5).map((donation) => (
                <div
                  key={donation._id}
                  className="flex items-center justify-between p-3 bg-cream/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-ink">{donation.type}</p>
                    <p className="text-xs text-ink/50">For {donation.cat}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-royal">${donation.amount}</p>
                    <p className="text-xs text-ink/50">{donation.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink/50 text-center py-8">No donations yet 🐱</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            Recent Orders
          </h2>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-cream/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {order.items?.length || 0} items
                    </p>
                    <p className="text-xs text-ink/50">{order.email || "No email"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-royal">${order.total?.toFixed(2)}</p>
                    <p className="text-xs text-ink/50 capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink/50 text-center py-8">No orders yet 🛒</p>
          )}
        </div>
      </div>
    </div>
  );
}
