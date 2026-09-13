import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../shared/api';
import DataTable from '../components/DataTable';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    shortDescription: '',
  });

  async function load() {
    const [p, c] = await Promise.all([adminApi.products(), adminApi.categories()]);
    setProducts(p.items || p);
    setCategories(c.items || c);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'sku', label: 'SKU' },
      {
        key: 'price',
        label: 'Price',
        render: (p) => `$${Number(p.price).toFixed(2)}`,
        searchValue: (p) => String(p.price),
      },
      { key: 'stock', label: 'Stock' },
      {
        key: 'actions',
        label: 'Actions',
        className: 'actions-cell',
        searchValue: () => '',
        render: (p) => (
          <button
            type="button"
            className="btn-danger"
            onClick={async () => {
              await adminApi.deleteProduct(p._id);
              await load();
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Products</h1>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await adminApi.saveProduct(null, {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            status: 'active',
          });
          setForm({
            name: '',
            sku: '',
            price: '',
            stock: '',
            category: '',
            shortDescription: '',
          });
          await load();
        }}
      >
        <div className="row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Short description"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
        />
        <button type="submit">Add product</button>
      </form>
      <DataTable columns={columns} rows={products} emptyMessage="No products yet." />
    </div>
  );
}
