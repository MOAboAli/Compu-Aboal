import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi, commerceApi } from '../../shared/api';
import { productImage } from '../components/FeatureCard';
import { formatMoney, pickLocale } from '../../shared/locale';
import { useAuth } from '../../app/AuthContext';
import AuthPrompt from '../components/AuthPrompt';

export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [prompt, setPrompt] = useState(false);
  const lang = i18n.language;

  useEffect(() => {
    catalogApi
      .product(id)
      .then((data) => {
        setProduct(data);
        setImgSrc(productImage(data));
      })
      .catch((e) => setMessage(e.message));
  }, [id]);

  if (!product) return <p className="page-shell">{message || t('shop.loading')}</p>;

  const hasSale = product.discountPrice != null && product.discountPrice < product.price;
  const price = hasSale ? product.discountPrice : product.price;

  return (
    <div className="page-shell product-detail">
      <div className="product-detail-media">
        {hasSale ? (
          <span className="feature-badge feature-badge-sale">{t('home.saleBadge')}</span>
        ) : product.featured ? (
          <span className="feature-badge feature-badge-blue">{t('home.featuredBadge')}</span>
        ) : null}
        <img
          src={imgSrc}
          alt={pickLocale(product, 'name', lang)}
          onError={() =>
            setImgSrc(
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            )
          }
        />
      </div>
      <div className="product-detail-body">
        {product.category ? (
          <p className="feature-card-brand">{pickLocale(product.category, 'name', lang)}</p>
        ) : null}
        <h1>{pickLocale(product, 'name', lang)}</h1>
        <p className="feature-card-price">
          <span>{formatMoney(price, lang)}</span>
          {hasSale ? <s>{formatMoney(product.price, lang)}</s> : null}
        </p>
        {pickLocale(product, 'shortDescription', lang) ? (
          <p className="section-copy">{pickLocale(product, 'shortDescription', lang)}</p>
        ) : null}
        {pickLocale(product, 'detailedDescription', lang) ? (
          <p className="section-copy">{pickLocale(product, 'detailedDescription', lang)}</p>
        ) : null}
        <p className="muted">
          SKU {product.sku}
          {product.stock != null ? ` · ${t('shop.stock')}: ${product.stock}` : ''}
        </p>
        <div className="product-detail-actions">
          <button
            type="button"
            className="feature-card-cta"
            onClick={async () => {
              if (!user) {
                setPrompt(true);
                return;
              }
              try {
                await commerceApi.addToCart({ productId: product._id, quantity: 1 });
                setMessage(t('shop.addedToCart'));
              } catch (err) {
                setMessage(err.message);
              }
            }}
          >
            {t('shop.addToCart')}
          </button>
          <Link className="btn ghost" to="/shop">
            {t('shop.backToShop')}
          </Link>
        </div>
        {message ? <p className={message === t('shop.addedToCart') ? '' : 'error'}>{message}</p> : null}
        <AuthPrompt open={prompt} onClose={() => setPrompt(false)} from={location.pathname} />
      </div>
    </div>
  );
}
