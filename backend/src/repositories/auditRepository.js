class AuditRepository {
  constructor(dbContext) {
    this.AuditLog = dbContext.AuditLog;
  }

  create(data) {
    return this.AuditLog.create(data);
  }

  findAll(filter = {}) {
    return this.search(filter);
  }

  search({ action, resource, actor, module, user, from, to, limit = 100 } = {}) {
    if (module) resource = module;
    if (user) actor = user;
    const filter = {};
    if (action) filter.action = new RegExp(action, 'i');
    if (resource) filter.resource = new RegExp(resource, 'i');
    if (actor) filter.actor = actor;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    return this.AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('actor', 'name email role');
  }
}

module.exports = AuditRepository;
