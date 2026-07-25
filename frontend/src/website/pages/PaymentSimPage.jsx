import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { commerceApi } from '../../shared/api';

export default function PaymentSimPage() {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [method, setMethod] = useState('');
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([commerceApi.paymentMethods(), commerceApi.order(orderId)])
      .then(([m, o]) => {
        const list = m.items || m;
        setMethods(list);
        setMethod(list[0]?.code || 'visa');
        setOrder(o);
      })
      .catch((e) => setError(e.message));
  }, [orderId]);

  async function pay() {
    setBusy(true);
    setError('');
    try {
      const paid = await commerceApi.pay(orderId, { method });
      navigate(`/checkout/success/${paid._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack narrow">
      <h1>{t('checkout.title')}</h1>
      <p>Order {order?.orderNumber || orderId}</p>
      <p>Amount: ${Number(order?.total || 0).toFixed(2)}</p>
      <label>
        Payment method (simulated)
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {methods.map((m) => (
            <option key={m._id || m.code} value={m.code}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      <p className="muted">
        This is a simulated payment gateway. Clicking pay marks the order as Paid and returns
        confirmation.
      </p>
      {error && <p className="error">{error}</p>}
      <button type="button" disabled={busy} onClick={pay}>
        {busy ? t('checkout.paying') : t('checkout.pay')}
      </button>
      <Link to="/cart">Back to cart</Link>
    </div>
  );
}
