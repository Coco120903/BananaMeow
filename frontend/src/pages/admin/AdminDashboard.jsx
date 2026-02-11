import { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { API_BASE } from "../../lib/api.js";
import {
  Cat,
  Package,
  Heart,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Crown,
  Sparkles,
  Users,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#7c3aed", "#fbbf24", "#ec4899", "#10b981", "#3b82f6", "#f59e0b"];

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/dashboard?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/api/admin/analytics?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      color: "from-royal/20 to-royal/10",
      iconColor: "text-royal",
      growth: stats?.stats?.userGrowth || "0%"
    },
    {
      title: "Total Revenue",
      value: `$${parseFloat(stats?.stats?.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "from-emerald-200 to-emerald-100",
      iconColor: "text-emerald-600",
      growth: stats?.stats?.revenueGrowth || "0%"
    },
    {
      title: "Total Orders",
      value: stats?.stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "from-mint to-mint/50",
      iconColor: "text-emerald-600",
      subValue: `Pending: ${stats?.stats?.pendingOrders || 0}`
    },
    {
      title: "Total Donations",
      value: `$${parseFloat(stats?.stats?.totalDonations || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Heart,
      color: "from-blush to-blush/50",
      iconColor: "text-pink-500"
    },
    {
      title: "Active Users",
      value: stats?.stats?.activeUsers || 0,
      icon: Activity,
      color: "from-banana-200 to-banana-100",
      iconColor: "text-amber-600",
      subValue: `New this week: ${stats?.stats?.newUsersThisWeek || 0}`
    },
    {
      title: "Gallery Posts",
      value: stats?.stats?.totalGalleryPosts || 0,
      icon: Package,
      color: "from-lilac/20 to-lilac/10",
      iconColor: "text-purple-600"
    },
    {
      title: "Cats Supported",
      value: stats?.stats?.totalCats || 0,
      icon: Cat,
      color: "from-royal/20 to-royal/10",
      iconColor: "text-royal"
    },
    {
      title: "Top Spender",
      value: stats?.stats?.topSpenderName || "N/A",
      icon: Crown,
      color: "from-amber-200 to-amber-100",
      iconColor: "text-amber-600",
      subValue: `$${parseFloat(stats?.stats?.topSpenderAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  ];

  const renderGrowth = (growth) => {
    if (!growth || growth === "0%") return null;
    const isPositive = parseFloat(growth) > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-emerald-600" : "text-coral"}`}>
        <Icon className="w-3 h-3" />
        <span>{growth}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Filters and Refresh */}
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setLoading(true);
            }}
            className="px-4 py-2 rounded-xl border border-ink/20 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-royal/30"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white border border-ink/20 hover:bg-cream transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-royal ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className={`w-8 h-8 ${card.iconColor}`} />
              {renderGrowth(card.growth)}
            </div>
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="text-sm text-ink/60">{card.title}</p>
            {card.subValue && (
              <p className="text-xs text-ink/50 mt-1">{card.subValue}</p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue & Donation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-royal" />
            Revenue Over Time
          </h2>
          {analytics?.revenueOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="shopRevenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Shop Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="donationRevenue"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Donation Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="combinedRevenue"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  name="Combined Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-ink/50">
              No revenue data available
            </div>
          )}
        </div>

        {/* Donation Distribution by Cat */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-pink-500" />
            Donation Distribution by Cat
          </h2>
          {analytics?.donationByCat?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.donationByCat}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="totalAmount" fill="#ec4899" name="Total Donations ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-ink/50">
              No donation data available
            </div>
          )}
        </div>
      </div>

      {/* Category Sales & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sales Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Category Sales Breakdown
          </h2>
          {analytics?.categorySales?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categorySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="totalSales" fill="#10b981" name="Total Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-ink/50">
              No sales data available
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-royal" />
            Order Status Breakdown
          </h2>
          {stats?.stats && (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: "Completed", value: stats.stats.completedOrders || 0 },
                    { name: "Pending", value: stats.stats.pendingOrders || 0 },
                    { name: "Cancelled", value: stats.stats.cancelledOrders || 0 },
                    { name: "Refunded", value: stats.stats.refundedOrders || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Completed", value: stats.stats.completedOrders || 0 },
                    { name: "Pending", value: stats.stats.pendingOrders || 0 },
                    { name: "Cancelled", value: stats.stats.cancelledOrders || 0 },
                    { name: "Refunded", value: stats.stats.refundedOrders || 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* User Analytics & Top Spenders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-royal" />
            User Growth
          </h2>
          {analytics?.userGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-ink/50">
              No user growth data available
            </div>
          )}
        </div>

        {/* Average Order Value */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Order Analytics
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <p className="text-sm text-ink/60">Average Order Value</p>
              <p className="text-3xl font-bold text-emerald-600">
                ${parseFloat(analytics?.averageOrderValue || 0).toFixed(2)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-cream/50 rounded-xl">
                <p className="text-xs text-ink/60">Total Orders</p>
                <p className="text-xl font-bold text-ink">{analytics?.totalOrders || 0}</p>
              </div>
              <div className="p-4 bg-cream/50 rounded-xl">
                <p className="text-xs text-ink/60">Total Revenue</p>
                <p className="text-xl font-bold text-ink">
                  ${parseFloat(analytics?.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Spenders Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
        <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          Top Spenders
        </h2>
        {analytics?.topSpenders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink/60">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink/60">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink/60">Total Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink/60">Total Donations</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-ink/60">Orders</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topSpenders.map((spender, index) => (
                  <tr key={spender.email} className="border-b border-ink/5 hover:bg-cream/30">
                    <td className="py-3 px-4 text-ink">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-ink">{spender.name}</td>
                    <td className="py-3 px-4 text-ink">
                      ${parseFloat(spender.totalSpent || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-ink">
                      ${parseFloat(spender.totalDonations || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-ink">{spender.orderCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-ink/50 text-center py-8">No spending data available</p>
        )}
      </div>

      {/* Most Purchased Products & Gallery Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Purchased Products */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Most Purchased Products
          </h2>
          {analytics?.mostPurchased?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.mostPurchased.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="totalQuantity" fill="#10b981" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-ink/50">
              No product data available
            </div>
          )}
        </div>

        {/* Gallery Engagement */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-royal mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Gallery Engagement
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <p className="text-sm text-ink/60">Total Likes</p>
              <p className="text-3xl font-bold text-pink-600">{analytics?.totalLikes || 0}</p>
            </div>
            {analytics?.mostLikedPost && (
              <div className="p-4 bg-cream/50 rounded-xl">
                <p className="text-xs text-ink/60 mb-1">Most Liked Post</p>
                <p className="font-medium text-ink">{analytics.mostLikedPost.title}</p>
                <p className="text-sm text-ink/60 mt-1">
                  {analytics.mostLikedPost.likesCount || 0} likes
                </p>
              </div>
            )}
            {analytics?.engagementOverTime?.length > 0 && (
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={analytics.engagementOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="_id" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalLikes"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="Likes"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
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
