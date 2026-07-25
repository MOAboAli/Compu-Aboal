import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

const links = [
  ['', 'Dashboard'],
  ['users', 'Users'],
  ['categories', 'Categories'],
  ['products', 'Products'],
  ['orders', 'Orders'],
  ['services', 'Services'],
  ['requests', 'Service requests'],
  ['cms', 'CMS'],
  ['payments', 'Payments'],
  ['reports', 'Reports'],
  ['audit', 'Audit'],
  ['backups', 'Backups'],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin">
      <aside className="admin-side">
        <p className="brand">Admin</p>
        <p className="muted">{user?.email}</p>
        <nav>
          {links.map(([path, label]) => (
            <NavLink key={path || 'dash'} end={path === ''} to={path ? `/admin/${path}` : '/admin'}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/">Back to site</NavLink>
          <button type="button" className="linkish" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>
      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}
