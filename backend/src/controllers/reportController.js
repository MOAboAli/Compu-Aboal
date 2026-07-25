class ReportController {
  constructor(reportService) {
    this.reportService = reportService;
  }

  get = async (req, res) => {
    try {
      const type = req.params.type;
      const data =
        type === 'services'
          ? await this.reportService.services()
          : type === 'users'
            ? await this.reportService.users()
            : await this.reportService.sales();
      res.json(data);
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  export = async (req, res) => {
    try {
      res.json(await this.reportService.export(req.params.type, req.query.format || 'csv'));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = ReportController;
