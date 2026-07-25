const express = require('express');

function createPaymentRoutes(paymentController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const admin = [requireAuth, requireRoles('super_admin', 'admin')];

  router.get('/methods', (req, res, next) => {
    if (!req.query.all) req.query.activeOnly = 'true';
    return paymentController.list(req, res, next);
  });
  router.post('/methods', ...admin, paymentController.create);
  router.put('/methods/:id', ...admin, paymentController.update);
  router.get('/', paymentController.list);
  router.get('/:id', paymentController.getById);
  router.post('/', ...admin, paymentController.create);
  router.put('/:id', ...admin, paymentController.update);
  router.delete('/:id', ...admin, paymentController.remove);

  return router;
}

module.exports = createPaymentRoutes;
