class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  listProducts() {
    return this.productRepository.findAll();
  }

  getProductById(id) {
    return this.productRepository.findById(id);
  }

  createProduct(data) {
    return this.productRepository.create(data);
  }

  async updateProduct(id, data) {
    const product = await this.productRepository.updateById(id, data);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await this.productRepository.deleteById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Product deleted' };
  }
}

module.exports = ProductService;
