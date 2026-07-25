class CategoryRepository {
  constructor(dbContext) {
    this.Category = dbContext.Category;
  }

  findAll(filter = {}) {
    return this.Category.find(filter).sort({ sortOrder: 1, name: 1 }).populate('parent', 'name slug');
  }

  findById(id) {
    return this.Category.findById(id).populate('parent', 'name slug');
  }

  findBySlug(slug) {
    return this.Category.findOne({ slug });
  }

  create(data) {
    return this.Category.create(data);
  }

  updateById(id, data) {
    return this.Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.Category.findByIdAndDelete(id);
  }
}

module.exports = CategoryRepository;
