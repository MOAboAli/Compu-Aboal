const express = require('express');
const { upload } = require('../middleware/upload');

function createProductRoutes(productController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin', 'sales_manager')];

  router.get('/', productController.list);
  router.get('/:id', productController.getById);
  router.post('/', ...admin, upload.single('featuredImage'), productController.create);
  router.put('/:id', ...admin, upload.single('featuredImage'), productController.update);
  router.delete('/:id', ...admin, productController.remove);

  return router;
}

module.exports = createProductRoutes;
