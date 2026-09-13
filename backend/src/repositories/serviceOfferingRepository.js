class ServiceOfferingRepository {
  constructor(dbContext) {
    this.ServiceOffering = dbContext.ServiceOffering;
  }

  findAll(filter = {}) {
    return this.ServiceOffering.find(filter).sort({ name: 1 }).populate('category', 'name nameAr slug');
  }

  findById(id) {
    return this.ServiceOffering.findById(id).populate('category', 'name nameAr slug');
  }

  create(data) {
    return this.ServiceOffering.create(data);
  }

  updateById(id, data) {
    return this.ServiceOffering.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.ServiceOffering.findByIdAndDelete(id);
  }
}

module.exports = ServiceOfferingRepository;
