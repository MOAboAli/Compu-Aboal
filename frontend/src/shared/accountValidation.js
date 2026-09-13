export const MIN_PASSWORD = 8;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emptyAddress = () => ({
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'Egypt',
});

export const emptyRegisterForm = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  accountType: 'personal',
  primaryAddress: emptyAddress(),
  companyAddress: '',
  companyWebsite: '',
});

function trim(value) {
  return String(value || '').trim();
}

function isFilledAddress(address) {
  if (!address) return false;
  return ['street', 'city', 'state', 'zip'].some((key) => trim(address[key]));
}

export function isValidWebsite(url) {
  const value = trim(url);
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

export function validateAccountForm(form, { requirePassword = true } = {}) {
  const errors = {};
  if (!trim(form.firstName)) errors.firstName = 'required';
  if (!trim(form.lastName)) errors.lastName = 'required';
  if (!EMAIL_RE.test(trim(form.email).toLowerCase())) errors.email = 'email';
  if (!trim(form.phone)) errors.phone = 'required';
  if (requirePassword && trim(form.password).length < MIN_PASSWORD) errors.password = 'password';
  if (!requirePassword && form.password && trim(form.password).length < MIN_PASSWORD) {
    errors.password = 'password';
  }
  if (form.accountType === 'company') {
    if (!trim(form.companyAddress)) errors.companyAddress = 'required';
    if (!isValidWebsite(form.companyWebsite)) errors.companyWebsite = 'url';
  }
  return errors;
}

export function profileFromUser(user) {
  return {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    accountType: user?.accountType === 'company' ? 'company' : 'personal',
    primaryAddress: { ...emptyAddress(), ...(user?.primaryAddress || {}) },
    companyAddress: user?.companyAddress || '',
    companyWebsite: user?.companyWebsite || '',
    password: '',
  };
}

export function compactProfilePayload(form) {
  return {
    firstName: trim(form.firstName),
    lastName: trim(form.lastName),
    email: trim(form.email).toLowerCase(),
    phone: trim(form.phone),
    accountType: form.accountType === 'company' ? 'company' : 'personal',
    primaryAddress: isFilledAddress(form.primaryAddress) ? form.primaryAddress : undefined,
    companyAddress: form.accountType === 'company' ? trim(form.companyAddress) : '',
    companyWebsite: form.accountType === 'company' ? trim(form.companyWebsite) : '',
  };
}
