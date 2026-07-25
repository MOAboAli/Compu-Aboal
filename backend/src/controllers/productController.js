class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  list = async (req, res) => {
    try {
      res.json(await this.productService.listProducts(req.query));
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  };

  getById = async (req, res) => {
    try {
      res.json(await this.productService.getProductById(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  create = async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) body.featuredImage = `/uploads/${req.file.filename}`;
      res.status(201).json(await this.productService.createProduct(body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) body.featuredImage = `/uploads/${req.file.filename}`;
      res.json(await this.productService.updateProduct(req.params.id, body));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      res.json(await this.productService.deleteProduct(req.params.id));
    } catch (error) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };
}

module.exports = ProductController;
