const { httpError } = require('../utils/httpError');
const {
  startOfDay,
  toDateKey,
  minBookableDate,
  addUtcDays,
} = require('../utils/dateOnly');

const LEAD_DAYS = 14;
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class AppointmentAvailabilityService {
  constructor({ blockedDateRepository, blockedWeekdayRepository, serviceRequestRepository }) {
    this.blockedDateRepository = blockedDateRepository;
    this.blockedWeekdayRepository = blockedWeekdayRepository;
    this.serviceRequestRepository = serviceRequestRepository;
  }

  getLeadDays() {
    return LEAD_DAYS;
  }

  getMinBookableDate() {
    return minBookableDate(LEAD_DAYS);
  }

  weekdayLabel(weekday) {
    return WEEKDAY_NAMES[Number(weekday)] || `Day ${weekday}`;
  }

  serializeDateBlock(item) {
    return {
      _id: item._id,
      kind: 'date',
      date: item.date,
      weekday: null,
      type: item.type,
      reason: item.reason || '',
      createdAt: item.createdAt,
    };
  }

  serializeWeekdayBlock(item) {
    return {
      _id: item._id,
      kind: 'weekday',
      date: null,
      weekday: item.weekday,
      weekdayLabel: this.weekdayLabel(item.weekday),
      type: item.type,
      reason: item.reason || '',
      createdAt: item.createdAt,
    };
  }

  async listBlocked(query = {}) {
    const dateFilter = {};
    if (query.from || query.to) {
      dateFilter.date = {};
      if (query.from) dateFilter.date.$gte = startOfDay(query.from);
      if (query.to) dateFilter.date.$lte = startOfDay(query.to);
    }

    const [dates, weekdays] = await Promise.all([
      this.blockedDateRepository.findAll(dateFilter),
      this.blockedWeekdayRepository.findAll(),
    ]);

    return [
      ...weekdays.map((item) => this.serializeWeekdayBlock(item)),
      ...dates.map((item) => this.serializeDateBlock(item)),
    ];
  }

  async createBlocked(data, user) {
    if (!['holiday', 'unavailable'].includes(data.type)) {
      throw httpError('type must be holiday or unavailable');
    }

    const hasWeekday = data.weekday !== undefined && data.weekday !== null && data.weekday !== '';
    const hasDate = Boolean(data.date);

    if (hasWeekday === hasDate) {
      throw httpError('Provide either a specific date or a weekday to block');
    }

    if (hasWeekday) {
      const weekday = Number(data.weekday);
      if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
        throw httpError('weekday must be 0 (Sunday) through 6 (Saturday)');
      }

      const existing = await this.blockedWeekdayRepository.findByWeekday(weekday);
      if (existing) {
        throw httpError(`${this.weekdayLabel(weekday)} is already blocked every week`);
      }

      try {
        const created = await this.blockedWeekdayRepository.create({
          weekday,
          type: data.type,
          reason: data.reason || '',
          createdBy: user?._id || null,
        });
        return this.serializeWeekdayBlock(created);
      } catch (error) {
        if (error.code === 11000) {
          throw httpError(`${this.weekdayLabel(weekday)} is already blocked every week`);
        }
        throw error;
      }
    }

    const day = startOfDay(data.date);
    if (!day) throw httpError('Valid date is required');

    const existing = await this.blockedDateRepository.findByDate(day);
    if (existing) throw httpError('This date is already marked unavailable');

    try {
      const created = await this.blockedDateRepository.create({
        date: day,
        type: data.type,
        reason: data.reason || '',
        createdBy: user?._id || null,
      });
      return this.serializeDateBlock(created);
    } catch (error) {
      if (error.code === 11000) throw httpError('This date is already marked unavailable');
      throw error;
    }
  }

  async deleteBlocked(id) {
    const deletedDate = await this.blockedDateRepository.deleteById(id);
    if (deletedDate) return { message: 'Blocked date removed' };

    const deletedWeekday = await this.blockedWeekdayRepository.deleteById(id);
    if (deletedWeekday) return { message: 'Blocked weekday removed' };

    throw httpError('Blocked entry not found', 404);
  }

  applyWeekdayBlocks(unavailableMap, weekdays, from, to) {
    if (!weekdays.length) return;

    const byWeekday = new Map(weekdays.map((item) => [item.weekday, item]));
    let cursor = startOfDay(from);
    const end = startOfDay(to);

    while (cursor && cursor <= end) {
      const blocked = byWeekday.get(cursor.getUTCDay());
      if (blocked) {
        const key = toDateKey(cursor);
        if (!unavailableMap.has(key)) {
          unavailableMap.set(key, {
            date: key,
            reason: blocked.type,
            label:
              blocked.reason ||
              `Every ${this.weekdayLabel(blocked.weekday)}${
                blocked.type === 'holiday' ? ' (holiday)' : ''
              }`,
            id: blocked._id,
            recurring: true,
          });
        }
      }
      cursor = addUtcDays(cursor, 1);
    }
  }

  async getAvailability(query = {}) {
    const minDate = this.getMinBookableDate();
    const from = startOfDay(query.from) || minDate;
    const to = startOfDay(query.to) || addUtcDays(from, 90);

    const [blocked, weekdays, bookedDocs] = await Promise.all([
      this.blockedDateRepository.findInRange(from, to),
      this.blockedWeekdayRepository.findAll(),
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

    this.applyWeekdayBlocks(unavailableMap, weekdays, from, to);

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
      blockedWeekdays: weekdays.map((item) => this.serializeWeekdayBlock(item)),
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

    const weekdayBlock = await this.blockedWeekdayRepository.findByWeekday(day.getUTCDay());
    if (weekdayBlock) {
      throw httpError(
        weekdayBlock.type === 'holiday'
          ? `${this.weekdayLabel(weekdayBlock.weekday)} is a holiday every week`
          : `${this.weekdayLabel(weekdayBlock.weekday)} is not available for booking`
      );
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
