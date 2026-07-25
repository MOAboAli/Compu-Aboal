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

        {cms?.promotions?.length ? (
          <section>
            <h2>{t('home.promotions')}</h2>
            <ul className="plain-list">
              {cms.promotions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2>{t('home.about')}</h2>
          <p className="section-copy">
            {cms?.about || 'Compu-Aboali provides IT, networking, and security solutions.'}
          </p>
        </section>

        <section>
          <h2>{t('home.testimonials')}</h2>
          <div className="grid-cards">
            {(cms?.testimonials || []).map((item, i) => (
              <blockquote key={i} className="card-link">
                “{item.text}” — {item.author}
              </blockquote>
            ))}
          </div>
        </section>

        <section>
          <h2>{t('home.news')}</h2>
          <ul className="plain-list">
            {(cms?.news || []).map((item, i) => (
              <li key={i}>
                <strong>{item.title}</strong>: {item.body}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{t('home.contact')}</h2>
          <p className="section-copy">{cms?.contact?.phone || '+20 100 000 0000'}</p>
          <p className="section-copy">{cms?.contact?.email || 'support@compu-aboali.com'}</p>
          <p className="section-copy">{cms?.contact?.address || 'Cairo, Egypt'}</p>
        </section>
      </div>
    </div>
  );
}
