const express = require('express');

function createNotificationRoutes(notificationController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = requireRoles('super_admin', 'admin', 'customer_support');

  router.use(requireAuth);
  router.get('/mine', notificationController.listMine);
  router.get('/', admin, notificationController.listAll);
  router.patch('/:id/read', notificationController.markRead);

  return router;
}

module.exports = createNotificationRoutes;
