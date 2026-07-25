import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function ProductPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    catalogApi.product(id).then(setProduct).catch((e) => setMessage(e.message));
  }, [id]);

  if (!product) return <p className="page-shell">{message || 'Loading...'}</p>;

  return (
    <div className="stack page-shell">
      <h1>{product.name}</h1>
      <p>{product.shortDescription}</p>
      <p>{product.detailedDescription}</p>
      <p>
        ${Number(product.discountPrice ?? product.price).toFixed(2)} · SKU {product.sku}
      </p>
      <Link className="cta-appointment" to="/services">
        {t('nav.appointment')}
      </Link>
      {message && <p>{message}</p>}
    </div>
  );
}
