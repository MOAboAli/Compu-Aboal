class CmsRepository {
  constructor(dbContext) {
    this.CmsBlock = dbContext.CmsBlock;
  }

  findAll(filter = {}) {
    return this.CmsBlock.find(filter).sort({ key: 1 });
  }

  findById(id) {
    return this.CmsBlock.findById(id);
  }

  findByKey(key) {
    return this.CmsBlock.findOne({ key });
  }

  create(data) {
    return this.CmsBlock.create(data);
  }

  updateById(id, data) {
    return this.CmsBlock.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.CmsBlock.findByIdAndDelete(id);
  }
}

module.exports = CmsRepository;
