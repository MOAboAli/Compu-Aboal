const express = require('express');
const rateLimit = require('express-rate-limit');

function createAuthRoutes(authController, { requireAuth }) {
  const router = express.Router();
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

  router.use(limiter);
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/verify-email', authController.verifyEmail);
  router.post('/verify-phone', authController.verifyPhone);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);
  router.get('/me', requireAuth, authController.me);

  return router;
}

module.exports = createAuthRoutes;
