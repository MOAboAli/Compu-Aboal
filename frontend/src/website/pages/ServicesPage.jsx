import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import FeatureCard, { serviceImage } from '../components/FeatureCard';
import { pickLocale } from '../../shared/locale';

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const [offerings, setOfferings] = useState([]);
  const lang = i18n.language;

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
            to={`/services/${s._id}`}
            image={serviceImage(s.type)}
            badge={t('home.serviceBadge')}
            badgeTone="blue"
            title={pickLocale(s, 'name', lang)}
            subtitle={pickLocale(s.category, 'name', lang) || s.type}
            description={pickLocale(s, 'description', lang)}
            price={s.basePrice}
            ctaLabel={t('services.viewDetails')}
            ctaTo={`/services/${s._id}`}
          />
        ))}
      </div>
    </div>
  );
}
