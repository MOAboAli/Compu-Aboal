import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { RequireAuth } from './RequireAuth';
import './i18n';
import WebsiteLayout from '../website/layouts/WebsiteLayout';
import AdminLayout from '../admin/layouts/AdminLayout';
import HomePage from '../website/pages/HomePage';
import ShopPage from '../website/pages/ShopPage';
import ProductPage from '../website/pages/ProductPage';
import ServicesPage from '../website/pages/ServicesPage';
import ServiceDetailPage from '../website/pages/ServiceDetailPage';
import ServiceRequestPage from '../website/pages/ServiceRequestPage';
import AboutPage from '../website/pages/AboutPage';
import ContactPage from '../website/pages/ContactPage';
import LoginPage from '../website/pages/LoginPage';
import RegisterPage from '../website/pages/RegisterPage';
import ForgotPasswordPage from '../website/pages/ForgotPasswordPage';
import AccountPage from '../website/pages/AccountPage';
import CartPage from '../website/pages/CartPage';
import PaymentSimPage from '../website/pages/PaymentSimPage';
import CheckoutSuccessPage from '../website/pages/CheckoutSuccessPage';
import AdminLoginPage from '../admin/pages/AdminLoginPage';
import AdminDashboardPage from '../admin/pages/DashboardPage';
import AdminUsersPage from '../admin/pages/UsersPage';
import AdminProductsPage from '../admin/pages/ProductsPage';
import AdminCategoriesPage from '../admin/pages/CategoriesPage';
import AdminOrdersPage from '../admin/pages/OrdersPage';
import AdminRequestsPage, { AdminServicesPage } from '../admin/pages/RequestsPage';
import AdminCmsPage from '../admin/pages/CmsPage';
import AdminAvailabilityPage from '../admin/pages/AvailabilityPage';
import AdminReportsPage, {
  AdminAuditPage,
  AdminBackupsPage,
  AdminPaymentsPage,
} from '../admin/pages/ReportsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<WebsiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:id" element={<ProductPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:serviceId/appointment" element={<ServiceRequestPage />} />
            <Route path="services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<RequireAuth />}>
              <Route path="account" element={<AccountPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout/pay/:orderId" element={<PaymentSimPage />} />
              <Route path="checkout/success/:orderId" element={<CheckoutSuccessPage />} />
            </Route>
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<RequireAuth adminOnly />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="requests" element={<AdminRequestsPage />} />
              <Route path="availability" element={<AdminAvailabilityPage />} />
              <Route path="cms" element={<AdminCmsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="audit" element={<AdminAuditPage />} />
              <Route path="backups" element={<AdminBackupsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
