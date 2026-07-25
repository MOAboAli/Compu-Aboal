function createAuditMiddleware(auditService) {
  return (action, resource) => async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode < 400 && auditService) {
        auditService
          .log({
            actor: req.user ? req.user._id : null,
            action,
            resource,
            resourceId: (req.params && (req.params.id || req.params.requestId)) || null,
            ip: req.ip,
            userAgent: req.get('user-agent') || '',
            details: { method: req.method, path: req.originalUrl },
          })
          .catch(() => {});
      }
      return originalJson(body);
    };
    next();
  };
}

function auditMiddleware(auditRepository) {
  return async (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      auditRepository
        .create({
          actor: req.user ? req.user._id : null,
          action: `${req.method} ${req.originalUrl}`,
          resource: (req.baseUrl || req.path || '').split('/')[2] || 'api',
          resourceId: req.params?.id || null,
          ip: req.ip,
          userAgent: req.get('user-agent') || '',
          details: { success: res.statusCode < 400, statusCode: res.statusCode },
        })
        .catch(() => {});
      return originalJson(body);
    };
    next();
  };
}

module.exports = createAuditMiddleware;
module.exports.createAuditMiddleware = createAuditMiddleware;
module.exports.auditMiddleware = auditMiddleware;
