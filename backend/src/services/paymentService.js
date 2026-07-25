const { httpError } = require('../utils/httpError');

class PaymentService {
  constructor(paymentMethodRepository) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  list(query = {}) {
    const filter = {};
    if (query.activeOnly === 'true') filter.isActive = true;
    return this.paymentMethodRepository.findAll(filter);
  }

  async getById(id) {
    const method = await this.paymentMethodRepository.findById(id);
    if (!method) throw httpError('Payment method not found', 404);
    return method;
  }

  create(data) {
    return this.paymentMethodRepository.create({
      ...data,
      code: data.code ? String(data.code).toUpperCase() : undefined,
    });
  }

  async update(id, data) {
    const payload = { ...data };
    if (payload.code) payload.code = String(payload.code).toUpperCase();
    const method = await this.paymentMethodRepository.updateById(id, payload);
    if (!method) throw httpError('Payment method not found', 404);
    return method;
  }

  async remove(id) {
    const method = await this.paymentMethodRepository.deleteById(id);
    if (!method) throw httpError('Payment method not found', 404);
    return { message: 'Payment method deleted' };
  }
}

module.exports = PaymentService;
