import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import AddressFields from '../components/AddressFields';
import {
  compactProfilePayload,
  emptyRegisterForm,
  MIN_PASSWORD,
  validateAccountForm,
} from '../../shared/accountValidation';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(emptyRegisterForm);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const from = location.state?.from;
  const isCompany = form.accountType === 'company';

  const errorText = useMemo(
    () => ({
      required: t('auth.errors.required'),
      email: t('auth.errors.email'),
      password: t('auth.errors.password', { min: MIN_PASSWORD }),
      url: t('auth.errors.url'),
    }),
    [t]
  );

  if (!loading && user) {
    return <Navigate to={isAdmin ? '/admin' : from || '/account'} replace />;
  }

  function setField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const nextErrors = validateAccountForm(form, { requirePassword: true });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      await register({ ...compactProfilePayload(form), password: form.password });
      navigate(from && !String(from).startsWith('/admin') ? from : '/account');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <h1>{t('auth.registerTitle')}</h1>
      <form className="form" onSubmit={submit} noValidate>
        <div className="account-type-toggle span-2" role="group" aria-label={t('auth.accountType')}>
          {['personal', 'company'].map((type) => (
            <button
              key={type}
              type="button"
              className={form.accountType === type ? 'active' : ''}
              onClick={() => setForm((prev) => ({ ...prev, accountType: type }))}
            >
              {t(`auth.types.${type}`)}
            </button>
          ))}
        </div>
        <label>
          {t('auth.firstName')}
          <input name="firstName" value={form.firstName} onChange={setField} required />
          {fieldErrors.firstName && <span className="error">{errorText[fieldErrors.firstName]}</span>}
        </label>
        <label>
          {t('auth.lastName')}
          <input name="lastName" value={form.lastName} onChange={setField} required />
          {fieldErrors.lastName && <span className="error">{errorText[fieldErrors.lastName]}</span>}
        </label>
        <label>
          {t('auth.email')}
          <input name="email" type="email" value={form.email} onChange={setField} required />
          {fieldErrors.email && <span className="error">{errorText[fieldErrors.email]}</span>}
        </label>
        <label>
          {t('auth.phone')}
          <input name="phone" value={form.phone} onChange={setField} required />
          {fieldErrors.phone && <span className="error">{errorText[fieldErrors.phone]}</span>}
        </label>
        <label className="span-2">
          {t('auth.password')}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={setField}
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            required
          />
          {fieldErrors.password && <span className="error">{errorText[fieldErrors.password]}</span>}
        </label>

        <p className="section-copy span-2">{t('auth.primaryAddressOptional')}</p>
        <AddressFields
          value={form.primaryAddress}
          onChange={(primaryAddress) => setForm((prev) => ({ ...prev, primaryAddress }))}
          prefix="address"
        />

        {isCompany ? (
          <>
            <label className="span-2">
              {t('auth.companyAddress')}
              <textarea
                name="companyAddress"
                value={form.companyAddress}
                onChange={setField}
                required
              />
              {fieldErrors.companyAddress && (
                <span className="error">{errorText[fieldErrors.companyAddress]}</span>
              )}
            </label>
            <label className="span-2">
              {t('auth.companyWebsite')}
              <input
                name="companyWebsite"
                type="url"
                placeholder="https://"
                value={form.companyWebsite}
                onChange={setField}
                required
              />
              {fieldErrors.companyWebsite && (
                <span className="error">{errorText[fieldErrors.companyWebsite]}</span>
              )}
            </label>
          </>
        ) : null}

        {error && <p className="error">{error}</p>}
        <button type="submit">{t('auth.createAccount')}</button>
      </form>
      <p>
        {t('auth.haveAccount')} <Link to="/login" state={{ from }}>{t('auth.login')}</Link>
      </p>
    </div>
  );
}
