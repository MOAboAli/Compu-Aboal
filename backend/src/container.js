const dbContext = require('./context/dbContext');
const ProductRepository = require('./repositories/productRepository');
const ProductService = require('./services/productService');
const ProductController = require('./controllers/productController');

const productRepository = new ProductRepository(dbContext);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

module.exports = {
  dbContext,
  productRepository,
  productService,
  productController,
};
