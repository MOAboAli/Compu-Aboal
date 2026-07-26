import { useEffect, useMemo, useState } from 'react';
import { appointmentApi } from '../../shared/api';
import DataTable from '../components/DataTable';

export default function AvailabilityPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ date: '', type: 'unavailable', reason: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const data = await appointmentApi.listBlocked();
    setItems(Array.isArray(data) ? data : data.items || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await appointmentApi.createBlocked(form);
      setForm({ date: '', type: 'unavailable', reason: '' });
      setMessage('Date marked unavailable');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await appointmentApi.deleteBlocked(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = useMemo(
    () => [
      {
        key: 'date',
        label: 'Date',
        render: (item) => String(item.date).slice(0, 10),
        searchValue: (item) => String(item.date).slice(0, 10),
      },
      { key: 'type', label: 'Type' },
      {
        key: 'reason',
        label: 'Reason',
        render: (item) => item.reason || '—',
      },
      {
        key: 'actions',
        label: 'Actions',
        className: 'actions-cell',
        searchValue: () => '',
        render: (item) => (
          <button type="button" className="btn-danger" onClick={() => remove(item._id)}>
            Remove
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="stack">
      <h1>Appointment availability</h1>
      <p className="muted">
        Mark holidays or unavailable days. Bookings must be at least 14 days ahead, and booked dates
        are automatically blocked.
      </p>

      <form className="form panel" onSubmit={submit}>
        <label>
          Date
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>
        <label>
          Type
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="unavailable">Unavailable</option>
            <option value="holiday">Holiday</option>
          </select>
        </label>
        <label>
          Reason
          <input
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Optional note"
          />
        </label>
        <button type="submit">Block date</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="panel">
        <h2>Blocked dates</h2>
        <DataTable columns={columns} rows={items} emptyMessage="No blocked dates yet." />
      </div>
    </div>
  );
}
