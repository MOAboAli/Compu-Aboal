const { httpError } = require('./httpError');

const ACCOUNT_TYPES = ['personal', 'company'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function trim(value) {
  return String(value || '').trim();
}

function isFilledAddress(address) {
  if (!address || typeof address !== 'object') return false;
  return ['street', 'city', 'state', 'zip'].some((key) => trim(address[key]));
}

function normalizeAddress(address) {
  if (!isFilledAddress(address)) return undefined;
  return {
    street: trim(address.street),
    city: trim(address.city),
    state: trim(address.state),
    zip: trim(address.zip),
    country: trim(address.country) || 'Egypt',
  };
}

function assertEmail(email) {
  const value = trim(email).toLowerCase();
  if (!value || !EMAIL_RE.test(value)) throw httpError('Enter a valid email address');
  return value;
}

function assertPassword(password, { required = true } = {}) {
  const value = String(password || '');
  if (!value) {
    if (required) throw httpError(`Password must be at least ${MIN_PASSWORD} characters`);
    return null;
  }
  if (value.length < MIN_PASSWORD) {
    throw httpError(`Password must be at least ${MIN_PASSWORD} characters`);
  }
  return value;
}

function assertWebsite(url) {
  const value = trim(url);
  if (!value) throw httpError('Company website is required');
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname.includes('.')) {
      throw new Error('invalid');
    }
  } catch {
    throw httpError('Enter a valid company website URL (https://example.com)');
  }
  return value;
}

function namesFrom(data) {
  const firstName = trim(data.firstName);
  const lastName = trim(data.lastName);
  if (firstName && lastName) return { firstName, lastName, name: `${firstName} ${lastName}` };
  const parts = trim(data.name).split(/\s+/).filter(Boolean);
  if (parts.length) {
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' ') || parts[0],
      name: parts.join(' '),
    };
  }
  throw httpError('First name and last name are required');
}

function validateCustomerProfile(data, { requirePassword = false } = {}) {
  const { firstName, lastName, name } = namesFrom(data);
  const email = assertEmail(data.email);
  const phone = trim(data.phone);
  if (!phone) throw httpError('Phone number is required');

  const password = assertPassword(data.password, { required: requirePassword });
  const accountType = ACCOUNT_TYPES.includes(data.accountType) ? data.accountType : 'personal';
  const primaryAddress = normalizeAddress(data.primaryAddress);

  let companyAddress = '';
  let companyWebsite = '';
  if (accountType === 'company') {
    companyAddress = trim(data.companyAddress);
    if (!companyAddress) throw httpError('Company address is required');
    companyWebsite = assertWebsite(data.companyWebsite);
  }

  return {
    firstName,
    lastName,
    name,
    email,
    phone,
    password,
    accountType,
    primaryAddress,
    companyAddress,
    companyWebsite,
  };
}

module.exports = {
  ACCOUNT_TYPES,
  MIN_PASSWORD,
  isFilledAddress,
  normalizeAddress,
  validateCustomerProfile,
  assertPassword,
  assertEmail,
};
