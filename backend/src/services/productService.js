const { httpError } = require('../utils/httpError');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async listProducts(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.featured === 'true') filter.featured = true;
    if (query.q) {
      filter.$or = [
        { name: new RegExp(query.q, 'i') },
        { sku: new RegExp(query.q, 'i') },
        { barcode: new RegExp(query.q, 'i') },
      ];
    }
    const limit = Number(query.limit) || 100;
    const skip = Number(query.skip) || 0;
    const [items, total] = await Promise.all([
      this.productRepository.findAll(filter, { limit, skip }),
      this.productRepository.count(filter),
    ]);
    return { items, total, limit, skip };
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw httpError('Product not found', 404);
    return product;
  }

  async createProduct(data) {
    if (data.sku) {
      const existing = await this.productRepository.findBySku(data.sku);
      if (existing) throw httpError('SKU already exists', 409);
    }
    return this.productRepository.create(data);
  }

  async updateProduct(id, data) {
    const product = await this.productRepository.updateById(id, data);
    if (!product) throw httpError('Product not found', 404);
    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.deleteById(id);
    if (!product) throw httpError('Product not found', 404);
    return { message: 'Product deleted' };
  }
}

module.exports = ProductService;
