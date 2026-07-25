const express = require('express');
const cors = require('cors');
const createProductRoutes = require('./routes/productRoutes');

function createApp(productController) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'compu-aboali-api' });
  });

  app.use('/api/products', createProductRoutes(productController));

  return app;
}

module.exports = createApp;
