import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/AuthContext';
import { setLanguage } from '../../app/i18n';

export default function WebsiteLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="site">
      <header className="site-header">
        <Link to="/" className="brand">
          {t('brand')}
        </Link>
        <nav>
          <NavLink to="/">{t('nav.home')}</NavLink>
          <NavLink to="/shop">{t('nav.shop')}</NavLink>
          <NavLink to="/services">{t('nav.services')}</NavLink>
          <NavLink to="/cart">{t('nav.cart')}</NavLink>
          <NavLink to="/wishlist">{t('nav.wishlist')}</NavLink>
          {user ? <NavLink to="/account">{t('nav.account')}</NavLink> : null}
          {isAdmin ? <NavLink to="/admin">{t('nav.admin')}</NavLink> : null}
          {user ? (
            <button type="button" className="linkish" onClick={logout}>
              {t('nav.logout')}
            </button>
          ) : (
            <>
              <NavLink to="/login">{t('nav.login')}</NavLink>
              <NavLink to="/register">{t('nav.register')}</NavLink>
            </>
          )}
          <button
            type="button"
            className="lang"
            onClick={() => setLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
          >
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>{t('brand')} · Cairo · support@compu-aboali.com</p>
      </footer>
    </div>
  );
}
