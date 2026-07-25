const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    nameAr: { type: String, default: '', trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
