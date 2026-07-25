const { httpError } = require('../utils/httpError');

class CmsService {
  constructor(cmsRepository) {
    this.cmsRepository = cmsRepository;
  }

  list(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;
    if (query.locale) filter.locale = query.locale;
    return this.cmsRepository.findAll(filter);
  }

  async getHome() {
    const block = await this.cmsRepository.findByKey('home');
    if (!block) {
      return {
        heroTitle: '',
        heroText: '',
        about: '',
        promotions: [],
        testimonials: [],
        news: [],
        contact: {},
      };
    }
    return {
      _id: block._id,
      heroTitle: block.title,
      heroText: block.content,
      ...(block.metadata || {}),
    };
  }

  async upsertHome(payload) {
    const existing = await this.cmsRepository.findByKey('home');
    const data = {
      key: 'home',
      title: payload.heroTitle || 'Compu-Aboali',
      content: payload.heroText || '',
      type: 'page',
      status: 'active',
      metadata: {
        about: payload.about || '',
        promotions: payload.promotions || [],
        testimonials: payload.testimonials || [],
        news: payload.news || [],
        contact: payload.contact || {},
      },
    };
    if (existing) {
      await this.cmsRepository.updateById(existing._id, data);
      return this.getHome();
    }
    await this.cmsRepository.create(data);
    return this.getHome();
  }

  async getByKey(key) {
    if (key === 'home') return this.getHome();
    const block = await this.cmsRepository.findByKey(key);
    if (!block) throw httpError('CMS block not found', 404);
    return block;
  }

  async getById(id) {
    const block = await this.cmsRepository.findById(id);
    if (!block) throw httpError('CMS block not found', 404);
    return block;
  }

  create(data) {
    return this.cmsRepository.create(data);
  }

  async update(id, data) {
    const block = await this.cmsRepository.updateById(id, data);
    if (!block) throw httpError('CMS block not found', 404);
    return block;
  }

  async remove(id) {
    const block = await this.cmsRepository.deleteById(id);
    if (!block) throw httpError('CMS block not found', 404);
    return { message: 'CMS block deleted' };
  }
}

module.exports = CmsService;
