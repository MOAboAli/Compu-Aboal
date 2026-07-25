import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi, commerceApi } from '../../shared/api';
import { useAuth } from '../../app/AuthContext';

export default function ShopPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  async function addCart(productId) {
    if (!user) {
      setError('Please login first');
      return;
    }
    await commerceApi.addToCart({ productId, quantity: 1 });
  }

  async function addWish(productId) {
    if (!user) {
      setError('Please login first');
      return;
    }
    await commerceApi.addWishlist({ productId });
  }

  return (
    <div className="stack">
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
            <div className="actions">
              <button type="button" onClick={() => addCart(p._id)}>
                {t('shop.addToCart')}
              </button>
              <button type="button" className="ghost" onClick={() => addWish(p._id)}>
                {t('shop.wishlist')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
