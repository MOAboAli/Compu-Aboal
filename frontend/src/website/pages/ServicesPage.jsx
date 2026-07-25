import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [offerings, setOfferings] = useState([]);

  useEffect(() => {
    catalogApi.serviceOfferings().then((d) => setOfferings(d.items || d)).catch(() => {});
  }, []);

  return (
    <div className="stack">
      <h1>{t('services.title')}</h1>
      <div className="actions">
        <Link className="btn" to="/services/request/site-survey">
          {t('services.requestSurvey')}
        </Link>
        <Link className="btn ghost" to="/services/request/maintenance">
          {t('services.requestMaintenance')}
        </Link>
        <Link className="btn ghost" to="/account">
          {t('services.track')}
        </Link>
      </div>
      <div className="grid-cards">
        {offerings.map((s) => (
          <div key={s._id} className="card-link">
            <strong>{s.name}</strong>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
