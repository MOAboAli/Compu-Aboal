class OrderRepository {
  constructor(dbContext) {
    this.Order = dbContext.Order;
  }

  create(data) {
    return this.Order.create(data);
  }

  findById(id) {
    return this.Order.findById(id)
      .populate('user', 'name email phone')
      .populate('paymentMethod', 'name code')
      .populate('items.product', 'name sku featuredImage');
  }

  findByUser(userId) {
    return this.Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  findAll(filter = {}) {
    return this.Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('paymentMethod', 'name code');
  }

  updateById(id, data) {
    return this.Order.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('user', 'name email phone')
      .populate('paymentMethod', 'name code');
  }

  aggregate(pipeline) {
    return this.Order.aggregate(pipeline);
  }

  count(filter = {}) {
    return this.Order.countDocuments(filter);
  }
}

module.exports = OrderRepository;
