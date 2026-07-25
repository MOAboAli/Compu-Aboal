const express = require('express');

function createAdminRoutes(adminController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = [
    requireAuth,
    requireRoles('super_admin', 'admin', 'service_manager', 'sales_manager', 'customer_support'),
  ];

  router.get('/dashboard', ...staff, adminController.dashboard);

  return router;
}

module.exports = createAdminRoutes;
