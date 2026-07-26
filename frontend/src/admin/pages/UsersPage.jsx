import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../shared/api';
import DataTable from '../components/DataTable';

const roles = [
  'super_admin',
  'admin',
  'service_manager',
  'sales_manager',
  'customer_support',
  'customer',
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });
  const [error, setError] = useState('');

  async function load() {
    const data = await adminApi.users();
    setUsers(data.items || data);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      {
        key: 'status',
        label: 'Status',
        render: (u) => (u.isActive === false ? 'Inactive' : 'Active'),
        searchValue: (u) => (u.isActive === false ? 'inactive' : 'active'),
      },
      {
        key: 'actions',
        label: 'Actions',
        className: 'actions-cell',
        searchValue: () => '',
        render: (u) => (
          <button
            type="button"
            className="btn-success"
            onClick={async () => {
              await adminApi.updateUser(u._id, { isActive: u.isActive === false });
              await load();
            }}
          >
            Toggle active
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Users</h1>
      {error && <p className="error">{error}</p>}
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await adminApi.createUser(form);
          setForm({ name: '', email: '', phone: '', password: '', role: 'customer' });
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
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button type="submit">Create</button>
        </div>
      </form>
      <DataTable columns={columns} rows={users} emptyMessage="No users yet." />
    </div>
  );
}
