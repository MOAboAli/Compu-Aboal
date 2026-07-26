const { httpError } = require('../utils/httpError');

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80';

function emptyHome() {
  return {
    heroTitle: '',
    heroTitleAr: '',
    heroText: '',
    heroTextAr: '',
    heroKicker: '',
    heroKickerAr: '',
    heroImage: DEFAULT_HERO_IMAGE,
    about: '',
    aboutAr: '',
    promotions: [],
    testimonials: [],
    news: [],
    contact: {
      phone: '',
      email: '',
      address: '',
      intro: '',
      introAr: '',
    },
    footer: {
      street: '',
      streetAr: '',
      city: '',
      cityAr: '',
      aboutTitle: '',
      aboutTitleAr: '',
      aboutText: '',
      aboutTextAr: '',
      phone: '',
      email: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      github: '',
    },
  };
}

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

  shapeHome(block) {
    if (!block) return emptyHome();
    const meta = block.metadata || {};
    const defaults = emptyHome();
    return {
      _id: block._id,
      heroTitle: block.title || '',
      heroText: block.content || '',
      heroTitleAr: meta.heroTitleAr || '',
      heroTextAr: meta.heroTextAr || '',
      heroKicker: meta.heroKicker || '',
      heroKickerAr: meta.heroKickerAr || '',
      heroImage: meta.heroImage || DEFAULT_HERO_IMAGE,
      about: meta.about || '',
      aboutAr: meta.aboutAr || '',
      promotions: meta.promotions || [],
      testimonials: meta.testimonials || [],
      news: meta.news || [],
      contact: { ...defaults.contact, ...(meta.contact || {}) },
      footer: { ...defaults.footer, ...(meta.footer || {}) },
    };
  }

  async getHome() {
    const block = await this.cmsRepository.findByKey('home');
    return this.shapeHome(block);
  }

  async upsertHome(payload = {}) {
    const existing = await this.cmsRepository.findByKey('home');
    const current = this.shapeHome(existing);

    const data = {
      key: 'home',
      title: payload.heroTitle ?? current.heroTitle ?? 'Compu-Aboali',
      content: payload.heroText ?? current.heroText ?? '',
      type: 'page',
      status: 'active',
      metadata: {
        heroTitleAr: payload.heroTitleAr ?? current.heroTitleAr,
        heroTextAr: payload.heroTextAr ?? current.heroTextAr,
        heroKicker: payload.heroKicker ?? current.heroKicker,
        heroKickerAr: payload.heroKickerAr ?? current.heroKickerAr,
        heroImage: payload.heroImage ?? current.heroImage,
        about: payload.about ?? current.about,
        aboutAr: payload.aboutAr ?? current.aboutAr,
        promotions: payload.promotions ?? current.promotions,
        testimonials: payload.testimonials ?? current.testimonials,
        news: payload.news ?? current.news,
        contact: {
          ...current.contact,
          ...(payload.contact || {}),
        },
        footer: {
          ...current.footer,
          ...(payload.footer || {}),
        },
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
module.exports.DEFAULT_HERO_IMAGE = DEFAULT_HERO_IMAGE;
