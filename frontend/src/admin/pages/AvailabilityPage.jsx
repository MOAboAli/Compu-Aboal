import { useEffect, useMemo, useState } from 'react';
import { appointmentApi } from '../../shared/api';
import DataTable from '../components/DataTable';

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const emptyForm = {
  mode: 'date',
  date: '',
  weekday: '0',
  type: 'unavailable',
  reason: '',
};

export default function AvailabilityPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
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
      const payload = {
        type: form.type,
        reason: form.reason,
        ...(form.mode === 'weekday'
          ? { weekday: Number(form.weekday) }
          : { date: form.date }),
      };
      await appointmentApi.createBlocked(payload);
      setForm({ ...emptyForm, mode: form.mode });
      setMessage(
        form.mode === 'weekday'
          ? 'Weekday blocked for all future bookings'
          : 'Date marked unavailable'
      );
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
        key: 'scope',
        label: 'Scope',
        render: (item) =>
          item.kind === 'weekday'
            ? `Every ${item.weekdayLabel || WEEKDAYS[item.weekday]?.label || item.weekday}`
            : String(item.date).slice(0, 10),
        searchValue: (item) =>
          item.kind === 'weekday'
            ? `every ${item.weekdayLabel || ''} ${item.weekday}`
            : String(item.date).slice(0, 10),
      },
      {
        key: 'kind',
        label: 'Kind',
        render: (item) => (item.kind === 'weekday' ? 'Weekly' : 'Specific date'),
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
        Block a specific date, or a weekday for all time (for example every Sunday). Bookings must be
        at least 14 days ahead, and booked dates are automatically blocked.
      </p>

      <form className="form panel" onSubmit={submit}>
        <label>
          Block type
          <select
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value })}
          >
            <option value="date">Specific date</option>
            <option value="weekday">Every weekday</option>
          </select>
        </label>
        {form.mode === 'date' ? (
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>
        ) : (
          <label>
            Weekday
            <select
              value={form.weekday}
              onChange={(e) => setForm({ ...form, weekday: e.target.value })}
              required
            >
              {WEEKDAYS.map((day) => (
                <option key={day.value} value={day.value}>
                  Every {day.label}
                </option>
              ))}
            </select>
          </label>
        )}
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
        <button type="submit">
          {form.mode === 'weekday' ? 'Block weekday' : 'Block date'}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="panel">
        <h2>Blocked dates & weekdays</h2>
        <DataTable columns={columns} rows={items} emptyMessage="No blocked dates yet." />
      </div>
    </div>
  );
}
