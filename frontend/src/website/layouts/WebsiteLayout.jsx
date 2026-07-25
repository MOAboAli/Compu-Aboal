import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../app/i18n';

export default function WebsiteLayout() {
  const { t, i18n } = useTranslation();

  return (
    <div className="site site-light">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-social" aria-label="Social links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              f
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              𝕏
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              in
            </a>
          </div>
          <div className="topbar-contact">
            <a href="tel:+201000000000">+20 100 000 0000</a>
            <a href="mailto:support@compu-aboali.com">support@compu-aboali.com</a>
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

      <footer className="site-footer-bar">
        <div className="site-footer-inner">
          <p>{t('brand')}</p>
          <nav className="footer-nav" aria-label="Footer">
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
            <Link to="/shop">{t('nav.shop')}</Link>
            <Link to="/services">{t('nav.services')}</Link>
          </nav>
          <p>Cairo · support@compu-aboali.com · +20 100 000 0000</p>
        </div>
      </footer>
    </div>
  );
}
