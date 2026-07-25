class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  dashboard = async (_req, res) => {
    try {
      res.json(await this.adminService.dashboard());
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = AdminController;
