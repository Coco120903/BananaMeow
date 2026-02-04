import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-cream text-ink">
            <Navbar />
            <main className="flex-1">
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
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
