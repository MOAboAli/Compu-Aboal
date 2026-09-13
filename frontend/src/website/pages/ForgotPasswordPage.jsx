import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../shared/api';
import { MIN_PASSWORD } from '../../shared/accountValidation';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="stack narrow">
      <h1>{t('auth.forgotTitle')}</h1>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          try {
            const res = await authApi.forgotPassword({ email });
            setMessage(res.message || t('auth.resetSent'));
            if (res.simulatedToken || res.resetToken) {
              setToken(res.simulatedToken || res.resetToken);
            }
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <label className="span-2">
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">{t('auth.sendReset')}</button>
      </form>
      {token && (
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            try {
              const res = await authApi.resetPassword({ token, password });
              setMessage(res.message || t('auth.resetDone'));
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          <label className="span-2">
            {t('auth.resetToken')}
            <input value={token} onChange={(e) => setToken(e.target.value)} />
          </label>
          <label className="span-2">
            {t('auth.newPassword')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={MIN_PASSWORD}
              required
            />
          </label>
          <button type="submit">{t('auth.resetPassword')}</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {message && <p>{message}</p>}
      <p>
        <Link to="/login">{t('auth.backToLogin')}</Link>
      </p>
    </div>
  );
}
