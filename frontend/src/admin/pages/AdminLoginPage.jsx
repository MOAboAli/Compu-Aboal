import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export default function AdminLoginPage() {
  const { login, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const loggedIn = await login(form);
      if (!loggedIn || loggedIn.role === 'customer') {
        setError('Admin access only');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card form" onSubmit={submit}>
        <h1>Admin login</h1>
        <p className="muted">Staff access only. This page is not linked from the public site.</p>
        <label>
          Email
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
