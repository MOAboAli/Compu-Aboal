const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, default: '' },
    provider: { type: String, default: 'simulator' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
