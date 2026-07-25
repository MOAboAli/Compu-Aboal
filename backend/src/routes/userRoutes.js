const express = require('express');

function createUserRoutes(userController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin')];

  router.get('/', ...admin, userController.list);
  router.get('/:id', ...admin, userController.getById);
  router.post('/', ...admin, userController.create);
  router.put('/:id', ...admin, userController.update);
  router.patch('/:id/activate', ...admin, userController.activate);
  router.patch('/:id/deactivate', ...admin, userController.deactivate);
  router.patch('/:id/role', ...admin, userController.setRole);
  router.delete('/:id', ...admin, userController.remove);

  return router;
}

module.exports = createUserRoutes;
