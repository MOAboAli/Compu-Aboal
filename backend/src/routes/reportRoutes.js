const express = require('express');

function createReportRoutes(reportController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = [requireAuth, requireRoles('super_admin', 'admin', 'sales_manager', 'service_manager')];

  router.get('/:type/export', ...staff, reportController.export);
  router.get('/:type', ...staff, reportController.get);

  return router;
}

module.exports = createReportRoutes;
