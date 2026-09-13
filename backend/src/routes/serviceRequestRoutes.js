const express = require('express');
const { upload } = require('../middleware/upload');

function createServiceRequestRoutes(serviceRequestController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = [requireAuth, requireRoles('super_admin', 'admin', 'service_manager', 'customer_support')];

  router.post('/', requireAuth, upload.array('attachments', 5), serviceRequestController.create);
  router.get('/mine', requireAuth, serviceRequestController.listMine);
  router.get('/', ...staff, serviceRequestController.listAll);
  router.patch('/:id/cancel', requireAuth, serviceRequestController.cancel);
  router.patch('/:id/reschedule', requireAuth, serviceRequestController.reschedule);
  router.get('/:id', requireAuth, serviceRequestController.getById);
  router.patch('/:id/status', ...staff, serviceRequestController.updateStatus);
  router.post(
    '/:id/attachments',
    requireAuth,
    upload.array('attachments', 5),
    serviceRequestController.addAttachments
  );

  return router;
}

module.exports = createServiceRequestRoutes;
