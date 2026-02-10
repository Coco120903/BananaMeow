import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Cat,
  Package,
  Heart,
  ShoppingCart,
  LogOut,
  Crown,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/cats", icon: Cat, label: "Manage Cats" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/donations", icon: Heart, label: "Donations" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" }
];

export default function AdminLayout() {
  const { admin, logout: adminLogout } = useAdminAuth();
  const { logout: userLogout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    userLogout(); // Also clear user auth context
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-banana-50 to-lilac/20">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md shadow-xl z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-ink/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-royal to-royal/80 rounded-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-banana-300" />
            </div>
            <div>
              <h1 className="font-bold text-royal text-lg">Banana Meow</h1>
              <p className="text-xs text-ink/50">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-royal/10 to-royal/5 text-royal font-semibold"
                    : "text-ink/70 hover:bg-cream hover:text-ink"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ink/10 bg-cream/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-banana-300 to-banana-400 rounded-full flex items-center justify-center">
              <Cat className="w-5 h-5 text-royal" />
            </div>
            <div>
              <p className="font-medium text-ink text-sm">{admin?.username || "Admin"}</p>
              <p className="text-xs text-ink/50">Royal Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blush/50 text-royal rounded-xl hover:bg-blush transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
