const crypto = require('crypto');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function randomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex');
}

function randomCode(length = 6) {
  const max = 10 ** length;
  return String(Math.floor(Math.random() * max)).padStart(length, '0');
}

function orderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function invoiceNumber() {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function requestNumber() {
  return `SRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function backupJobNumber() {
  return `BKP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

module.exports = {
  slugify,
  randomToken,
  randomCode,
  orderNumber,
  invoiceNumber,
  requestNumber,
  backupJobNumber,
};
