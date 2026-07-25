class ProductRepository {
  constructor(dbContext) {
    this.Product = dbContext.Product;
  }

  findAll() {
    return this.Product.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return this.Product.findById(id);
  }

  create(data) {
    return this.Product.create(data);
  }

  updateById(id, data) {
    return this.Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  deleteById(id) {
    return this.Product.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;
