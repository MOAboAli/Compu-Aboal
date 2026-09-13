import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const from = location.state?.from;

  if (!loading && user) {
    return <Navigate to={isAdmin ? '/admin' : from || '/account'} replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const loggedIn = await login(form);
      if (loggedIn.role === 'customer') {
        navigate(from && !String(from).startsWith('/admin') ? from : '/account');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack narrow">
      <h1>{t('auth.loginTitle')}</h1>
      <form className="form" onSubmit={submit}>
        <label className="span-2">
          {t('auth.emailOrPhone')}
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="username"
            required
          />
        </label>
        <label className="span-2">
          {t('auth.password')}
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('auth.login')}</button>
      </form>
      <p>
        {t('auth.noAccount')} <Link to="/register" state={{ from }}>{t('auth.createAccount')}</Link>
        {' · '}
        <Link to="/forgot-password">{t('auth.forgot')}</Link>
      </p>
    </div>
  );
}
