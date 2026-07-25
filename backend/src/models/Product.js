const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    barcode: { type: String, trim: true, default: '' },
    manufacturerCode: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    shortDescription: { type: String, default: '' },
    detailedDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featuredImage: { type: String, default: '' },
    gallery: [{ type: String }],
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
