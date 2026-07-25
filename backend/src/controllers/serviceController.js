class ServiceController {
  constructor(serviceService) {
    this.serviceService = serviceService;
  }

  listCategories = async (req, res) => {
    try {
      res.json(await this.serviceService.listCategories(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  createCategory = async (req, res) => {
    try {
      res.status(201).json(await this.serviceService.createCategory(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updateCategory = async (req, res) => {
    try {
      res.json(await this.serviceService.updateCategory(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      res.json(await this.serviceService.deleteCategory(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  listOfferings = async (req, res) => {
    try {
      res.json(await this.serviceService.listOfferings(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getOffering = async (req, res) => {
    try {
      res.json(await this.serviceService.getOffering(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  createOffering = async (req, res) => {
    try {
      res.status(201).json(await this.serviceService.createOffering(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  updateOffering = async (req, res) => {
    try {
      res.json(await this.serviceService.updateOffering(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  deleteOffering = async (req, res) => {
    try {
      res.json(await this.serviceService.deleteOffering(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = ServiceController;
