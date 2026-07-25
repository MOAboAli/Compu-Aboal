import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { commerceApi, serviceRequestApi, authApi } from '../../shared/api';
import { useAuth } from '../../app/AuthContext';

export default function AccountPage() {
  const { t } = useTranslation();
  const { user, refresh } = useAuth();
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setProfile({ name: user.name || '', phone: user.phone || '', email: user.email || '' });
    commerceApi.orders().then((d) => setOrders(d.items || d)).catch(() => {});
    serviceRequestApi.mine().then((d) => setRequests(d.items || d)).catch(() => {});
  }, [user]);

  return (
    <div className="stack">
      <h1>{t('nav.account')}</h1>
      <section className="panel">
        <h2>{t('account.profile')}</h2>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            await authApi.verify?.({}); // no-op if missing
            setMessage('Profile loaded from account. Update via admin or future profile API.');
            await refresh();
          }}
        >
          <label>
            Name
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input value={profile.email} disabled />
          </label>
          <label>
            Phone
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </label>
          <button type="submit">Refresh</button>
        </form>
        {message && <p>{message}</p>}
      </section>

      <section className="panel">
        <h2>{t('account.orders')}</h2>
        <ul className="list">
          {orders.map((o) => (
            <li key={o._id}>
              <span>
                {o.orderNumber} · {o.status} · ${Number(o.total).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>{t('account.requests')}</h2>
        <ul className="list">
          {requests.map((r) => (
            <li key={r._id}>
              <span>
                {r.type} · {r.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
