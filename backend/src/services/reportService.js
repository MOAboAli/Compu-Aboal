class ReportService {
  constructor({ orderRepository, serviceRequestRepository, userRepository, productRepository }) {
    this.orderRepository = orderRepository;
    this.serviceRequestRepository = serviceRequestRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  async sales() {
    const orders = await this.orderRepository.findAll({});
    const paid = orders.filter((o) =>
      ['Paid', 'Processing', 'Shipped', 'Delivered'].includes(o.status)
    );
    const revenue = paid.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      totalOrders: orders.length,
      paidOrders: paid.length,
      revenue,
      byStatus: orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async services() {
    const requests = await this.serviceRequestRepository.findAll({});
    return {
      total: requests.length,
      byStatus: requests.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {}),
      byType: requests.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async users() {
    const users = await this.userRepository.findAll({});
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      byRole: users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async export(type, format = 'csv') {
    const data =
      type === 'services'
        ? await this.services()
        : type === 'users'
          ? await this.users()
          : await this.sales();
    return {
      simulated: true,
      format,
      type,
      message: `Export generated as ${format.toUpperCase()} (simulated content)`,
      payload: data,
      downloadUrl: `/api/reports/${type}/export?format=${format}&download=1`,
    };
  }
}

module.exports = ReportService;
