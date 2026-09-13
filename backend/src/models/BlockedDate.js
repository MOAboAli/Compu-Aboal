const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    type: { type: String, enum: ['holiday', 'unavailable'], required: true },
    reason: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlockedDate', blockedDateSchema);
