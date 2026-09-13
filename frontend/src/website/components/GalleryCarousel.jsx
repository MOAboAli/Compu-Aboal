import { useCallback, useEffect, useRef, useState } from 'react';

export default function GalleryCarousel({ children, label = 'Gallery' }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    updateButtons();
    el.addEventListener('scroll', updateButtons, { passive: true });
    const resizeObserver = new ResizeObserver(updateButtons);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateButtons);

    return () => {
      el.removeEventListener('scroll', updateButtons);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateButtons);
    };
  }, [updateButtons, children]);

  function scrollByPage(direction) {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    const gap = 20;
    const step = firstCard ? firstCard.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return (
    <div className="gallery-carousel" aria-label={label}>
      <button
        type="button"
        className="gallery-arrow gallery-arrow-prev"
        aria-label="Previous"
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
      >
        ‹
      </button>

      <div className="feature-gallery" ref={trackRef} role="list">
        {children}
      </div>

      <button
        type="button"
        className="gallery-arrow gallery-arrow-next"
        aria-label="Next"
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
      >
        ›
      </button>
    </div>
  );
}
