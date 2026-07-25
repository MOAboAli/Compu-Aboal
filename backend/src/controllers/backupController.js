class BackupController {
  constructor(backupService) {
    this.backupService = backupService;
  }

  list = async (_req, res) => {
    try {
      const items = await this.backupService.list();
      res.json({ items });
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  run = async (req, res) => {
    try {
      res.status(201).json(await this.backupService.run(req.user?._id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  restore = async (req, res) => {
    try {
      res.json(await this.backupService.restore(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = BackupController;
