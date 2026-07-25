import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === 'customer' ? '/account' : '/admin');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack narrow">
      <h1>Login</h1>
      <form className="form" onSubmit={submit}>
        <label>
          Email or phone
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
        <button type="submit">Login</button>
      </form>
      <p>
        <Link to="/register">Create account</Link> · <Link to="/forgot-password">Forgot password</Link>
      </p>
    </div>
  );
}
