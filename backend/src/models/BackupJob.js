const mongoose = require('mongoose');

const backupJobSchema = new mongoose.Schema(
  {
    jobNumber: { type: String, required: true, unique: true },
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['pending', 'running', 'completed', 'failed', 'restored'], default: 'pending' },
    type: { type: String, enum: ['manual', 'scheduled'], default: 'manual' },
    fileName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
    collections: [{ type: String }],
    notes: { type: String, default: '' },
    completedAt: { type: Date, default: null },
    restoredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BackupJob', backupJobSchema);
