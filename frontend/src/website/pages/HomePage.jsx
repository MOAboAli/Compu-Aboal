import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';

export default function HomePage() {
  const { t } = useTranslation();
  const [cms, setCms] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([catalogApi.cms(), catalogApi.products('?featured=1'), catalogApi.serviceOfferings()])
      .then(([c, p, s]) => {
        setCms(c);
        setProducts(p.items || p);
        setServices((s.items || s).slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const heroTitle = cms?.heroTitle || t('home.heroTitle');
  const heroText = cms?.heroText || t('home.heroText');

  return (
    <div className="home-page">
      <section className="hero-bleed">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">{t('home.heroKicker')}</p>
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-copy">{heroText}</p>
          <div className="hero-actions">
            <Link className="cta-appointment" to="/services">
              {t('nav.appointment')}
            </Link>
            <Link className="btn-outline-light" to="/shop">
              {t('nav.shop')}
            </Link>
          </div>
        </div>
      </section>

      <div className="home-sections">
        <section>
          <h2>{t('home.featuredProducts')}</h2>
          <div className="grid-cards">
            {products.map((p) => (
              <Link key={p._id} to={`/shop/${p._id}`} className="card-link">
                <strong>{p.name}</strong>
                <span>${Number(p.discountPrice ?? p.price).toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>{t('home.featuredServices')}</h2>
          <div className="grid-cards">
            {services.map((s) => (
              <div key={s._id} className="card-link">
                <strong>{s.name}</strong>
                <span>{s.categoryName || s.type}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
