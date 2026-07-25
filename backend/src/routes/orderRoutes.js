const express = require('express');

function createOrderRoutes(orderController, { requireAuth, requireRoles }) {
  const router = express.Router();
  const staff = requireRoles('super_admin', 'admin', 'sales_manager', 'customer_support');

  router.use(requireAuth);
  router.post('/checkout', orderController.checkout);
  router.get('/mine', orderController.listMine);
  router.get('/', staff, orderController.listAll);
  router.get('/:id', orderController.getById);
  router.post('/:id/pay', orderController.pay);
  router.patch('/:id/status', staff, orderController.updateStatus);

  return router;
}

module.exports = createOrderRoutes;
