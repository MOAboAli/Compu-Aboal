import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../app/i18n';
import { CmsProvider, useCms } from '../CmsContext';

function SiteShell() {
  const { t, i18n } = useTranslation();
  const { cms, nested } = useCms();

  const phone = cms?.footer?.phone || cms?.contact?.phone || '+20 100 000 0000';
  const email = cms?.footer?.email || cms?.contact?.email || 'support@compu-aboali.com';
  const street = nested('footer', 'street', 'streetAr', t('footer.street'));
  const city = nested('footer', 'city', 'cityAr', t('footer.city'));
  const footerAboutTitle = nested('footer', 'aboutTitle', 'aboutTitleAr', t('footer.aboutTitle'));
  const footerAboutText = nested('footer', 'aboutText', 'aboutTextAr', t('footer.aboutText'));
  const facebook = cms?.footer?.facebook || 'https://facebook.com';
  const twitter = cms?.footer?.twitter || 'https://twitter.com';
  const linkedin = cms?.footer?.linkedin || 'https://linkedin.com';
  const github = cms?.footer?.github || 'https://github.com/MOAboAli/Compu-Aboal';
  const phoneHref = `tel:${String(phone).replace(/\s/g, '')}`;

  return (
    <div className="site site-light">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-social" aria-label="Social links">
            <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href={twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
              𝕏
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              in
            </a>
          </div>
          <div className="topbar-contact">
            <a href={phoneHref}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
            <button
              type="button"
              className="lang-toggle"
              onClick={() => setLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
            >
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>
      </div>

      <header className="main-header">
        <div className="main-header-inner">
          <Link to="/" className="logo-mark">
            <span className="logo-accent">C</span>
            <span className="logo-rest">-ABOALI</span>
          </Link>

          <nav className="main-nav" aria-label="Primary">
            <NavLink to="/" end>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/shop">{t('nav.shop')}</NavLink>
            <NavLink to="/services">{t('nav.services')}</NavLink>
            <NavLink to="/about">{t('nav.about')}</NavLink>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/services" className="cta-appointment">
              {t('nav.appointment')}
            </Link>
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-contact">
            <div className="footer-contact-row">
              <span className="footer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
              </span>
              <div>
                <p>{street}</p>
                <strong>{city}</strong>
              </div>
            </div>
            <div className="footer-contact-row">
              <span className="footer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6.5 4.5h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.7 2 2 0 0 1 6.5 4.5z" />
                </svg>
              </span>
              <div>
                <a href={phoneHref}>
                  <strong>{phone}</strong>
                </a>
              </div>
            </div>
            <div className="footer-contact-row">
              <span className="footer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                  <path d="m4.5 7.5 7.5 6 7.5-6" />
                </svg>
              </span>
              <div>
                <a className="footer-email" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="footer-about">
            <h2>{footerAboutTitle}</h2>
            <p>{footerAboutText}</p>
            <div className="footer-social" aria-label="Social links">
              <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9z" />
                </svg>
              </a>
              <a href={twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.5 22H3.4l7.3-8.3L1 2h6.4l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" />
                </svg>
              </a>
              <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                  <path d="M6.3 9.3H3.5V20h2.8V9.3zM4.9 4A1.6 1.6 0 1 0 5 7.2 1.6 1.6 0 0 0 4.9 4zM20.5 20h-2.8v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H11V9.3h2.7v1.5h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V20z" />
                </svg>
              </a>
              <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function WebsiteLayout() {
  return (
    <CmsProvider>
      <SiteShell />
    </CmsProvider>
  );
}
