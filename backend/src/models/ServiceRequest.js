const mongoose = require('mongoose');

const SERVICE_REQUEST_STATUSES = [
  'Submitted',
  'Under Review',
  'Scheduled',
  'In Progress',
  'Completed',
  'Closed',
];

const serviceRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestName: { type: String, default: '' },
    guestEmail: { type: String, default: '' },
    offering: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceOffering', default: null },
    type: { type: String, enum: ['site_survey', 'maintenance'], required: true },
    status: { type: String, enum: SERVICE_REQUEST_STATUSES, default: 'Submitted' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    preferredDate: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    address: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'Egypt' },
    },
    contactPhone: { type: String, default: '' },
    attachments: [{ type: String }],
    notes: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports.SERVICE_REQUEST_STATUSES = SERVICE_REQUEST_STATUSES;
