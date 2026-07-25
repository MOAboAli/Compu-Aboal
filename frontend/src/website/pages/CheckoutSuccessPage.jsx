import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CheckoutSuccessPage() {
  const { orderId } = useParams();
  const { t } = useTranslation();
  return (
    <div className="stack narrow">
      <h1>{t('checkout.success')}</h1>
      <p>Order reference: {orderId}</p>
      <p>Email and SMS confirmation were simulated and stored in notifications.</p>
      <Link className="btn" to="/account">
        {t('checkout.backToOrders')}
      </Link>
    </div>
  );
}
