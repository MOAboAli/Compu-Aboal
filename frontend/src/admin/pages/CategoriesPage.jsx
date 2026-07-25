import { useEffect, useState } from 'react';
import { adminApi } from '../../shared/api';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');

  async function load() {
    const data = await adminApi.categories();
    setItems(data.items || data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <div className="stack">
      <h1>Categories</h1>
      <form
        className="form row"
        onSubmit={async (e) => {
          e.preventDefault();
          await adminApi.saveCategory(null, {
            name,
            parent: parent || null,
            status: 'active',
          });
          setName('');
          setParent('');
          await load();
        }}
      >
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={parent} onChange={(e) => setParent(e.target.value)}>
          <option value="">No parent</option>
          {items.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {items.map((c) => (
          <li key={c._id}>
            <span>
              {c.name} {c.status === 'inactive' ? '(inactive)' : ''}
            </span>
            <button
              type="button"
              className="ghost"
              onClick={async () => {
                await adminApi.saveCategory(c._id, {
                  status: c.status === 'inactive' ? 'active' : 'inactive',
                });
                await load();
              }}
            >
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
