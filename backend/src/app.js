const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const createAuthRoutes = require('./routes/authRoutes');
const createUserRoutes = require('./routes/userRoutes');
const createCategoryRoutes = require('./routes/categoryRoutes');
const createProductRoutes = require('./routes/productRoutes');
const createCartRoutes = require('./routes/cartRoutes');
const createWishlistRoutes = require('./routes/wishlistRoutes');
const createOrderRoutes = require('./routes/orderRoutes');
const createServiceRoutes = require('./routes/serviceRoutes');
const createServiceRequestRoutes = require('./routes/serviceRequestRoutes');
const createCmsRoutes = require('./routes/cmsRoutes');
const createPaymentRoutes = require('./routes/paymentRoutes');
const createNotificationRoutes = require('./routes/notificationRoutes');
const createReportRoutes = require('./routes/reportRoutes');
const createAuditRoutes = require('./routes/auditRoutes');
const createBackupRoutes = require('./routes/backupRoutes');
const createAdminRoutes = require('./routes/adminRoutes');

function createApp({ controllers, middleware }) {
  const app = express();
  const { requireAuth, optionalAuth, requireRoles, requestAudit } = middleware;

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  if (requestAudit) app.use(requestAudit);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'compu-aboali-api' });
  });

  app.use('/api/auth', createAuthRoutes(controllers.authController, { requireAuth }));
  app.use('/api/users', createUserRoutes(controllers.userController, { requireAuth, requireRoles }));
  app.use(
    '/api/categories',
    createCategoryRoutes(controllers.categoryController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/products',
    createProductRoutes(controllers.productController, { requireAuth, requireRoles })
  );
  app.use('/api/cart', createCartRoutes(controllers.cartController, { requireAuth }));
  app.use('/api/wishlist', createWishlistRoutes(controllers.wishlistController, { requireAuth }));
  app.use(
    '/api/orders',
    createOrderRoutes(controllers.orderController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/services',
    createServiceRoutes(controllers.serviceController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/service-requests',
    createServiceRequestRoutes(controllers.serviceRequestController, {
      requireAuth,
      optionalAuth,
      requireRoles,
    })
  );
  app.use('/api/cms', createCmsRoutes(controllers.cmsController, { requireAuth, requireRoles }));
  app.use(
    '/api/payments',
    createPaymentRoutes(controllers.paymentController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/notifications',
    createNotificationRoutes(controllers.notificationController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/reports',
    createReportRoutes(controllers.reportController, { requireAuth, requireRoles })
  );
  app.use('/api/audit', createAuditRoutes(controllers.auditController, { requireAuth, requireRoles }));
  app.use(
    '/api/backups',
    createBackupRoutes(controllers.backupController, { requireAuth, requireRoles })
  );
  app.use(
    '/api/admin',
    createAdminRoutes(controllers.adminController, { requireAuth, requireRoles })
  );

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  });

  return app;
}

module.exports = createApp;
