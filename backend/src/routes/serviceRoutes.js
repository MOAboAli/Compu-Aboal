const express = require('express');

function createServiceRoutes(serviceController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin', 'service_manager')];

  router.get('/categories', serviceController.listCategories);
  router.post('/categories', ...admin, serviceController.createCategory);
  router.put('/categories/:id', ...admin, serviceController.updateCategory);
  router.delete('/categories/:id', ...admin, serviceController.deleteCategory);

  router.get('/offerings', serviceController.listOfferings);
  router.get('/offerings/:id', serviceController.getOffering);
  router.post('/offerings', ...admin, serviceController.createOffering);
  router.put('/offerings/:id', ...admin, serviceController.updateOffering);
  router.delete('/offerings/:id', ...admin, serviceController.deleteOffering);

  return router;
}

module.exports = createServiceRoutes;
