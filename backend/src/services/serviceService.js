const { httpError } = require('../utils/httpError');
const { slugify } = require('../utils/ids');

class ServiceService {
  constructor({ serviceCategoryRepository, serviceOfferingRepository }) {
    this.serviceCategoryRepository = serviceCategoryRepository;
    this.serviceOfferingRepository = serviceOfferingRepository;
  }

  listCategories(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    return this.serviceCategoryRepository.findAll(filter);
  }

  async createCategory(data) {
    return this.serviceCategoryRepository.create({
      ...data,
      slug: data.slug || slugify(data.name),
    });
  }

  async updateCategory(id, data) {
    const payload = { ...data };
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name);
    const category = await this.serviceCategoryRepository.updateById(id, payload);
    if (!category) throw httpError('Service category not found', 404);
    return category;
  }

  async deleteCategory(id) {
    const category = await this.serviceCategoryRepository.deleteById(id);
    if (!category) throw httpError('Service category not found', 404);
    return { message: 'Service category deleted' };
  }

  listOfferings(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;
    return this.serviceOfferingRepository.findAll(filter);
  }

  async getOffering(id) {
    const offering = await this.serviceOfferingRepository.findById(id);
    if (!offering) throw httpError('Service offering not found', 404);
    return offering;
  }

  async createOffering(data) {
    return this.serviceOfferingRepository.create({
      ...data,
      slug: data.slug || slugify(data.name),
    });
  }

  async updateOffering(id, data) {
    const payload = { ...data };
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name);
    const offering = await this.serviceOfferingRepository.updateById(id, payload);
    if (!offering) throw httpError('Service offering not found', 404);
    return offering;
  }

  async deleteOffering(id) {
    const offering = await this.serviceOfferingRepository.deleteById(id);
    if (!offering) throw httpError('Service offering not found', 404);
    return { message: 'Service offering deleted' };
  }
}

module.exports = ServiceService;
