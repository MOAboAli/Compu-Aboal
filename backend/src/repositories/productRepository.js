class ProductRepository {
  constructor(dbContext) {
    this.Product = dbContext.Product;
  }

  findAll(filter = {}, { limit = 100, skip = 0 } = {}) {
    return this.Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name nameAr slug')
      .populate('subcategory', 'name nameAr slug');
  }

  findById(id) {
    return this.Product.findById(id)
      .populate('category', 'name nameAr slug')
      .populate('subcategory', 'name nameAr slug');
  }

  findBySku(sku) {
    return this.Product.findOne({ sku });
  }

  create(data) {
    return this.Product.create(data);
  }

  updateById(id, data) {
    return this.Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('category', 'name nameAr slug')
      .populate('subcategory', 'name nameAr slug');
  }

  deleteById(id) {
    return this.Product.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.Product.countDocuments(filter);
  }
}

module.exports = ProductRepository;
