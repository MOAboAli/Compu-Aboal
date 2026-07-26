class BlockedWeekdayRepository {
  constructor(dbContext) {
    this.BlockedWeekday = dbContext.BlockedWeekday;
  }

  findAll() {
    return this.BlockedWeekday.find({}).sort({ weekday: 1 });
  }

  findByWeekday(weekday) {
    return this.BlockedWeekday.findOne({ weekday: Number(weekday) });
  }

  create(data) {
    return this.BlockedWeekday.create(data);
  }

  deleteById(id) {
    return this.BlockedWeekday.findByIdAndDelete(id);
  }
}

module.exports = BlockedWeekdayRepository;
