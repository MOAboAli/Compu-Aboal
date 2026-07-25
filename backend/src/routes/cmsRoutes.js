const express = require('express');

function createCmsRoutes(cmsController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin')];

  router.get('/', cmsController.list);
  router.put('/', ...admin, cmsController.upsertHome);
  router.get('/key/:key', cmsController.getByKey);
  router.get('/:id', cmsController.getById);
  router.post('/', ...admin, cmsController.create);
  router.put('/:id', ...admin, cmsController.update);
  router.delete('/:id', ...admin, cmsController.remove);

  return router;
}

module.exports = createCmsRoutes;
