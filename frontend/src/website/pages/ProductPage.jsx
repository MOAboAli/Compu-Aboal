import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { catalogApi, commerceApi } from '../../shared/api';
import { useAuth } from '../../app/AuthContext';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    catalogApi.product(id).then(setProduct).catch((e) => setMessage(e.message));
  }, [id]);

  if (!product) return <p>{message || 'Loading...'}</p>;

  return (
    <div className="stack">
      <h1>{product.name}</h1>
      <p>{product.shortDescription}</p>
      <p>{product.detailedDescription}</p>
      <p>
        ${Number(product.discountPrice ?? product.price).toFixed(2)} · SKU {product.sku}
      </p>
      <button
        type="button"
        onClick={async () => {
          if (!user) return setMessage('Login required');
          await commerceApi.addToCart({ productId: product._id, quantity: 1 });
          setMessage('Added to cart');
        }}
      >
        Add to cart
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
