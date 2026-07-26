const { httpError } = require('../utils/httpError');
const {
  startOfDay,
  toDateKey,
  minBookableDate,
  addUtcDays,
} = require('../utils/dateOnly');

const LEAD_DAYS = 14;

class AppointmentAvailabilityService {
  constructor({ blockedDateRepository, serviceRequestRepository }) {
    this.blockedDateRepository = blockedDateRepository;
    this.serviceRequestRepository = serviceRequestRepository;
  }

  getLeadDays() {
    return LEAD_DAYS;
  }

  getMinBookableDate() {
    return minBookableDate(LEAD_DAYS);
  }

  async listBlocked(query = {}) {
    const filter = {};
    if (query.from || query.to) {
      filter.date = {};
      if (query.from) filter.date.$gte = startOfDay(query.from);
      if (query.to) filter.date.$lte = startOfDay(query.to);
    }
    return this.blockedDateRepository.findAll(filter);
  }

  async createBlocked(data, user) {
    const day = startOfDay(data.date);
    if (!day) throw httpError('Valid date is required');
    if (!['holiday', 'unavailable'].includes(data.type)) {
      throw httpError('type must be holiday or unavailable');
    }

    const existing = await this.blockedDateRepository.findByDate(day);
    if (existing) throw httpError('This date is already marked unavailable');

    try {
      return await this.blockedDateRepository.create({
        date: day,
        type: data.type,
        reason: data.reason || '',
        createdBy: user?._id || null,
      });
    } catch (error) {
      if (error.code === 11000) throw httpError('This date is already marked unavailable');
      throw error;
    }
  }

  async deleteBlocked(id) {
    const deleted = await this.blockedDateRepository.deleteById(id);
    if (!deleted) throw httpError('Blocked date not found', 404);
    return { message: 'Blocked date removed' };
  }

  async getAvailability(query = {}) {
    const minDate = this.getMinBookableDate();
    const from = startOfDay(query.from) || minDate;
    const to = startOfDay(query.to) || addUtcDays(from, 90);

    const [blocked, bookedDocs] = await Promise.all([
      this.blockedDateRepository.findInRange(from, to),
      this.serviceRequestRepository.findActivePreferredDatesInRange(from, to),
    ]);

    const unavailableMap = new Map();

    for (const item of blocked) {
      const key = toDateKey(item.date);
      unavailableMap.set(key, {
        date: key,
        reason: item.type,
        label: item.reason || (item.type === 'holiday' ? 'Holiday' : 'Unavailable'),
        id: item._id,
      });
    }

    for (const item of bookedDocs) {
      const key = toDateKey(item.preferredDate);
      if (!unavailableMap.has(key)) {
        unavailableMap.set(key, {
          date: key,
          reason: 'booked',
          label: 'Already booked',
        });
      }
    }

    return {
      leadDays: LEAD_DAYS,
      minBookableDate: toDateKey(minDate),
      from: toDateKey(from),
      to: toDateKey(to),
      unavailable: Array.from(unavailableMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  async assertDateBookable(dateInput) {
    const day = startOfDay(dateInput);
    if (!day) throw httpError('Preferred appointment date is required');

    const minDate = this.getMinBookableDate();
    if (day < minDate) {
      throw httpError(`Appointments must be booked at least ${LEAD_DAYS} days ahead`);
    }

    const blocked = await this.blockedDateRepository.findByDate(day);
    if (blocked) {
      throw httpError(
        blocked.type === 'holiday'
          ? 'Selected date is a holiday'
          : 'Selected date is not available'
      );
    }

    const existing = await this.serviceRequestRepository.findActiveOnDate(day);
    if (existing.length) {
      throw httpError('Selected date is already booked');
    }

    return day;
  }
}

module.exports = AppointmentAvailabilityService;
