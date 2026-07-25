class AuditService {
  constructor(auditRepository) {
    this.auditRepository = auditRepository;
  }

  log(entry) {
    return this.auditRepository.create(entry);
  }

  list(query = {}) {
    const filter = {};
    if (query.action) filter.action = query.action;
    if (query.module) filter.module = query.module;
    if (query.user) filter.user = query.user;
    return this.auditRepository.findAll(filter);
  }

  export() {
    return this.list({}).then((items) => ({
      simulated: true,
      format: 'csv',
      message: 'Audit export ready (simulated)',
      count: items.length,
      items,
    }));
  }
}

module.exports = AuditService;
