const express = require('express');

function createBackupRoutes(backupController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin')];

  router.get('/', ...admin, backupController.list);
  router.post('/run', ...admin, backupController.run);
  router.post('/:id/restore', ...admin, backupController.restore);

  return router;
}

module.exports = createBackupRoutes;
