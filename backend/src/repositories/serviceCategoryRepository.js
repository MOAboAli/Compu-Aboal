class ServiceCategoryRepository {
  constructor(dbContext) {
    this.ServiceCategory = dbContext.ServiceCategory;
  }

  findAll(filter = {}) {
    return this.ServiceCategory.find(filter).sort({ name: 1 });
  }

  findById(id) {
    return this.ServiceCategory.findById(id);
  }

  create(data) {
    return this.ServiceCategory.create(data);
  }

  updateById(id, data) {
    return this.ServiceCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.ServiceCategory.findByIdAndDelete(id);
  }
}

module.exports = ServiceCategoryRepository;
