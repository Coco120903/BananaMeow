import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatsPage from "./pages/CatsPage.jsx";
import DonatePage from "./pages/DonatePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ShopCategoryPage from "./pages/ShopCategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

// Admin imports
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCatsPage from "./pages/admin/AdminCatsPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminDonationsPage from "./pages/admin/AdminDonationsPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";

function PublicLayout({ children }) {
  return (
    <>
      {/* Animated Background */}
      <div className="app-background">
        {/* Floating gradient orbs */}
        <div className="floating-orb floating-orb-1" style={{ top: '10%', left: '5%' }} />
        <div className="floating-orb floating-orb-2" style={{ top: '60%', right: '10%' }} />
        <div className="floating-orb floating-orb-3" style={{ bottom: '20%', left: '30%' }} />
        <div className="floating-orb floating-orb-1" style={{ top: '40%', right: '25%', opacity: 0.5 }} />
        
        {/* Sparkle decorations */}
        <div className="sparkle-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: ['#FFE699', '#EBDCF9', '#FDE2E4', '#D4F5E9'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative flex min-h-screen flex-col text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="cats" element={<AdminCatsPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="donations" element={<AdminDonationsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
              </Route>

              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/cats" element={<CatsPage />} />
                      <Route path="/donate" element={<DonatePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route
                        path="/shop/apparel"
                        element={
                          <ShopCategoryPage title="Apparel" category="Apparel" />
                        }
                      />
                      <Route
                        path="/shop/cat-items"
                        element={
                          <ShopCategoryPage title="Cat Items" category="Cat items" />
                        }
                      />
                      <Route
                        path="/shop/accessories"
                        element={
                          <ShopCategoryPage
                            title="Accessories"
                            category="Accessories"
                          />
                        }
                      />
                      <Route path="/shop/:productId" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/about" element={<AboutPage />} />
                    </Routes>
                  </PublicLayout>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
