require('dotenv').config();
const createApp = require('./app');
const container = require('./container');
const seed = require('./seed');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compu_aboali';

const app = createApp(container);

async function start() {
  await container.dbContext.connect(MONGODB_URI);

  if (process.env.AUTO_SEED === 'true') {
    await seed(container.dbContext);
  }

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
