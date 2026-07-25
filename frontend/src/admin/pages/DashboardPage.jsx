import { useEffect, useState } from 'react';
import { adminApi } from '../../shared/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    adminApi.dashboard().then(setData).catch(() => setData({}));
  }, []);
  return (
    <div className="stack">
      <h1>Dashboard</h1>
      <div className="grid-cards">
        <div className="card-link">
          <strong>Orders</strong>
          <span>{data?.orders ?? '—'}</span>
        </div>
        <div className="card-link">
          <strong>Products</strong>
          <span>{data?.products ?? '—'}</span>
        </div>
        <div className="card-link">
          <strong>Users</strong>
          <span>{data?.users ?? '—'}</span>
        </div>
        <div className="card-link">
          <strong>Service requests</strong>
          <span>{data?.serviceRequests ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
