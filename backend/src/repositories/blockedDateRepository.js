const { startOfDay, endOfDay } = require('../utils/dateOnly');

class BlockedDateRepository {
  constructor(dbContext) {
    this.BlockedDate = dbContext.BlockedDate;
  }

  findAll(filter = {}) {
    return this.BlockedDate.find(filter).sort({ date: 1 });
  }

  findInRange(from, to) {
    return this.BlockedDate.find({
      date: { $gte: startOfDay(from), $lte: startOfDay(to) },
    }).sort({ date: 1 });
  }

  findByDate(date) {
    return this.BlockedDate.findOne({ date: startOfDay(date) });
  }

  create(data) {
    return this.BlockedDate.create({
      ...data,
      date: startOfDay(data.date),
    });
  }

  deleteById(id) {
    return this.BlockedDate.findByIdAndDelete(id);
  }
}

module.exports = BlockedDateRepository;
