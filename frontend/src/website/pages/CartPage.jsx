import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { commerceApi } from '../../shared/api';
import { formatMoney } from '../../shared/locale';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function load() {
    const data = await commerceApi.getCart();
    setCart(data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  if (!cart) return <p className="page-shell">{error || t('shop.loading')}</p>;

  const total = (cart.items || []).reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="stack">
      <h1>{t('nav.cart')}</h1>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {(cart.items || []).map((item) => (
          <li key={item._id || item.productId}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatMoney(Number(item.price) * Number(item.quantity), i18n.language)}</span>
            <button
              type="button"
              className="ghost"
              onClick={async () => {
                await commerceApi.removeCartItem(item.productId || item._id);
                await load();
              }}
            >
              {t('cart.remove')}
            </button>
          </li>
        ))}
      </ul>
      {!cart.items?.length ? <p className="muted">{t('cart.empty')}</p> : null}
      <p>
        <strong>
          {t('account.total')}: {formatMoney(total, i18n.language)}
        </strong>
      </p>
      <button
        type="button"
        disabled={!cart.items?.length}
        onClick={async () => {
          try {
            const order = await commerceApi.checkout({});
            navigate(`/checkout/pay/${order._id}`);
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        {t('checkout.title')}
      </button>
      <Link to="/shop">{t('shop.backToShop')}</Link>
    </div>
  );
}
