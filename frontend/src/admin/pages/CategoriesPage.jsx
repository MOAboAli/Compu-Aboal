import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../shared/api';
import DataTable from '../components/DataTable';

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

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      {
        key: 'status',
        label: 'Status',
        render: (c) => (c.status === 'inactive' ? 'Inactive' : 'Active'),
      },
      {
        key: 'actions',
        label: 'Actions',
        className: 'actions-cell',
        searchValue: () => '',
        render: (c) => (
          <button
            type="button"
            className="btn-success"
            onClick={async () => {
              await adminApi.saveCategory(c._id, {
                status: c.status === 'inactive' ? 'active' : 'inactive',
              });
              await load();
            }}
          >
            Toggle
          </button>
        ),
      },
    ],
    []
  );

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
      <DataTable columns={columns} rows={items} emptyMessage="No categories yet." />
    </div>
  );
}
