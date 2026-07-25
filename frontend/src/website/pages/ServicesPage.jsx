import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import FeatureCard, { serviceImage } from '../components/FeatureCard';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [offerings, setOfferings] = useState([]);

  useEffect(() => {
    catalogApi
      .serviceOfferings()
      .then((d) => setOfferings(d.items || d))
      .catch(() => {});
  }, []);

  return (
    <div className="stack page-shell">
      <h1>{t('services.title')}</h1>
      <p className="section-copy">{t('services.chooseFirst')}</p>
      <div className="feature-grid">
        {offerings.map((s) => (
          <FeatureCard
            key={s._id}
            to={`/services/${s._id}/appointment`}
            image={serviceImage(s.type)}
            badge={t('home.serviceBadge')}
            badgeTone="blue"
            title={s.name}
            subtitle={s.category?.name || s.type}
            description={s.description}
            price={s.basePrice}
            ctaLabel={t('services.bookAppointment')}
            ctaTo={`/services/${s._id}/appointment`}
          />
        ))}
      </div>
    </div>
  );
}
