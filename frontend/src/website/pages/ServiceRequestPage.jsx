import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceRequestApi } from '../../shared/api';

export default function ServiceRequestPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const isSurvey = type === 'site-survey';
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    contactPhone: '',
    buildingType: '',
    floors: '',
    infrastructure: '',
    deviceType: '',
    serialNumber: '',
    issue: '',
    preferredDate: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  function setField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const created = await serviceRequestApi.create({
        type: isSurvey ? 'site_survey' : 'maintenance',
        ...form,
        floors: form.floors ? Number(form.floors) : undefined,
      });
      setDone(created);
    } catch (err) {
      setError(err.message);
    }
  }

  if (done) {
    return (
      <div className="stack narrow page-shell">
        <h1>Request submitted</h1>
        <p>Reference: {done.requestNumber || done._id}</p>
        <p>We will contact you soon. No customer account is required.</p>
        <button type="button" onClick={() => navigate('/services')}>
          Back to services
        </button>
      </div>
    );
  }

  return (
    <div className="stack narrow page-shell">
      <h1>{isSurvey ? 'Site survey request' : 'Maintenance request'}</h1>
      <form className="form" onSubmit={submit}>
        <label>
          Full name
          <input name="name" value={form.name} onChange={setField} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={setField} required />
        </label>
        <label>
          Phone
          <input name="contactPhone" value={form.contactPhone} onChange={setField} required />
        </label>
        {isSurvey ? (
          <>
            <label>
              Site address
              <input name="address" value={form.address} onChange={setField} required />
            </label>
            <label>
              Building type
              <input name="buildingType" value={form.buildingType} onChange={setField} />
            </label>
            <label>
              Floors
              <input name="floors" type="number" value={form.floors} onChange={setField} />
            </label>
            <label>
              Existing infrastructure
              <textarea name="infrastructure" value={form.infrastructure} onChange={setField} />
            </label>
          </>
        ) : (
          <>
            <label>
              Device type
              <input name="deviceType" value={form.deviceType} onChange={setField} required />
            </label>
            <label>
              Serial number
              <input name="serialNumber" value={form.serialNumber} onChange={setField} />
            </label>
            <label>
              Issue description
              <textarea name="issue" value={form.issue} onChange={setField} required />
            </label>
            <label>
              Preferred service date
              <input
                name="preferredDate"
                type="date"
                value={form.preferredDate}
                onChange={setField}
              />
            </label>
          </>
        )}
        <label>
          Additional notes
          <textarea name="description" value={form.description} onChange={setField} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit request</button>
      </form>
    </div>
  );
}
