const express = require('express');

function createCartRoutes(cartController, { requireAuth }) {
  const router = express.Router();

  router.use(requireAuth);
  router.get('/', cartController.get);
  router.post('/items', cartController.addItem);
  router.put('/items/:productId', cartController.updateItem);
  router.delete('/items/:productId', cartController.removeItem);
  router.delete('/', cartController.clear);

  return router;
}

module.exports = createCartRoutes;
