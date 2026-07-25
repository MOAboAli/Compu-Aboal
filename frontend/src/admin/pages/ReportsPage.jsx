import { useEffect, useState } from 'react';
import { adminApi } from '../../shared/api';

export default function AdminReportsPage() {
  const [sales, setSales] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi.reports('sales').then(setSales).catch((e) => setMessage(e.message));
  }, []);

  return (
    <div className="stack">
      <h1>Reports</h1>
      <pre className="code">{JSON.stringify(sales, null, 2)}</pre>
      <div className="actions">
        {['csv', 'xlsx', 'pdf'].map((format) => (
          <button
            key={format}
            type="button"
            onClick={async () => {
              const res = await adminApi.exportReport('sales', format);
              setMessage(res.message || `Export ${format} ready (simulated/download URL)`);
            }}
          >
            Export {format.toUpperCase()}
          </button>
        ))}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export function AdminAuditPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    adminApi.audit().then((d) => setRows(d.items || d)).catch(() => {});
  }, []);
  return (
    <div className="stack">
      <h1>Audit log</h1>
      <ul className="list">
        {rows.map((r) => (
          <li key={r._id}>
            <span>
              {new Date(r.createdAt).toLocaleString()} · {r.action} · {r.module} ·{' '}
              {r.success === false ? 'fail' : 'ok'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminBackupsPage() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  async function load() {
    const data = await adminApi.backups();
    setRows(data.items || data);
  }
  useEffect(() => {
    load().catch(() => {});
  }, []);
  return (
    <div className="stack">
      <h1>Backups</h1>
      <button
        type="button"
        onClick={async () => {
          const job = await adminApi.runBackup();
          setMessage(`Backup ${job._id || 'created'} (simulated ZIP)`);
          await load();
        }}
      >
        Run backup now
      </button>
      {message && <p>{message}</p>}
      <ul className="list">
        {rows.map((b) => (
          <li key={b._id}>
            <span>
              {b.fileName || b._id} · {b.status}
            </span>
            <button
              type="button"
              className="ghost"
              onClick={async () => {
                await adminApi.restoreBackup(b._id);
                setMessage('Restore simulated');
              }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminPaymentsPage() {
  const [methods, setMethods] = useState([]);
  useEffect(() => {
    adminApi.paymentMethodsAdmin().then((d) => setMethods(d.items || d)).catch(() => {});
  }, []);
  return (
    <div className="stack">
      <h1>Payment methods</h1>
      <ul className="list">
        {methods.map((m) => (
          <li key={m._id}>
            <span>
              {m.name} ({m.code}) · {m.active === false ? 'inactive' : 'active'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
