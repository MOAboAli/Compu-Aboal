import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import { serviceImage } from '../components/FeatureCard';
import { formatMoney, pickLocale } from '../../shared/locale';

const TYPE_LABELS = {
  site_survey: 'siteSurvey',
  maintenance: 'maintenance',
  other: 'other',
};

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState(null);
  const [message, setMessage] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const lang = i18n.language;

  useEffect(() => {
    setMessage('');
    catalogApi
      .serviceOffering(serviceId)
      .then((data) => {
        setService(data);
        setImgSrc(serviceImage(data.type));
      })
      .catch((e) => setMessage(e.message));
  }, [serviceId]);

  if (!service) {
    return (
      <div className="stack narrow page-shell">
        <p>{message || t('services.loading')}</p>
        {message ? (
          <Link className="feature-card-cta" to="/services">
            {t('services.backToServices')}
          </Link>
        ) : null}
      </div>
    );
  }

  const typeKey = TYPE_LABELS[service.type] || 'other';
  const serviceName = pickLocale(service, 'name', lang);

  return (
    <div className="page-shell product-detail">
      <div className="product-detail-media">
        <span className="feature-badge feature-badge-blue">{t('home.serviceBadge')}</span>
        <img
          src={imgSrc}
          alt={serviceName}
          onError={() =>
            setImgSrc(
              'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            )
          }
        />
      </div>
      <div className="product-detail-body">
        {service.category ? (
          <p className="feature-card-brand">{pickLocale(service.category, 'name', lang)}</p>
        ) : null}
        <h1>{serviceName}</h1>
        {service.basePrice != null ? (
          <p className="feature-card-price">
            <span>{formatMoney(service.basePrice, lang)}</span>
          </p>
        ) : null}
        <p className="muted">{t(`services.types.${typeKey}`)}</p>
        {pickLocale(service, 'description', lang) ? (
          <p className="section-copy">{pickLocale(service, 'description', lang)}</p>
        ) : null}
        <p className="section-copy">{t('services.detailIntro')}</p>
        <div className="product-detail-actions">
          <Link className="feature-card-cta" to={`/services/${service._id}/appointment`}>
            {t('services.bookAppointment')}
          </Link>
          <Link className="btn ghost" to="/services">
            {t('services.backToServices')}
          </Link>
        </div>
        {message ? <p className="error">{message}</p> : null}
      </div>
    </div>
  );
}
