const mongoose = require('mongoose');

const cmsBlockSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    type: { type: String, enum: ['page', 'banner', 'faq', 'policy', 'other'], default: 'page' },
    locale: { type: String, default: 'en' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CmsBlock', cmsBlockSchema);
