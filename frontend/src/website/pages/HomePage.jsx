import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../shared/api';
import FeatureCard, { productImage, serviceImage } from '../components/FeatureCard';
import GalleryCarousel from '../components/GalleryCarousel';
import { pickLocale } from '../../shared/locale';
import { useCms } from '../CmsContext';

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { text, cms } = useCms();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const lang = i18n.language;

  useEffect(() => {
    Promise.all([catalogApi.products('?featured=1'), catalogApi.serviceOfferings()])
      .then(([p, s]) => {
        setProducts((p.items || p).slice(0, 10));
        setServices((s.items || s).slice(0, 10));
      })
      .catch(() => {});
  }, []);

  const heroKicker = text('heroKicker', 'heroKickerAr', t('home.heroKicker'));
  const heroTitle = text('heroTitle', 'heroTitleAr', t('home.heroTitle'));
  const heroText = text('heroText', 'heroTextAr', t('home.heroText'));
  const heroImage = cms?.heroImage || DEFAULT_HERO_IMAGE;

  return (
    <div className="home-page">
      <section
        className="hero-bleed"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25)), url('${heroImage}')`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">{heroKicker}</p>
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
                to={`/services/${s._id}`}
                image={serviceImage(s.type)}
                badge={t('home.serviceBadge')}
                badgeTone="blue"
                title={pickLocale(s, 'name', lang)}
                subtitle={pickLocale(s.category, 'name', lang) || s.type}
                description={pickLocale(s, 'description', lang)}
                price={s.basePrice}
                priceStartsFrom
                ctaLabel={t('services.viewDetails')}
                ctaTo={`/services/${s._id}`}
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
                  title={pickLocale(p, 'name', lang)}
                  subtitle={pickLocale(p.category, 'name', lang)}
                  description={pickLocale(p, 'shortDescription', lang)}
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
