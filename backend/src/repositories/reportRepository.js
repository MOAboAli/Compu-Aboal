class ReportRepository {
  constructor(dbContext) {
    this.Order = dbContext.Order;
    this.ServiceRequest = dbContext.ServiceRequest;
    this.User = dbContext.User;
  }

  salesAggregate(pipeline) {
    return this.Order.aggregate(pipeline);
  }

  serviceAggregate(pipeline) {
    return this.ServiceRequest.aggregate(pipeline);
  }

  findOrders(filter) {
    return this.Order.find(filter).sort({ createdAt: -1 }).limit(100);
  }

  findServiceRequests(filter) {
    return this.ServiceRequest.find(filter).sort({ createdAt: -1 }).limit(100);
  }

  countUsers(filter = {}) {
    return this.User.countDocuments(filter);
  }

  findUsers(filter = {}) {
    return this.User.find(filter).sort({ createdAt: -1 });
  }
}

module.exports = ReportRepository;
