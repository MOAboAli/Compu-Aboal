function startOfDay(input) {
  const d = input instanceof Date ? new Date(input) : new Date(`${String(input).slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfDay(input) {
  const d = startOfDay(input);
  if (!d) return null;
  const end = new Date(d);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

function toDateKey(input) {
  const d = startOfDay(input);
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

function addUtcDays(date, days) {
  const d = startOfDay(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function minBookableDate(leadDays = 14) {
  return addUtcDays(new Date(), leadDays);
}

module.exports = {
  startOfDay,
  endOfDay,
  toDateKey,
  addUtcDays,
  minBookableDate,
};
