export const PUBLIC_PHONE = '+20 11 15918769';
export const PUBLIC_EMAIL = 'info@compu-aboali.com';

function pick(...values) {
  return values.find((value) => String(value || '').trim()) || '';
}

export function publicPhone(cms) {
  const value = pick(cms?.footer?.phone, cms?.contact?.phone);
  if (!value || value.includes('100 000 0000')) return PUBLIC_PHONE;
  return value;
}

export function publicEmail(cms) {
  const value = pick(cms?.footer?.email, cms?.contact?.email);
  if (!value || value === 'support@compu-aboali.com') return PUBLIC_EMAIL;
  return value;
}

export function publicTelHref(phone = PUBLIC_PHONE) {
  return `tel:${String(phone).replace(/\s/g, '')}`;
}
