import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function unsplash(id) {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
}

const PLACEHOLDERS = {
  product: unsplash('1496181133206-80ce9b88a853'),
  site_survey: unsplash('1557597774-9d273605dfa9'),
  maintenance: unsplash('1581092160562-40aa08e78837'),
  other: unsplash('1518770660439-4636190af475'),
};

const FALLBACK = unsplash('1486312338219-ce68d2c6f44d');

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
  const [imgSrc, setImgSrc] = useState(image || PLACEHOLDERS.product);

  useEffect(() => {
    setImgSrc(image || PLACEHOLDERS.product);
  }, [image]);

  const showSale = compareAtPrice != null && price != null && compareAtPrice > price;

  return (
    <article className="feature-card">
      <div className="feature-card-media">
        {badge ? (
          <span className={`feature-badge feature-badge-${badgeTone}`}>{badge}</span>
        ) : null}
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          onError={() => {
            if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
          }}
        />
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
