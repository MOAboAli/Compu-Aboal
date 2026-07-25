import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function ShopPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

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
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => load().catch((e) => setError(e.message))}>
          {t('shop.filters')}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid-cards">
        {products.map((p) => (
          <div key={p._id} className="card-link">
            <Link to={`/shop/${p._id}`}>
              <strong>{p.name}</strong>
            </Link>
            <span>${Number(p.discountPrice ?? p.price).toFixed(2)}</span>
            <span>Stock: {p.stock}</span>
            <Link className="cta-appointment" to="/services">
              {t('nav.appointment')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
