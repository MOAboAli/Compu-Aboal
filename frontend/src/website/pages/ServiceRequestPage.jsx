import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentApi, catalogApi, serviceRequestApi } from '../../shared/api';
import { formatMoney, pickLocale } from '../../shared/locale';
import AppointmentCalendar from '../components/AppointmentCalendar';

export default function ServiceRequestPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    const min = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 14)
    );
    return new Date(Date.UTC(min.getUTCFullYear(), min.getUTCMonth(), 1));
  });
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
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

  useEffect(() => {
    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth();
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    appointmentApi
      .availability(`?from=${from}&to=${to}`)
      .then(setAvailability)
      .catch((err) => setError(err.message));
  }, [monthDate]);

  const unavailableMap = useMemo(() => {
    const map = new Map();
    for (const item of availability?.unavailable || []) {
      map.set(item.date, item);
    }
    return map;
  }, [availability]);

  function setField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function continueToDetails() {
    if (!selectedDate) {
      setError(t('services.calendar.pickDate'));
      return;
    }
    setError('');
    setStep(2);
  }

  async function submit(e) {
    e.preventDefault();
    if (!service || !selectedDate) return;
    setError('');
    try {
      const created = await serviceRequestApi.create({
        offering: service._id,
        type: service.type,
        preferredDate: selectedDate,
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
  const serviceName = pickLocale(service, 'name', lang);

  if (done) {
    return (
      <div className="stack narrow page-shell">
        <h1>{t('services.submittedTitle')}</h1>
        <p>
          {t('services.submittedRef')}: {done.requestNumber || done._id}
        </p>
        <p>
          {t('services.calendar.selectedDate')}: {selectedDate}
        </p>
        <p>{t('services.submittedNote')}</p>
        <button type="button" onClick={() => navigate('/services')}>
          {t('services.backToServices')}
        </button>
      </div>
    );
  }

  return (
    <div className="stack page-shell appointment-flow">
      <p className="muted">
        <Link to={`/services/${service._id}`}>{serviceName}</Link> / {t('services.bookAppointment')}
      </p>
      <h1>{t('services.bookFor', { name: serviceName })}</h1>
      {service.basePrice != null ? (
        <p className="feature-card-price">
          <span>
            {t('services.fromPrice', { price: formatMoney(service.basePrice, lang) })}
          </span>
        </p>
      ) : null}
      <p className="feature-card-price-note">{t('services.priceNote')}</p>
      <p className="section-copy">{t('services.calendar.leadNotice', { days: 14 })}</p>

      <div className="appointment-steps">
        <span className={step === 1 ? 'active' : ''}>1. {t('services.calendar.stepDate')}</span>
        <span className={step === 2 ? 'active' : ''}>2. {t('services.calendar.stepDetails')}</span>
      </div>

      {step === 1 ? (
        <div className="appointment-step-panel">
          <AppointmentCalendar
            monthDate={monthDate}
            onMonthChange={setMonthDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            unavailableMap={unavailableMap}
            minBookableDate={availability?.minBookableDate}
          />
          {selectedDate ? (
            <p className="section-copy">
              {t('services.calendar.selectedDate')}: <strong>{selectedDate}</strong>
            </p>
          ) : null}
          {error && <p className="error">{error}</p>}
          <button type="button" className="cta-appointment" onClick={continueToDetails}>
            {t('services.calendar.continue')}
          </button>
        </div>
      ) : (
        <form className="form appointment-step-panel" onSubmit={submit}>
          <p className="section-copy">
            {t('services.calendar.selectedDate')}: <strong>{selectedDate}</strong>{' '}
            <button type="button" className="linkish" onClick={() => setStep(1)}>
              {t('services.calendar.changeDate')}
            </button>
          </p>
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
            {t('services.form.notes')}
            <textarea name="description" value={form.description} onChange={setField} />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">{t('services.submitAppointment')}</button>
        </form>
      )}
    </div>
  );
}
