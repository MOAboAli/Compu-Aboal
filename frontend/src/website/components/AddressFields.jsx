import { useTranslation } from 'react-i18next';

export default function AddressFields({ value, onChange, prefix = 'address' }) {
  const { t } = useTranslation();
  const address = value || {};

  function setField(key, next) {
    onChange({ ...address, [key]: next });
  }

  return (
    <>
      <label>
        {t(`${prefix}.street`)}
        <input value={address.street || ''} onChange={(e) => setField('street', e.target.value)} />
      </label>
      <label>
        {t(`${prefix}.city`)}
        <input value={address.city || ''} onChange={(e) => setField('city', e.target.value)} />
      </label>
      <label>
        {t(`${prefix}.state`)}
        <input value={address.state || ''} onChange={(e) => setField('state', e.target.value)} />
      </label>
      <label>
        {t(`${prefix}.zip`)}
        <input value={address.zip || ''} onChange={(e) => setField('zip', e.target.value)} />
      </label>
      <label className="span-2">
        {t(`${prefix}.country`)}
        <input value={address.country || ''} onChange={(e) => setField('country', e.target.value)} />
      </label>
    </>
  );
}
