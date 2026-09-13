import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi, commerceApi, serviceRequestApi, appointmentApi } from '../../shared/api';
import { useAuth } from '../../app/AuthContext';
import { formatMoney, pickLocale } from '../../shared/locale';
import AddressFields from '../components/AddressFields';
import AppointmentCalendar from '../components/AppointmentCalendar';
import {
  compactProfilePayload,
  MIN_PASSWORD,
  profileFromUser,
  validateAccountForm,
} from '../../shared/accountValidation';

const TABS = ['orders', 'bookings', 'profile'];
const RECEIPT_STATUSES = ['Paid', 'Processing', 'Shipped', 'Delivered'];
const CANCELABLE = ['Submitted', 'Under Review', 'Scheduled'];
const RESCHEDULABLE = ['Submitted', 'Under Review'];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AccountPage() {
  const { t, i18n } = useTranslation();
  const { user, refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(profileFromUser(user));
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [rescheduleId, setRescheduleId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    const min = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 14));
    return new Date(Date.UTC(min.getUTCFullYear(), min.getUTCMonth(), 1));
  });
  const [availability, setAvailability] = useState(null);
  const lang = i18n.language;

  async function load() {
    const [orderData, bookingData] = await Promise.all([
      commerceApi.orders().catch(() => []),
      serviceRequestApi.mine().catch(() => []),
    ]);
    setOrders(orderData.items || orderData || []);
    setBookings(bookingData.items || bookingData || []);
  }

  useEffect(() => {
    if (!user) return;
    setProfile(profileFromUser(user));
    load().catch((e) => setError(e.message));
  }, [user]);

  useEffect(() => {
    if (!rescheduleId) return;
    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth();
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    appointmentApi
      .availability(`?from=${from}&to=${to}`)
      .then(setAvailability)
      .catch((e) => setError(e.message));
  }, [rescheduleId, monthDate]);

  const unavailableMap = useMemo(() => {
    const map = new Map();
    for (const item of availability?.unavailable || []) map.set(item.date, item);
    return map;
  }, [availability]);

  const errorText = {
    required: t('auth.errors.required'),
    email: t('auth.errors.email'),
    password: t('auth.errors.password', { min: MIN_PASSWORD }),
    url: t('auth.errors.url'),
  };

  async function saveProfile(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    const nextErrors = validateAccountForm(profile, { requirePassword: false });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      const updated = await authApi.updateMe(compactProfilePayload(profile));
      setProfile(profileFromUser(updated));
      await refresh();
      setMessage(t('account.saved'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await authApi.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', password: '' });
      setMessage(t('account.passwordUpdated'));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <h1>{t('account.title')}</h1>
      <div className="account-tabs">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            onClick={() => {
              setTab(id);
              setError('');
              setMessage('');
            }}
          >
            {t(`account.tabs.${id}`)}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p>{message}</p>}

      {tab === 'orders' && (
        <section className="panel">
          {orders.length ? (
            <div className="table-wrap">
              <table className="account-table">
                <thead>
                  <tr>
                    <th>{t('account.orderDate')}</th>
                    <th>{t('account.items')}</th>
                    <th>{t('account.total')}</th>
                    <th>{t('account.status')}</th>
                    <th>{t('account.receipt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        {(order.items || [])
                          .map((item) => `${item.quantity} × ${item.name}`)
                          .join(', ')}
                      </td>
                      <td>{formatMoney(order.total, lang)}</td>
                      <td>{order.status}</td>
                      <td>
                        {RECEIPT_STATUSES.includes(order.status) ? (
                          <button
                            type="button"
                            className="ghost"
                            onClick={() =>
                              commerceApi
                                .downloadReceipt(order._id, `${order.orderNumber}.pdf`)
                                .catch((e) => setError(e.message))
                            }
                          >
                            {t('account.downloadReceipt')}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">{t('account.noOrders')}</p>
          )}
        </section>
      )}

      {tab === 'bookings' && (
        <section className="panel">
          {bookings.length ? (
            <div className="table-wrap">
              <table className="account-table">
                <thead>
                  <tr>
                    <th>{t('account.service')}</th>
                    <th>{t('account.bookingDate')}</th>
                    <th>{t('account.status')}</th>
                    <th>{t('account.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const serviceName =
                      pickLocale(booking.offering, 'name', lang) || booking.title || t('nav.appointment');
                    return (
                      <tr key={booking._id}>
                        <td>{serviceName}</td>
                        <td>{formatDate(booking.preferredDate || booking.scheduledAt)}</td>
                        <td>{booking.status}</td>
                        <td>
                          <div className="row">
                            {RESCHEDULABLE.includes(booking.status) ? (
                              <button
                                type="button"
                                className="ghost"
                                onClick={() => {
                                  setRescheduleId(booking._id);
                                  setSelectedDate('');
                                }}
                              >
                                {t('account.reschedule')}
                              </button>
                            ) : null}
                            {CANCELABLE.includes(booking.status) ? (
                              <button
                                type="button"
                                className="ghost"
                                onClick={async () => {
                                  if (!window.confirm(t('account.confirmCancel'))) return;
                                  await serviceRequestApi.cancel(booking._id);
                                  await load();
                                }}
                              >
                                {t('account.cancel')}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">{t('account.noBookings')}</p>
          )}

          {rescheduleId ? (
            <div className="appointment-step-panel">
              <h2>{t('account.reschedule')}</h2>
              <AppointmentCalendar
                monthDate={monthDate}
                onMonthChange={setMonthDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                unavailableMap={unavailableMap}
                minBookableDate={availability?.minBookableDate}
              />
              <div className="row">
                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={async () => {
                    await serviceRequestApi.reschedule(rescheduleId, { preferredDate: selectedDate });
                    setRescheduleId(null);
                    await load();
                    setMessage(t('account.rescheduled'));
                  }}
                >
                  {t('account.saveDate')}
                </button>
                <button type="button" className="ghost" onClick={() => setRescheduleId(null)}>
                  {t('auth.continueBrowsing')}
                </button>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {tab === 'profile' && (
        <>
          <section className="panel">
            <h2>{t('account.profile')}</h2>
            <form className="form" onSubmit={saveProfile} noValidate>
              <div className="account-type-toggle span-2" role="group">
                {['personal', 'company'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={profile.accountType === type ? 'active' : ''}
                    onClick={() => setProfile((prev) => ({ ...prev, accountType: type }))}
                  >
                    {t(`auth.types.${type}`)}
                  </button>
                ))}
              </div>
              <label>
                {t('auth.firstName')}
                <input
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  required
                />
                {fieldErrors.firstName && <span className="error">{errorText[fieldErrors.firstName]}</span>}
              </label>
              <label>
                {t('auth.lastName')}
                <input
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  required
                />
                {fieldErrors.lastName && <span className="error">{errorText[fieldErrors.lastName]}</span>}
              </label>
              <label>
                {t('auth.email')}
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                />
                {fieldErrors.email && <span className="error">{errorText[fieldErrors.email]}</span>}
              </label>
              <label>
                {t('auth.phone')}
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  required
                />
              </label>
              <p className="section-copy span-2">{t('auth.primaryAddressOptional')}</p>
              <AddressFields
                value={profile.primaryAddress}
                onChange={(primaryAddress) => setProfile((prev) => ({ ...prev, primaryAddress }))}
              />
              {profile.accountType === 'company' ? (
                <>
                  <label className="span-2">
                    {t('auth.companyAddress')}
                    <textarea
                      value={profile.companyAddress}
                      onChange={(e) => setProfile({ ...profile, companyAddress: e.target.value })}
                      required
                    />
                  </label>
                  <label className="span-2">
                    {t('auth.companyWebsite')}
                    <input
                      type="url"
                      value={profile.companyWebsite}
                      onChange={(e) => setProfile({ ...profile, companyWebsite: e.target.value })}
                      required
                    />
                    {fieldErrors.companyWebsite && (
                      <span className="error">{errorText[fieldErrors.companyWebsite]}</span>
                    )}
                  </label>
                </>
              ) : null}
              <button type="submit">{t('account.save')}</button>
            </form>
          </section>

          <section className="panel">
            <h2>{t('account.changePassword')}</h2>
            <form className="form" onSubmit={savePassword}>
              <label>
                {t('account.currentPassword')}
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </label>
              <label>
                {t('auth.newPassword')}
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  minLength={MIN_PASSWORD}
                  required
                />
              </label>
              <button type="submit">{t('account.updatePassword')}</button>
            </form>
          </section>

          <button
            type="button"
            className="ghost"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            {t('nav.logout')}
          </button>
        </>
      )}
    </div>
  );
}
