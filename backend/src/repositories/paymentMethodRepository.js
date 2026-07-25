class PaymentMethodRepository {
  constructor(dbContext) {
    this.PaymentMethod = dbContext.PaymentMethod;
  }

  findAll(filter = {}) {
    return this.PaymentMethod.find(filter).sort({ sortOrder: 1, name: 1 });
  }

  findById(id) {
    return this.PaymentMethod.findById(id);
  }

  findByCode(code) {
    return this.PaymentMethod.findOne({ code: String(code).toUpperCase() });
  }

  create(data) {
    return this.PaymentMethod.create(data);
  }

  updateById(id, data) {
    return this.PaymentMethod.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.PaymentMethod.findByIdAndDelete(id);
  }
}

module.exports = PaymentMethodRepository;
