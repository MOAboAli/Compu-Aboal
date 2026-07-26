import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../shared/api';
import DataTable from '../components/DataTable';

const statuses = [
  'Pending',
  'Paid',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  async function load() {
    const data = await adminApi.orders();
    setOrders(data.items || data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      { key: 'orderNumber', label: 'Order #' },
      {
        key: 'total',
        label: 'Total',
        render: (o) => `$${Number(o.total).toFixed(2)}`,
        searchValue: (o) => String(o.total),
      },
      {
        key: 'status',
        label: 'Status',
        className: 'select-cell',
        searchValue: (o) => o.status,
        render: (o) => (
          <select
            value={o.status}
            onChange={async (e) => {
              await adminApi.updateOrder(o._id, { status: e.target.value });
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
      <h1>Orders</h1>
      <DataTable columns={columns} rows={orders} emptyMessage="No orders yet." />
    </div>
  );
}
