class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  listMine = async (req, res) => {
    try {
      res.json(await this.notificationService.listMine(req.user._id, req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listAll = async (req, res) => {
    try {
      res.json(await this.notificationService.listAll(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  markRead = async (req, res) => {
    try {
      const doc = await this.notificationService.markRead(req.params.id, req.user._id);
      if (!doc) return res.status(404).json({ message: 'Notification not found' });
      res.json(doc);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = NotificationController;
