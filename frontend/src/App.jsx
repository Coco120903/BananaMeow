import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
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
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import GalleryDetailPage from "./pages/GalleryDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCatsPage from "./pages/admin/AdminCatsPage.jsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";
import AdminDonationsPage from "./pages/admin/AdminDonationsPage.jsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.jsx";
import AdminGalleryPage from "./pages/AdminGalleryPage.jsx";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import NotificationPopup from "./components/NotificationPopup.jsx";

function PublicLayout({ children }) {
  return (
    <>
      {/* Animated Background */}
      <div className="app-background">
        {/* Mesh gradient layer */}
        <div className="mesh-gradient" />

        {/* Floating gradient orbs */}
        <div
          className="floating-orb floating-orb-1"
          style={{ top: "5%", left: "3%" }}
        />
        <div
          className="floating-orb floating-orb-2"
          style={{ top: "55%", right: "5%" }}
        />
        <div
          className="floating-orb floating-orb-3"
          style={{ bottom: "15%", left: "25%" }}
        />
        <div
          className="floating-orb floating-orb-1"
          style={{ top: "35%", right: "20%", opacity: 0.6 }}
        />
        <div
          className="floating-orb floating-orb-2"
          style={{ bottom: "40%", left: "60%", opacity: 0.4 }}
        />
        <div
          className="floating-orb floating-orb-3"
          style={{ top: "70%", left: "8%", opacity: 0.5 }}
        />

        {/* Decorative blob shapes */}
        <div className="blob-shape blob-shape-1" />
        <div className="blob-shape blob-shape-2" />
        <div className="blob-shape blob-shape-3" />

        {/* Sparkle decorations */}
        <div className="sparkle-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
                background: [
                  "#FFE699",
                  "#EBDCF9",
                  "#FDE2E4",
                  "#D4F5E9",
                  "#BAE6FD",
                  "#FFB5A7",
                ][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>

        {/* Floating cat paw prints */}
        <div className="paw-prints-container">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="paw-print"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 10}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col text-ink overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationPopup />
            <Routes>
              {/* Admin Routes - redirect old admin login to unified login */}
              <Route
                path="/admin/login"
                element={<Navigate to="/login" replace />}
              />

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
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="donations" element={<AdminDonationsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
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
                          <ShopCategoryPage
                            title="Apparel"
                            category="Apparel"
                          />
                        }
                      />
                      <Route
                        path="/shop/cat-items"
                        element={
                          <ShopCategoryPage
                            title="Cat Items"
                            category="Cat Items"
                          />
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
                      <Route
                        path="/shop/:productId"
                        element={<ProductPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                      />
                      <Route
                        path="/reset-password/:token"
                        element={<ResetPasswordPage />}
                      />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route
                        path="/gallery/:id"
                        element={<GalleryDetailPage />}
                      />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute>
                            <NotificationsPage />
                          </ProtectedRoute>
                        }
                      />
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
