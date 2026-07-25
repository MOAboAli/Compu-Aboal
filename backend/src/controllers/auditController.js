class AuditController {
  constructor(auditService) {
    this.auditService = auditService;
  }

  list = async (req, res) => {
    try {
      const items = await this.auditService.list(req.query);
      res.json({ items });
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  export = async (_req, res) => {
    try {
      res.json(await this.auditService.export());
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = AuditController;
