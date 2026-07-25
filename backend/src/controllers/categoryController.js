class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  list = async (req, res) => {
    try {
      res.json(await this.categoryService.list(req.query));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.categoryService.getById(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      res.status(201).json(await this.categoryService.create(req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      res.json(await this.categoryService.update(req.params.id, req.body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.categoryService.remove(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = CategoryController;
