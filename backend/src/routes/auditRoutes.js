const express = require('express');

function createAuditRoutes(auditController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin')];

  router.get('/', ...admin, auditController.list);
  router.get('/export', ...admin, auditController.export);

  return router;
}

module.exports = createAuditRoutes;
