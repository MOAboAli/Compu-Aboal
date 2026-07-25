import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../shared/api';

const statuses = [
  'Submitted',
  'Under Review',
  'Scheduled',
  'In Progress',
  'Completed',
  'Closed',
];

export default function AdminRequestsPage() {
  const [items, setItems] = useState([]);
  async function load() {
    const data = await adminApi.serviceRequests();
    setItems(data.items || data);
  }
  useEffect(() => {
    load().catch(() => {});
  }, []);
  return (
    <div className="stack">
      <h1>Service requests</h1>
      <ul className="list">
        {items.map((r) => (
          <li key={r._id}>
            <span>
              {r.type} · {r.status}
            </span>
            <select
              value={r.status}
              onChange={async (e) => {
                await adminApi.updateServiceRequest(r._id, { status: e.target.value });
                await load();
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminServicesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    catalogApi.serviceOfferings().then((d) => setItems(d.items || d)).catch(() => {});
  }, []);
  return (
    <div className="stack">
      <h1>Service offerings</h1>
      <ul className="list">
        {items.map((s) => (
          <li key={s._id}>
            <span>
              {s.name} · {s.active === false ? 'inactive' : 'active'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
