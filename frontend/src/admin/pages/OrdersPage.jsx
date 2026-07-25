import { useEffect, useState } from 'react';
import { adminApi } from '../../shared/api';

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

  return (
    <div className="stack">
      <h1>Orders</h1>
      <ul className="list">
        {orders.map((o) => (
          <li key={o._id}>
            <span>
              {o.orderNumber} · ${Number(o.total).toFixed(2)} · {o.status}
            </span>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
