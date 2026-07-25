class CmsController {
  constructor(cmsService) {
    this.cmsService = cmsService;
  }

  list = async (req, res) => {
    try {
      if (!req.query.all) {
        return res.json(await this.cmsService.getHome());
      }
      res.json(await this.cmsService.list(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  upsertHome = async (req, res) => {
    try {
      res.json(await this.cmsService.upsertHome(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getByKey = async (req, res) => {
    try {
      res.json(await this.cmsService.getByKey(req.params.key));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.cmsService.getById(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      res.status(201).json(await this.cmsService.create(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      res.json(await this.cmsService.update(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.cmsService.remove(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = CmsController;
