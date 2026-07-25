class BackupService {
  constructor(backupRepository) {
    this.backupRepository = backupRepository;
  }

  list() {
    return this.backupRepository.findAll();
  }

  async run(userId = null) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return this.backupRepository.create({
      jobNumber: `BKP-${Date.now()}`,
      triggeredBy: userId,
      type: 'manual',
      status: 'completed',
      fileName: `backup-${stamp}.zip`,
      fileSize: Math.floor(Math.random() * 5_000_000) + 100_000,
      collections: ['users', 'products', 'orders', 'serviceRequests', 'auditLogs'],
      notes: 'Simulated ZIP archive metadata only',
      completedAt: new Date(),
    });
  }

  async restore(id) {
    const job = await this.backupRepository.findById(id);
    if (!job) {
      const err = new Error('Backup not found');
      err.statusCode = 404;
      throw err;
    }
    await this.backupRepository.updateById(id, { restoredAt: new Date(), status: 'restored' });
    return { message: 'Restore simulated successfully', backupId: id };
  }
}

module.exports = BackupService;
