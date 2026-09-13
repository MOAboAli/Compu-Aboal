import { useEffect, useMemo, useState } from 'react';
import { adminApi, catalogApi } from '../../shared/api';
import DataTable from '../components/DataTable';

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

  const columns = useMemo(
    () => [
      {
        key: 'requestNumber',
        label: 'Reference',
        render: (r) => r.requestNumber || r._id,
        searchValue: (r) => `${r.requestNumber || ''} ${r._id}`,
      },
      { key: 'type', label: 'Type' },
      {
        key: 'preferredDate',
        label: 'Date',
        render: (r) => (r.preferredDate ? String(r.preferredDate).slice(0, 10) : '—'),
        searchValue: (r) => (r.preferredDate ? String(r.preferredDate).slice(0, 10) : ''),
      },
      {
        key: 'status',
        label: 'Status',
        className: 'select-cell',
        searchValue: (r) => r.status,
        render: (r) => (
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
        ),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Service requests</h1>
      <DataTable columns={columns} rows={items} emptyMessage="No service requests yet." />
    </div>
  );
}

export function AdminServicesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    catalogApi
      .serviceOfferings()
      .then((d) => setItems(d.items || d))
      .catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      {
        key: 'basePrice',
        label: 'Starts from',
        render: (s) => (s.basePrice != null ? `$${Number(s.basePrice).toFixed(2)}` : '—'),
        searchValue: (s) => String(s.basePrice ?? ''),
      },
      {
        key: 'status',
        label: 'Status',
        render: (s) => (s.active === false || s.status === 'inactive' ? 'Inactive' : 'Active'),
        searchValue: (s) =>
          s.active === false || s.status === 'inactive' ? 'inactive' : 'active',
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Service offerings</h1>
      <DataTable columns={columns} rows={items} emptyMessage="No service offerings yet." />
    </div>
  );
}
