import { useTranslation } from 'react-i18next';
import { useCms } from '../CmsContext';

export default function AboutPage() {
  const { t } = useTranslation();
  const { text } = useCms();
  const about = text('about', 'aboutAr', t('about.fallback'));

  return (
    <div className="stack page-shell">
      <h1>{t('nav.about')}</h1>
      <p className="section-copy">{about}</p>
    </div>
  );
}
