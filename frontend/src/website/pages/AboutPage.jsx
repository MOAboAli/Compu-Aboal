import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function AboutPage() {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');

  useEffect(() => {
    catalogApi
      .cms()
      .then((cms) => setAbout(cms?.about || ''))
      .catch(() => {});
  }, []);

  return (
    <div className="stack page-shell">
      <h1>{t('nav.about')}</h1>
      <p className="section-copy">
        {about || t('about.fallback')}
      </p>
    </div>
  );
}
