import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, getProducts } from './api';

const emptyForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  description: '',
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
      });
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="brand">Compu-Aboali</p>
        <h1>Computer store inventory</h1>
        <p className="lede">
          Track products, stock, and pricing from one simple React + Node stack.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Add product</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input name="name" value={form.name} onChange={updateField} required />
            </label>
            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={updateField}
                placeholder="Laptop, GPU, Monitor..."
                required
              />
            </label>
            <div className="row">
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={updateField}
                  required
                />
              </label>
              <label>
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={updateField}
                  required
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="3"
              />
            </label>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Add product'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Inventory</h2>
            <button type="button" className="ghost" onClick={loadProducts}>
              Refresh
            </button>
          </div>

          {error && <p className="error">{error}</p>}
          {loading ? (
            <p className="muted">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="muted">No products yet. Add the first one.</p>
          ) : (
            <ul className="product-list">
              {products.map((product) => (
                <li key={product._id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.category} | $
                      {Number(product.price).toFixed(2)} | stock {product.stock}
                    </span>
                    {product.description && <p>{product.description}</p>}
                  </div>
                  <button type="button" className="danger" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
