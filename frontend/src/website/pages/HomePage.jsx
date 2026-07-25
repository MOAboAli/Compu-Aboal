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

  return (
    <div className="stack">
      <section className="hero-block">
        <p className="brand">{t('brand')}</p>
        <h1>{cms?.heroTitle || t('home.heroTitle')}</h1>
        <p>{cms?.heroText || t('home.heroText')}</p>
        <div className="actions">
          <Link className="btn" to="/shop">
            {t('nav.shop')}
          </Link>
          <Link className="btn ghost" to="/services">
            {t('nav.services')}
          </Link>
        </div>
      </section>

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
          <ul>
            {cms.promotions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2>{t('home.about')}</h2>
        <p>{cms?.about || 'Compu-Aboali provides IT, networking, and security solutions.'}</p>
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
        <ul>
          {(cms?.news || []).map((item, i) => (
            <li key={i}>
              <strong>{item.title}</strong>: {item.body}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{t('home.contact')}</h2>
        <p>{cms?.contact?.phone || '+20 100 000 0000'}</p>
        <p>{cms?.contact?.email || 'support@compu-aboali.com'}</p>
        <p>{cms?.contact?.address || 'Cairo, Egypt'}</p>
      </section>
    </div>
  );
}
