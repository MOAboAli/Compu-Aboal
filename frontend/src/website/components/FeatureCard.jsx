import { Link } from 'react-router-dom';

const PLACEHOLDERS = {
  product:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  site_survey:
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
  maintenance:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  other:
    'https://images.unsplash.com/photo-1558494949-ef526b004090?auto=format&fit=crop&w=800&q=80',
};

export default function FeatureCard({
  to,
  image,
  badge,
  badgeTone = 'blue',
  title,
  subtitle,
  description,
  price,
  compareAtPrice,
  ctaLabel,
  ctaTo,
}) {
  const imgSrc = image || PLACEHOLDERS.product;
  const showSale = compareAtPrice != null && price != null && compareAtPrice > price;

  return (
    <article className="feature-card">
      <div className="feature-card-media">
        {badge ? (
          <span className={`feature-badge feature-badge-${badgeTone}`}>{badge}</span>
        ) : null}
        <img src={imgSrc} alt="" loading="lazy" />
      </div>
      <div className="feature-card-body">
        {subtitle ? <p className="feature-card-brand">{subtitle}</p> : null}
        <Link to={to} className="feature-card-title">
          {title}
        </Link>
        {description ? <p className="feature-card-desc">{description}</p> : null}
        {price != null ? (
          <p className="feature-card-price">
            <span>${Number(price).toFixed(2)}</span>
            {showSale ? <s>${Number(compareAtPrice).toFixed(2)}</s> : null}
          </p>
        ) : null}
        <Link to={ctaTo || to} className="feature-card-cta">
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export function serviceImage(type) {
  return PLACEHOLDERS[type] || PLACEHOLDERS.other;
}

export function productImage(product) {
  return product.featuredImage || product.gallery?.[0] || PLACEHOLDERS.product;
}
