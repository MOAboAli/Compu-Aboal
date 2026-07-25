const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    channel: { type: String, enum: ['email', 'sms', 'in_app', 'system'], required: true },
    type: { type: String, required: true, trim: true },
    subject: { type: String, default: '' },
    body: { type: String, required: true },
    to: { type: String, default: '' },
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'sent' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
