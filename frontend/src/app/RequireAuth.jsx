import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
