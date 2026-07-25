import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi, serviceRequestApi } from '../../shared/api';
import { pickLocale } from '../../shared/locale';

export default function ServiceRequestPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const lang = i18n.language;

  useEffect(() => {
    setLoading(true);
    catalogApi
      .serviceOffering(serviceId)
      .then(setService)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [serviceId]);

  function setField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!service) return;
    setError('');
    try {
      const created = await serviceRequestApi.create({
        offering: service._id,
        type: service.type,
        ...form,
        floors: form.floors ? Number(form.floors) : undefined,
      });
      setDone(created);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="page-shell">{t('services.loading')}</p>;
  }

  if (!service) {
    return (
      <div className="stack narrow page-shell">
        <h1>{t('services.notFound')}</h1>
        <p className="error">{error || t('services.chooseFirst')}</p>
        <Link className="cta-appointment" to="/services">
          {t('services.backToServices')}
        </Link>
      </div>
    );
  }

  const isSurvey = service.type === 'site_survey';
  const isMaintenance = service.type === 'maintenance';

  if (done) {
    return (
      <div className="stack narrow page-shell">
        <h1>{t('services.submittedTitle')}</h1>
        <p>
          {t('services.submittedRef')}: {done.requestNumber || done._id}
        </p>
        <p>{t('services.submittedNote')}</p>
        <button type="button" onClick={() => navigate('/services')}>
          {t('services.backToServices')}
        </button>
      </div>
    );
  }

  const serviceName = pickLocale(service, 'name', lang);

  return (
    <div className="stack narrow page-shell">
      <p className="muted">
        <Link to="/services">{t('services.title')}</Link> / {serviceName}
      </p>
      <h1>{t('services.bookFor', { name: serviceName })}</h1>
      <p className="section-copy">{pickLocale(service, 'description', lang)}</p>
      <form className="form" onSubmit={submit}>
        <label>
          {t('services.form.name')}
          <input name="name" value={form.name} onChange={setField} required />
        </label>
        <label>
          {t('services.form.email')}
          <input name="email" type="email" value={form.email} onChange={setField} required />
        </label>
        <label>
          {t('services.form.phone')}
          <input name="contactPhone" value={form.contactPhone} onChange={setField} required />
        </label>
        {isSurvey ? (
          <>
            <label>
              {t('services.form.address')}
              <input name="address" value={form.address} onChange={setField} required />
            </label>
            <label>
              {t('services.form.buildingType')}
              <input name="buildingType" value={form.buildingType} onChange={setField} />
            </label>
            <label>
              {t('services.form.floors')}
              <input name="floors" type="number" value={form.floors} onChange={setField} />
            </label>
            <label>
              {t('services.form.infrastructure')}
              <textarea name="infrastructure" value={form.infrastructure} onChange={setField} />
            </label>
          </>
        ) : null}
        {isMaintenance ? (
          <>
            <label>
              {t('services.form.deviceType')}
              <input name="deviceType" value={form.deviceType} onChange={setField} required />
            </label>
            <label>
              {t('services.form.serialNumber')}
              <input name="serialNumber" value={form.serialNumber} onChange={setField} />
            </label>
            <label>
              {t('services.form.issue')}
              <textarea name="issue" value={form.issue} onChange={setField} required />
            </label>
          </>
        ) : null}
        <label>
          {t('services.form.preferredDate')}
          <input
            name="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={setField}
            required
          />
        </label>
        <label>
          {t('services.form.notes')}
          <textarea name="description" value={form.description} onChange={setField} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">{t('services.submitAppointment')}</button>
      </form>
    </div>
  );
}
