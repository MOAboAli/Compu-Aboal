class AdminService {
  constructor({ orderRepository, productRepository, userRepository, serviceRequestRepository }) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.serviceRequestRepository = serviceRequestRepository;
  }

  async dashboard() {
    const [orders, products, users, serviceRequests] = await Promise.all([
      this.orderRepository.findAll({}),
      this.productRepository.findAll({}, { limit: 10000 }),
      this.userRepository.findAll({}),
      this.serviceRequestRepository.findAll({}),
    ]);
    return {
      orders: orders.length,
      products: products.length,
      users: users.length,
      serviceRequests: serviceRequests.length,
    };
  }
}

module.exports = AdminService;
