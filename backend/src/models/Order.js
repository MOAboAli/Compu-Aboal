const mongoose = require('mongoose');

const ORDER_STATUSES = [
  'Pending',
  'Paid',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded',
];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending' },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', default: null },
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'Saudi Arabia' },
    },
    paidAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
