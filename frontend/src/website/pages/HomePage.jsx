import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import FeatureCard, { productImage, serviceImage } from '../components/FeatureCard';
import GalleryCarousel from '../components/GalleryCarousel';

export default function HomePage() {
  const { t } = useTranslation();
  const [cms, setCms] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([catalogApi.cms(), catalogApi.products('?featured=1'), catalogApi.serviceOfferings()])
      .then(([c, p, s]) => {
        setCms(c);
        setProducts((p.items || p).slice(0, 10));
        setServices((s.items || s).slice(0, 10));
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
        <section className="feature-section">
          <div className="feature-section-head">
            <h2>{t('home.featuredServices')}</h2>
            <Link to="/services" className="feature-section-link">
              {t('home.viewAll')}
            </Link>
          </div>
          <GalleryCarousel label={t('home.featuredServices')}>
            {services.map((s) => (
              <FeatureCard
                key={s._id}
                to={`/services/${s._id}/appointment`}
                image={serviceImage(s.type)}
                badge={t('home.serviceBadge')}
                badgeTone="blue"
                title={s.name}
                subtitle={s.category?.name || s.type}
                description={s.description}
                price={s.basePrice}
                ctaLabel={t('services.bookAppointment')}
                ctaTo={`/services/${s._id}/appointment`}
              />
            ))}
          </GalleryCarousel>
        </section>

        <section className="feature-section">
          <div className="feature-section-head">
            <h2>{t('home.featuredProducts')}</h2>
            <Link to="/shop" className="feature-section-link">
              {t('home.viewAll')}
            </Link>
          </div>
          <GalleryCarousel label={t('home.featuredProducts')}>
            {products.map((p) => {
              const hasSale = p.discountPrice != null && p.discountPrice < p.price;
              return (
                <FeatureCard
                  key={p._id}
                  to={`/shop/${p._id}`}
                  image={productImage(p)}
                  badge={hasSale ? t('home.saleBadge') : t('home.featuredBadge')}
                  badgeTone={hasSale ? 'sale' : 'blue'}
                  title={p.name}
                  subtitle={p.category?.name}
                  description={p.shortDescription}
                  price={hasSale ? p.discountPrice : p.price}
                  compareAtPrice={hasSale ? p.price : null}
                  ctaLabel={t('home.viewProduct')}
                  ctaTo={`/shop/${p._id}`}
                />
              );
            })}
          </GalleryCarousel>
        </section>
      </div>
    </div>
  );
}
