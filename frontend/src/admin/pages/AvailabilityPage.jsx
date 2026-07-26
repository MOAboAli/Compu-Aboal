import { useEffect, useState } from 'react';
import { appointmentApi } from '../../shared/api';

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
        <ul className="list">
          {items.map((item) => (
            <li key={item._id}>
              <span>
                {String(item.date).slice(0, 10)} · {item.type}
                {item.reason ? ` · ${item.reason}` : ''}
              </span>
              <button type="button" className="linkish" onClick={() => remove(item._id)}>
                Remove
              </button>
            </li>
          ))}
          {!items.length ? <li className="muted">No blocked dates yet.</li> : null}
        </ul>
      </div>
    </div>
  );
}
