export function pickLocale(item, field, lang = 'en') {
  if (!item) return '';
  if (lang?.startsWith('ar')) {
    const arabic = item[`${field}Ar`];
    if (arabic) return arabic;
  }
  return item[field] || '';
}

export function formatMoney(amount, lang = 'en') {
  if (amount == null || amount === '' || Number.isNaN(Number(amount))) return '';
  return new Intl.NumberFormat(lang?.startsWith('ar') ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
