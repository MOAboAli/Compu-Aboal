import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../shared/api';
import DataTable from '../components/DataTable';

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
    adminApi
      .audit()
      .then((d) => setRows(d.items || d))
      .catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        label: 'When',
        render: (r) => new Date(r.createdAt).toLocaleString(),
        searchValue: (r) => new Date(r.createdAt).toLocaleString(),
      },
      { key: 'action', label: 'Action' },
      { key: 'module', label: 'Module' },
      {
        key: 'result',
        label: 'Result',
        render: (r) => (r.success === false ? 'Fail' : 'OK'),
        searchValue: (r) => (r.success === false ? 'fail' : 'ok'),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Audit log</h1>
      <DataTable columns={columns} rows={rows} emptyMessage="No audit entries yet." />
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

  const columns = useMemo(
    () => [
      {
        key: 'fileName',
        label: 'File',
        render: (b) => b.fileName || b._id,
        searchValue: (b) => `${b.fileName || ''} ${b._id}`,
      },
      { key: 'status', label: 'Status' },
      {
        key: 'actions',
        label: 'Actions',
        className: 'actions-cell',
        searchValue: () => '',
        render: (b) => (
          <button
            type="button"
            className="btn"
            onClick={async () => {
              await adminApi.restoreBackup(b._id);
              setMessage('Restore simulated');
            }}
          >
            Restore
          </button>
        ),
      },
    ],
    []
  );

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
      <DataTable columns={columns} rows={rows} emptyMessage="No backups yet." />
    </div>
  );
}

export function AdminPaymentsPage() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    adminApi
      .paymentMethodsAdmin()
      .then((d) => setMethods(d.items || d))
      .catch(() => {});
  }, []);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'code', label: 'Code' },
      {
        key: 'status',
        label: 'Status',
        render: (m) => (m.active === false ? 'Inactive' : 'Active'),
        searchValue: (m) => (m.active === false ? 'inactive' : 'active'),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Payment methods</h1>
      <DataTable columns={columns} rows={methods} emptyMessage="No payment methods yet." />
    </div>
  );
}
