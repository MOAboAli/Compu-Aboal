const mongoose = require('mongoose');

const serviceOfferingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    type: { type: String, enum: ['site_survey', 'maintenance', 'other'], default: 'other' },
    description: { type: String, default: '' },
    basePrice: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceOffering', serviceOfferingSchema);
