const express = require('express');
const { upload } = require('../middleware/upload');

function createServiceRequestRoutes(serviceRequestController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = requireRoles('super_admin', 'admin', 'service_manager', 'customer_support');

  router.use(requireAuth);
  router.post('/', upload.array('attachments', 5), serviceRequestController.create);
  router.get('/mine', serviceRequestController.listMine);
  router.get('/', staff, serviceRequestController.listAll);
  router.get('/:id', serviceRequestController.getById);
  router.patch('/:id/status', staff, serviceRequestController.updateStatus);
  router.post(
    '/:id/attachments',
    upload.array('attachments', 5),
    serviceRequestController.addAttachments
  );

  return router;
}

module.exports = createServiceRequestRoutes;
