import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');

  function setField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await register(form);
      navigate('/account');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack narrow">
      <h1>Register</h1>
      <form className="form" onSubmit={submit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={setField} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={setField} required />
        </label>
        <label>
          Mobile
          <input name="phone" value={form.phone} onChange={setField} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={setField}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
