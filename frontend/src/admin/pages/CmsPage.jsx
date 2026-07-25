import { useEffect, useState } from 'react';
import { adminApi, catalogApi } from '../../shared/api';

export default function AdminCmsPage() {
  const [cms, setCms] = useState({
    heroTitle: '',
    heroText: '',
    about: '',
    promotions: [],
    testimonials: [],
    news: [],
    contact: { phone: '', email: '', address: '' },
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    catalogApi.cms().then((d) => setCms({ ...cms, ...d })).catch(() => {});
  }, []);

  return (
    <div className="stack">
      <h1>CMS</h1>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await adminApi.cmsSave(cms);
          setMessage('CMS saved');
        }}
      >
        <label>
          Hero title
          <input
            value={cms.heroTitle || ''}
            onChange={(e) => setCms({ ...cms, heroTitle: e.target.value })}
          />
        </label>
        <label>
          Hero text
          <textarea
            value={cms.heroText || ''}
            onChange={(e) => setCms({ ...cms, heroText: e.target.value })}
          />
        </label>
        <label>
          About
          <textarea
            value={cms.about || ''}
            onChange={(e) => setCms({ ...cms, about: e.target.value })}
          />
        </label>
        <label>
          Contact phone
          <input
            value={cms.contact?.phone || ''}
            onChange={(e) =>
              setCms({ ...cms, contact: { ...cms.contact, phone: e.target.value } })
            }
          />
        </label>
        <label>
          Contact email
          <input
            value={cms.contact?.email || ''}
            onChange={(e) =>
              setCms({ ...cms, contact: { ...cms.contact, email: e.target.value } })
            }
          />
        </label>
        <button type="submit">Save CMS</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
