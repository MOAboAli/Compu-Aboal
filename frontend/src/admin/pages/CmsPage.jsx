import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../shared/api';

const emptyCms = {
  heroTitle: '',
  heroTitleAr: '',
  heroText: '',
  heroTextAr: '',
  heroKicker: '',
  heroKickerAr: '',
  heroImage: '',
  about: '',
  aboutAr: '',
  contact: {
    phone: '',
    email: '',
    address: '',
    intro: '',
    introAr: '',
  },
  footer: {
    street: '',
    streetAr: '',
    city: '',
    cityAr: '',
    aboutTitle: '',
    aboutTitleAr: '',
    aboutText: '',
    aboutTextAr: '',
    phone: '',
    email: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    github: '',
  },
};

export default function AdminCmsPage() {
  const [cms, setCms] = useState(emptyCms);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    catalogApi
      .cms()
      .then((d) =>
        setCms({
          ...emptyCms,
          ...d,
          contact: { ...emptyCms.contact, ...(d.contact || {}) },
          footer: { ...emptyCms.footer, ...(d.footer || {}) },
        })
      )
      .catch((e) => setError(e.message));
  }, []);

  function setField(key, value) {
    setCms((prev) => ({ ...prev, [key]: value }));
  }

  function setContact(key, value) {
    setCms((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));
  }

  function setFooter(key, value) {
    setCms((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }));
  }

  return (
    <div className="stack">
      <h1>Website content (CMS)</h1>
      <p className="muted">
        Edit hero, about, contact, and footer content shown on the public website. Arabic fields are
        used when the site language is Arabic.
      </p>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError('');
          setMessage('');
          try {
            const saved = await adminApi.cmsSave(cms);
            setCms({
              ...emptyCms,
              ...saved,
              contact: { ...emptyCms.contact, ...(saved.contact || {}) },
              footer: { ...emptyCms.footer, ...(saved.footer || {}) },
            });
            setMessage('Website content saved');
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <h2 className="cms-section-title">Hero</h2>
        <label>
          Hero kicker (EN)
          <input value={cms.heroKicker || ''} onChange={(e) => setField('heroKicker', e.target.value)} />
        </label>
        <label>
          Hero kicker (AR)
          <input
            value={cms.heroKickerAr || ''}
            onChange={(e) => setField('heroKickerAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Hero title (EN)
          <input value={cms.heroTitle || ''} onChange={(e) => setField('heroTitle', e.target.value)} />
        </label>
        <label>
          Hero title (AR)
          <input
            value={cms.heroTitleAr || ''}
            onChange={(e) => setField('heroTitleAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Hero text (EN)
          <textarea value={cms.heroText || ''} onChange={(e) => setField('heroText', e.target.value)} />
        </label>
        <label>
          Hero text (AR)
          <textarea
            value={cms.heroTextAr || ''}
            onChange={(e) => setField('heroTextAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Hero image URL
          <input
            value={cms.heroImage || ''}
            onChange={(e) => setField('heroImage', e.target.value)}
            placeholder="https://..."
          />
        </label>
        {cms.heroImage ? (
          <div className="cms-image-preview">
            <img src={cms.heroImage} alt="Hero preview" />
          </div>
        ) : null}

        <h2 className="cms-section-title">About us</h2>
        <label>
          About text (EN)
          <textarea value={cms.about || ''} onChange={(e) => setField('about', e.target.value)} rows={5} />
        </label>
        <label>
          About text (AR)
          <textarea
            value={cms.aboutAr || ''}
            onChange={(e) => setField('aboutAr', e.target.value)}
            rows={5}
            dir="rtl"
          />
        </label>

        <h2 className="cms-section-title">Contact</h2>
        <label>
          Intro (EN)
          <textarea
            value={cms.contact?.intro || ''}
            onChange={(e) => setContact('intro', e.target.value)}
          />
        </label>
        <label>
          Intro (AR)
          <textarea
            value={cms.contact?.introAr || ''}
            onChange={(e) => setContact('introAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Phone
          <input
            value={cms.contact?.phone || ''}
            onChange={(e) => setContact('phone', e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            value={cms.contact?.email || ''}
            onChange={(e) => setContact('email', e.target.value)}
          />
        </label>
        <label>
          Address
          <input
            value={cms.contact?.address || ''}
            onChange={(e) => setContact('address', e.target.value)}
          />
        </label>

        <h2 className="cms-section-title">Footer</h2>
        <label>
          Street (EN)
          <input
            value={cms.footer?.street || ''}
            onChange={(e) => setFooter('street', e.target.value)}
          />
        </label>
        <label>
          Street (AR)
          <input
            value={cms.footer?.streetAr || ''}
            onChange={(e) => setFooter('streetAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          City (EN)
          <input value={cms.footer?.city || ''} onChange={(e) => setFooter('city', e.target.value)} />
        </label>
        <label>
          City (AR)
          <input
            value={cms.footer?.cityAr || ''}
            onChange={(e) => setFooter('cityAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Footer about title (EN)
          <input
            value={cms.footer?.aboutTitle || ''}
            onChange={(e) => setFooter('aboutTitle', e.target.value)}
          />
        </label>
        <label>
          Footer about title (AR)
          <input
            value={cms.footer?.aboutTitleAr || ''}
            onChange={(e) => setFooter('aboutTitleAr', e.target.value)}
            dir="rtl"
          />
        </label>
        <label>
          Footer about text (EN)
          <textarea
            value={cms.footer?.aboutText || ''}
            onChange={(e) => setFooter('aboutText', e.target.value)}
            rows={4}
          />
        </label>
        <label>
          Footer about text (AR)
          <textarea
            value={cms.footer?.aboutTextAr || ''}
            onChange={(e) => setFooter('aboutTextAr', e.target.value)}
            rows={4}
            dir="rtl"
          />
        </label>
        <label>
          Footer phone (optional)
          <input
            value={cms.footer?.phone || ''}
            onChange={(e) => setFooter('phone', e.target.value)}
            placeholder="Uses contact phone if empty"
          />
        </label>
        <label>
          Footer email (optional)
          <input
            value={cms.footer?.email || ''}
            onChange={(e) => setFooter('email', e.target.value)}
            placeholder="Uses contact email if empty"
          />
        </label>
        <label>
          Facebook URL
          <input
            value={cms.footer?.facebook || ''}
            onChange={(e) => setFooter('facebook', e.target.value)}
          />
        </label>
        <label>
          Twitter / X URL
          <input
            value={cms.footer?.twitter || ''}
            onChange={(e) => setFooter('twitter', e.target.value)}
          />
        </label>
        <label>
          LinkedIn URL
          <input
            value={cms.footer?.linkedin || ''}
            onChange={(e) => setFooter('linkedin', e.target.value)}
          />
        </label>
        <label>
          GitHub URL
          <input
            value={cms.footer?.github || ''}
            onChange={(e) => setFooter('github', e.target.value)}
          />
        </label>

        <button type="submit">Save website content</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
