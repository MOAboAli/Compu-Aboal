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
import ServiceRequestPage from '../website/pages/ServiceRequestPage';
import AboutPage from '../website/pages/AboutPage';
import ContactPage from '../website/pages/ContactPage';
import AdminLoginPage from '../admin/pages/AdminLoginPage';
import AdminDashboardPage from '../admin/pages/DashboardPage';
import AdminUsersPage from '../admin/pages/UsersPage';
import AdminProductsPage from '../admin/pages/ProductsPage';
import AdminCategoriesPage from '../admin/pages/CategoriesPage';
import AdminOrdersPage from '../admin/pages/OrdersPage';
import AdminRequestsPage, { AdminServicesPage } from '../admin/pages/RequestsPage';
import AdminCmsPage from '../admin/pages/CmsPage';
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
            <Route path="services/request/:type" element={<ServiceRequestPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
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
