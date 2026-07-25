const express = require('express');

function createWishlistRoutes(wishlistController, { requireAuth }) {
  const router = express.Router();
  router.use(requireAuth);
  router.get('/', wishlistController.get);
  router.post('/items', wishlistController.add);
  router.delete('/items/:productId', wishlistController.remove);
  return router;
}

module.exports = createWishlistRoutes;
