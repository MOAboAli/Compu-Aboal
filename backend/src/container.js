const dbContext = require('./context/dbContext');
const { requireAuth, requireRoles } = require('./middleware/auth');
const createAuditMiddleware = require('./middleware/audit');
const { auditMiddleware } = createAuditMiddleware;

const PaymentSimulator = require('./adapters/paymentSimulator');
const SmsSimulator = require('./adapters/smsSimulator');
const EmailSimulator = require('./adapters/emailSimulator');

const UserRepository = require('./repositories/userRepository');
const CategoryRepository = require('./repositories/categoryRepository');
const ProductRepository = require('./repositories/productRepository');
const CartRepository = require('./repositories/cartRepository');
const WishlistRepository = require('./repositories/wishlistRepository');
const OrderRepository = require('./repositories/orderRepository');
const ServiceCategoryRepository = require('./repositories/serviceCategoryRepository');
const ServiceOfferingRepository = require('./repositories/serviceOfferingRepository');
const ServiceRequestRepository = require('./repositories/serviceRequestRepository');
const CmsRepository = require('./repositories/cmsRepository');
const PaymentMethodRepository = require('./repositories/paymentMethodRepository');
const NotificationRepository = require('./repositories/notificationRepository');
const AuditRepository = require('./repositories/auditRepository');
const ReportRepository = require('./repositories/reportRepository');
const BackupRepository = require('./repositories/backupRepository');

const AuthService = require('./services/authService');
const UserService = require('./services/userService');
const CategoryService = require('./services/categoryService');
const ProductService = require('./services/productService');
const CartService = require('./services/cartService');
const WishlistService = require('./services/wishlistService');
const OrderService = require('./services/orderService');
const ServiceService = require('./services/serviceService');
const ServiceRequestService = require('./services/serviceRequestService');
const CmsService = require('./services/cmsService');
const PaymentService = require('./services/paymentService');
const NotificationService = require('./services/notificationService');
const ReportService = require('./services/reportService');
const AuditService = require('./services/auditService');
const BackupService = require('./services/backupService');
const AdminService = require('./services/adminService');

const AuthController = require('./controllers/authController');
const UserController = require('./controllers/userController');
const CategoryController = require('./controllers/categoryController');
const ProductController = require('./controllers/productController');
const CartController = require('./controllers/cartController');
const WishlistController = require('./controllers/wishlistController');
const OrderController = require('./controllers/orderController');
const ServiceController = require('./controllers/serviceController');
const ServiceRequestController = require('./controllers/serviceRequestController');
const CmsController = require('./controllers/cmsController');
const PaymentController = require('./controllers/paymentController');
const NotificationController = require('./controllers/notificationController');
const ReportController = require('./controllers/reportController');
const AuditController = require('./controllers/auditController');
const BackupController = require('./controllers/backupController');
const AdminController = require('./controllers/adminController');

const userRepository = new UserRepository(dbContext);
const categoryRepository = new CategoryRepository(dbContext);
const productRepository = new ProductRepository(dbContext);
const cartRepository = new CartRepository(dbContext);
const wishlistRepository = new WishlistRepository(dbContext);
const orderRepository = new OrderRepository(dbContext);
const serviceCategoryRepository = new ServiceCategoryRepository(dbContext);
const serviceOfferingRepository = new ServiceOfferingRepository(dbContext);
const serviceRequestRepository = new ServiceRequestRepository(dbContext);
const cmsRepository = new CmsRepository(dbContext);
const paymentMethodRepository = new PaymentMethodRepository(dbContext);
const notificationRepository = new NotificationRepository(dbContext);
const auditRepository = new AuditRepository(dbContext);
const reportRepository = new ReportRepository(dbContext);
const backupRepository = new BackupRepository(dbContext);

const paymentSimulator = new PaymentSimulator();
const smsSimulator = new SmsSimulator(notificationRepository);
const emailSimulator = new EmailSimulator(notificationRepository);

const authService = new AuthService({ userRepository, emailSimulator, smsSimulator });
const userService = new UserService(userRepository);
const categoryService = new CategoryService(categoryRepository);
const productService = new ProductService(productRepository);
const cartService = new CartService({ cartRepository, productRepository });
const wishlistService = new WishlistService({ wishlistRepository, productRepository });
const orderService = new OrderService({
  orderRepository,
  cartRepository,
  productRepository,
  paymentMethodRepository,
  paymentSimulator,
  emailSimulator,
  smsSimulator,
});
const serviceService = new ServiceService({
  serviceCategoryRepository,
  serviceOfferingRepository,
});
const serviceRequestService = new ServiceRequestService({
  serviceRequestRepository,
  emailSimulator,
});
const cmsService = new CmsService(cmsRepository);
const paymentService = new PaymentService(paymentMethodRepository);
const notificationService = new NotificationService(notificationRepository);
const reportService = new ReportService(reportRepository);
const auditService = new AuditService(auditRepository);
const backupService = new BackupService(backupRepository);
const adminService = new AdminService({
  orderRepository,
  productRepository,
  userRepository,
  serviceRequestRepository,
});

const authController = new AuthController(authService);
const userController = new UserController(userService);
const categoryController = new CategoryController(categoryService);
const productController = new ProductController(productService);
const cartController = new CartController(cartService);
const wishlistController = new WishlistController(wishlistService);
const orderController = new OrderController(orderService);
const serviceController = new ServiceController(serviceService);
const serviceRequestController = new ServiceRequestController(serviceRequestService);
const cmsController = new CmsController(cmsService);
const paymentController = new PaymentController(paymentService);
const notificationController = new NotificationController(notificationService);
const reportController = new ReportController(reportService);
const auditController = new AuditController(auditService);
const backupController = new BackupController(backupService);
const adminController = new AdminController(adminService);

const auth = requireAuth(dbContext);
const audit = createAuditMiddleware(auditService);

module.exports = {
  dbContext,
  middleware: {
    requireAuth: auth,
    requireRoles,
    audit,
    requestAudit: auditMiddleware(auditRepository),
  },
  adapters: { paymentSimulator, smsSimulator, emailSimulator },
  controllers: {
    authController,
    userController,
    categoryController,
    productController,
    cartController,
    wishlistController,
    orderController,
    serviceController,
    serviceRequestController,
    cmsController,
    paymentController,
    notificationController,
    reportController,
    auditController,
    backupController,
    adminController,
  },
};
