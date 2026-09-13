import { useTranslation } from 'react-i18next';
import { useCms } from '../CmsContext';
import { publicEmail, publicPhone, publicTelHref } from '../../shared/contact';

export default function AboutPage() {
  const { t } = useTranslation();
  const { cms, text } = useCms();
  const about = text('about', 'aboutAr', t('about.fallback'));
  const phone = publicPhone(cms);
  const email = publicEmail(cms);

  return (
    <div className="stack page-shell">
      <h1>{t('nav.about')}</h1>
      <p className="section-copy">{about}</p>
      <div className="contact-details">
        <p>
          <strong>{t('contact.phone')}</strong>{' '}
          <a href={publicTelHref(phone)}>{phone}</a>
        </p>
        <p>
          <strong>{t('contact.email')}</strong>{' '}
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      </div>
    </div>
  );
}
