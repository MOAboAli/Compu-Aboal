require('dotenv').config();
const createApp = require('./app');
const { dbContext, productController } = require('./container');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compu_aboali';

const app = createApp(productController);

async function start() {
  await dbContext.connect(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
