import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <p className="page-shell">Loading...</p>;

  if (!user) {
    return (
      <Navigate
        to={adminOnly ? '/admin/login' : '/login'}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to={user.role === 'customer' ? '/account' : '/admin/login'} replace />;
  }

  return <Outlet />;
}
