import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { checkProductServiceHealth } from "./services/productService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AddUser from "./pages/admin/AddUser";
import ProductManagement from "./pages/admin/ProductManagement";
import AddProduct from "./pages/admin/AddProduct";
import OrderManagement from "./pages/admin/OrderManagement";
import CreateOrder from "./pages/admin/CreateOrder";
import PaymentManagement from "./pages/admin/PaymentManagement";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/payment-failed" element={<PaymentFailedPage />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  // ── Health-check on app startup (visible in browser console) ──
  // Calls: /api/products/health via API Gateway
  useEffect(() => {
    checkProductServiceHealth();
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/create" element={<CreateOrder />} />
            <Route path="payments" element={<PaymentManagement />} />
          </Route>
          
          {/* User Routes */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;