const express = require('express');

function createCategoryRoutes(categoryController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin', 'sales_manager')];

  router.get('/', categoryController.list);
  router.get('/:id', categoryController.getById);
  router.post('/', ...admin, categoryController.create);
  router.put('/:id', ...admin, categoryController.update);
  router.delete('/:id', ...admin, categoryController.remove);

  return router;
}

module.exports = createCategoryRoutes;
