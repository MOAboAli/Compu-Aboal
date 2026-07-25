class BackupRepository {
  constructor(dbContext) {
    this.BackupJob = dbContext.BackupJob;
  }

  create(data) {
    return this.BackupJob.create(data);
  }

  findAll() {
    return this.BackupJob.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return this.BackupJob.findById(id);
  }

  updateById(id, data) {
    return this.BackupJob.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

module.exports = BackupRepository;
