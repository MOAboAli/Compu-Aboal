import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { commerceApi } from '../../shared/api';

export default function CartPage() {
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

  if (!cart) return <p>{error || 'Loading cart...'}</p>;

  const total = (cart.items || []).reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="stack">
      <h1>Cart</h1>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {(cart.items || []).map((item) => (
          <li key={item._id || item.productId}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
            <button
              type="button"
              className="ghost"
              onClick={async () => {
                await commerceApi.removeCartItem(item.productId || item._id);
                await load();
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total: ${total.toFixed(2)}</strong>
      </p>
      <button
        type="button"
        disabled={!cart.items?.length}
        onClick={async () => {
          const order = await commerceApi.checkout({});
          navigate(`/checkout/pay/${order._id}`);
        }}
      >
        Checkout
      </button>
      <Link to="/shop">Continue shopping</Link>
    </div>
  );
}
