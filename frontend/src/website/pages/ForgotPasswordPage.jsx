import { useState } from 'react';
import { authApi } from '../../shared/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="stack narrow">
      <h1>Forgot password</h1>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await authApi.forgotPassword({ email });
          setMessage(res.message || 'Reset token simulated');
          if (res.resetToken) setToken(res.resetToken);
        }}
      >
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Send reset (simulated)</button>
      </form>
      {token && (
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await authApi.resetPassword({ token, password });
            setMessage(res.message || 'Password updated');
          }}
        >
          <label>
            Simulated token
            <input value={token} onChange={(e) => setToken(e.target.value)} />
          </label>
          <label>
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Reset password</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
