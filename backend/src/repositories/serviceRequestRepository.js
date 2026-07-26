class ServiceRequestRepository {
  constructor(dbContext) {
    this.ServiceRequest = dbContext.ServiceRequest;
  }

  create(data) {
    return this.ServiceRequest.create(data);
  }

  findById(id) {
    return this.ServiceRequest.findById(id)
      .populate('user', 'name email phone')
      .populate('offering', 'name type basePrice')
      .populate('assignedTo', 'name email');
  }

  findByUser(userId) {
    return this.ServiceRequest.find({ user: userId }).sort({ createdAt: -1 });
  }

  findAll(filter = {}) {
    return this.ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('offering', 'name type');
  }

  updateById(id, data) {
    return this.ServiceRequest.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('user', 'name email phone')
      .populate('offering', 'name type basePrice')
      .populate('assignedTo', 'name email');
  }

  findActiveOnDate(date) {
    const { startOfDay, endOfDay } = require('../utils/dateOnly');
    return this.ServiceRequest.find({
      preferredDate: { $gte: startOfDay(date), $lte: endOfDay(date) },
      status: { $nin: ['Closed'] },
    }).select('preferredDate status offering requestNumber');
  }

  findActivePreferredDatesInRange(from, to) {
    const { startOfDay, endOfDay } = require('../utils/dateOnly');
    return this.ServiceRequest.find({
      preferredDate: { $gte: startOfDay(from), $lte: endOfDay(to) },
      status: { $nin: ['Closed'] },
    }).select('preferredDate status');
  }

  aggregate(pipeline) {
    return this.ServiceRequest.aggregate(pipeline);
  }
}

module.exports = ServiceRequestRepository;
