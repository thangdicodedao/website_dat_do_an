import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastProvider, ScrollToTop, PageTransition } from './components/common';
import { Layout, AdminLayout } from './components/layout';
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  AuthPages,
  VerifyEmailPage,
  ForgotPasswordPage,
  VerifyForgotPasswordPage,
  ProfilePage,
  QRPage,
  ContactPage,
  FAQPage,
  ShippingPolicyPage,
  ReturnPolicyPage,
  PrivacyPolicyPage,
  AdminDashboard,
  AdminProducts,
  AdminOrders,
  AdminUsers,
} from './pages';
import { useAppDispatch } from './hooks';
import { checkAuth } from './store/slices/authSlice';
import { useEffect } from 'react';

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <PageTransition>
        <Routes>
      {/* User Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<ProfilePage />} />
        <Route path="/order/:orderId" element={<OrderConfirmationPage />} />

        {/* Auth Routes - with Layout */}
        <Route path="/login" element={<AuthPages />} />
        <Route path="/register" element={<AuthPages />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-forgot-password" element={<VerifyForgotPasswordPage />} />

        {/* Policy Routes */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shipping" element={<ShippingPolicyPage />} />
        <Route path="/return" element={<ReturnPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
      </Route>

      {/* QR Ordering */}
      <Route path="/table/:tableId" element={<QRPage />} />
      <Route path="/qr" element={<QRPage />} />

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </PageTransition>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
}

export default App;
