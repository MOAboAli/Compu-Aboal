const { httpError } = require('../utils/httpError');
const { orderNumber, invoiceNumber } = require('../utils/ids');
const { ORDER_STATUSES } = require('../models/Order');

class OrderService {
  constructor({
    orderRepository,
    cartRepository,
    productRepository,
    paymentMethodRepository,
    paymentSimulator,
    emailSimulator,
    smsSimulator,
  }) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.paymentMethodRepository = paymentMethodRepository;
    this.paymentSimulator = paymentSimulator;
    this.emailSimulator = emailSimulator;
    this.smsSimulator = smsSimulator;
  }

  async checkout(user, { shippingAddress, paymentMethodId, notes = '' }) {
    const cart = await this.cartRepository.findByUser(user._id);
    if (!cart || !cart.items.length) throw httpError('Cart is empty');

    const items = [];
    let subtotal = 0;
    for (const line of cart.items) {
      const product = await this.productRepository.findById(line.product._id || line.product);
      if (!product || product.status !== 'active') {
        throw httpError(`Product unavailable: ${line.product}`);
      }
      if (product.stock < line.quantity) {
        throw httpError(`Insufficient stock for ${product.name}`);
      }
      const unitPrice = product.discountPrice != null ? product.discountPrice : product.price;
      const lineTotal = unitPrice * line.quantity;
      subtotal += lineTotal;
      items.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: line.quantity,
        unitPrice,
        lineTotal,
      });
    }

    const shipping = 0;
    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const total = subtotal + shipping + tax;

    const order = await this.orderRepository.create({
      orderNumber: orderNumber(),
      user: user._id,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: 'Pending',
      paymentMethod: paymentMethodId || null,
      shippingAddress: shippingAddress || {},
      notes,
    });

    for (const line of items) {
      const product = await this.productRepository.findById(line.product);
      await this.productRepository.updateById(line.product, {
        stock: Math.max(0, product.stock - line.quantity),
      });
    }

    await this.cartRepository.clear(user._id);
    return this.orderRepository.findById(order._id);
  }

  async pay(orderId, user, body = {}) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw httpError('Order not found', 404);

    const isAdmin = ['super_admin', 'admin', 'sales_manager', 'customer_support'].includes(user.role);
    if (!isAdmin && String(order.user._id || order.user) !== String(user._id)) {
      throw httpError('Forbidden', 403);
    }
    if (order.status !== 'Pending') throw httpError('Order is not payable');

    let methodCode = (body.method || body.methodCode || 'SIM').toUpperCase();
    if (order.paymentMethod) {
      const method = await this.paymentMethodRepository.findById(
        order.paymentMethod._id || order.paymentMethod
      );
      if (method) methodCode = method.code;
    } else if (body.method) {
      const methods = await this.paymentMethodRepository.findAll({ isActive: true });
      const matched = methods.find(
        (m) => m.code === methodCode || m.code.toLowerCase() === String(body.method).toLowerCase()
      );
      if (matched) {
        methodCode = matched.code;
        await this.orderRepository.updateById(orderId, { paymentMethod: matched._id });
      }
    }

    const payment = await this.paymentSimulator.charge({
      amount: order.total,
      methodCode,
      orderNumber: order.orderNumber,
    });

    const updated = await this.orderRepository.updateById(orderId, {
      status: 'Paid',
      invoiceNumber: invoiceNumber(),
      paidAt: payment.paidAt,
    });

    await this.emailSimulator.send({
      to: order.user.email || user.email,
      subject: `Payment received – ${order.orderNumber}`,
      body: `Your order ${order.orderNumber} is Paid. Invoice: ${updated.invoiceNumber}. Ref: ${payment.reference}`,
      userId: order.user._id || order.user,
      type: 'order_paid',
      meta: { orderId, payment },
    });

    if (order.user.phone || user.phone) {
      await this.smsSimulator.send({
        to: order.user.phone || user.phone,
        body: `Order ${order.orderNumber} paid. Invoice ${updated.invoiceNumber}`,
        userId: order.user._id || order.user,
        type: 'order_paid',
        meta: { orderId },
      });
    }

    return updated;
  }

  async listMine(userId) {
    return this.orderRepository.findByUser(userId);
  }

  async listAll(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.user) filter.user = query.user;
    return this.orderRepository.findAll(filter);
  }

  async getById(id, user) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw httpError('Order not found', 404);
    const isAdmin = ['super_admin', 'admin', 'sales_manager', 'customer_support'].includes(user.role);
    if (!isAdmin && String(order.user._id || order.user) !== String(user._id)) {
      throw httpError('Forbidden', 403);
    }
    return order;
  }

  async updateStatus(id, status) {
    if (!ORDER_STATUSES.includes(status)) throw httpError('Invalid status');
    const order = await this.orderRepository.updateById(id, { status });
    if (!order) throw httpError('Order not found', 404);
    return order;
  }
}

module.exports = OrderService;
