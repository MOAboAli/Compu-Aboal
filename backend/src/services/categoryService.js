const { httpError } = require('../utils/httpError');
const { slugify } = require('../utils/ids');

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  list(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.parent === 'null') filter.parent = null;
    else if (query.parent) filter.parent = query.parent;
    return this.categoryRepository.findAll(filter);
  }

  async getById(id) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw httpError('Category not found', 404);
    return category;
  }

  async create(data) {
    const slug = data.slug || slugify(data.name);
    return this.categoryRepository.create({ ...data, slug });
  }

  async update(id, data) {
    const payload = { ...data };
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name);
    const category = await this.categoryRepository.updateById(id, payload);
    if (!category) throw httpError('Category not found', 404);
    return category;
  }

  async remove(id) {
    const category = await this.categoryRepository.deleteById(id);
    if (!category) throw httpError('Category not found', 404);
    return { message: 'Category deleted' };
  }
}

module.exports = CategoryService;
