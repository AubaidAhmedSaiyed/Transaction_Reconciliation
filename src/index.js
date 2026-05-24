const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./logger');

dotenv.config();
const config = require('./config');

async function start() {
  await mongoose.connect(config.MONGODB_URI, { dbName: 'tx_reconciliation' });
  logger.info('Connected to MongoDB');

  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(config.UPLOAD_DIR)));

  app.use('/api', routes);

  app.use(errorHandler);

  const port = config.PORT || 3000;
  app.listen(port, () => logger.info(`Server running on port ${port}`));
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
