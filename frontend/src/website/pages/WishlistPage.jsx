import { useEffect, useState } from 'react';
import { commerceApi } from '../../shared/api';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    const data = await commerceApi.wishlist();
    setItems(data.items || data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  return (
    <div className="stack">
      <h1>Wishlist</h1>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {items.map((item) => (
          <li key={item._id || item.productId}>
            <span>{item.name || item.product?.name}</span>
            <button
              type="button"
              className="ghost"
              onClick={async () => {
                await commerceApi.removeWishlist(item.productId || item._id);
                await load();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
