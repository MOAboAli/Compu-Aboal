import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const [contact, setContact] = useState({
    phone: '+20 100 000 0000',
    email: 'support@compu-aboali.com',
    address: 'Cairo, Egypt',
  });

  useEffect(() => {
    catalogApi
      .cms()
      .then((cms) => {
        if (cms?.contact) {
          setContact({
            phone: cms.contact.phone || '+20 100 000 0000',
            email: cms.contact.email || 'support@compu-aboali.com',
            address: cms.contact.address || 'Cairo, Egypt',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="stack page-shell">
      <h1>{t('nav.contact')}</h1>
      <p className="section-copy">{t('contact.intro')}</p>
      <div className="contact-details">
        <p>
          <strong>{t('contact.phone')}</strong>{' '}
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
        </p>
        <p>
          <strong>{t('contact.email')}</strong>{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <p>
          <strong>{t('contact.address')}</strong> {contact.address}
        </p>
      </div>
    </div>
  );
}
