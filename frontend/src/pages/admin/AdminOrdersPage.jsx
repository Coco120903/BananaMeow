import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api.js";
import { ShoppingCart, Search, Package, DollarSign } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/orders`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-royal/20 border-t-royal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-royal flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-emerald-500" />
            Royal Orders
          </h1>
          <p className="text-ink/60">All shop orders from the kingdom</p>
        </div>
        <div className="bg-gradient-to-r from-mint to-mint/50 px-6 py-3 rounded-xl">
          <p className="text-sm text-ink/60">Total Revenue</p>
          <p className="text-2xl font-bold text-royal">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
        <input
          type="text"
          placeholder="Search by email or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/80 border border-ink/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/30"
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-mint/30 border-b border-ink/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-ink/70">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-ink/70">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-ink">{order.email || "Guest"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-ink/40" />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                      <div className="text-xs text-ink/50 mt-1">
                        {order.items?.slice(0, 2).map((item) => item.name).join(", ")}
                        {order.items?.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <DollarSign className="w-4 h-4" />
                        {order.total?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          order.status === "completed"
                            ? "bg-mint/50 text-emerald-700"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-banana-100 text-amber-700"
                        }`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink/60">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <ShoppingCart className="w-16 h-16 mx-auto text-ink/20 mb-4" />
          <p className="text-ink/50">No orders yet 🛒</p>
          <p className="text-sm text-ink/40 mt-1">
            Orders will appear here when customers make purchases
          </p>
        </div>
      )}
    </div>
  );
}
