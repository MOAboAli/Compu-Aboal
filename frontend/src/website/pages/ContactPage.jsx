import { useTranslation } from 'react-i18next';
import { useCms } from '../CmsContext';

export default function ContactPage() {
  const { t } = useTranslation();
  const { cms, nested } = useCms();

  const phone = cms?.contact?.phone || '+20 100 000 0000';
  const email = cms?.contact?.email || 'support@compu-aboali.com';
  const address = cms?.contact?.address || 'Cairo, Egypt';
  const intro = nested('contact', 'intro', 'introAr', t('contact.intro'));

  return (
    <div className="stack page-shell">
      <h1>{t('nav.contact')}</h1>
      <p className="section-copy">{intro}</p>
      <div className="contact-details">
        <p>
          <strong>{t('contact.phone')}</strong>{' '}
          <a href={`tel:${String(phone).replace(/\s/g, '')}`}>{phone}</a>
        </p>
        <p>
          <strong>{t('contact.email')}</strong>{' '}
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          <strong>{t('contact.address')}</strong> {address}
        </p>
      </div>
    </div>
  );
}
