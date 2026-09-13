const mongoose = require('mongoose');

const blockedWeekdaySchema = new mongoose.Schema(
  {
    weekday: { type: Number, required: true, min: 0, max: 6, unique: true },
    type: { type: String, enum: ['holiday', 'unavailable'], required: true },
    reason: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlockedWeekday', blockedWeekdaySchema);
