import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import FeatureCard, { productImage } from '../components/FeatureCard';
import { pickLocale } from '../../shared/locale';

export default function ShopPage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const lang = i18n.language;

  async function load() {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    const [p, c] = await Promise.all([
      catalogApi.products(`?${params.toString()}`),
      catalogApi.categories(),
    ]);
    setProducts(p.items || p);
    setCategories(c.items || c);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  return (
    <div className="stack page-shell">
      <h1>{t('shop.title')}</h1>
      <div className="filters">
        <input
          placeholder={t('shop.search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{t('shop.allCategories')}</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {pickLocale(c, 'name', lang)}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => load().catch((e) => setError(e.message))}>
          {t('shop.filters')}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="feature-grid">
        {products.map((p) => {
          const hasSale = p.discountPrice != null && p.discountPrice < p.price;
          return (
            <FeatureCard
              key={p._id}
              to={`/shop/${p._id}`}
              image={productImage(p)}
              badge={hasSale ? t('home.saleBadge') : p.featured ? t('home.featuredBadge') : null}
              badgeTone={hasSale ? 'sale' : 'blue'}
              title={pickLocale(p, 'name', lang)}
              subtitle={pickLocale(p.category, 'name', lang)}
              description={pickLocale(p, 'shortDescription', lang)}
              price={hasSale ? p.discountPrice : p.price}
              compareAtPrice={hasSale ? p.price : null}
              ctaLabel={t('home.viewProduct')}
              ctaTo={`/shop/${p._id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
