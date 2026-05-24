const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tx_reconciliation',
  PORT: process.env.PORT || 3000,
  TIMESTAMP_TOLERANCE_SECONDS: parseInt(process.env.TIMESTAMP_TOLERANCE_SECONDS || '300', 10),
  QUANTITY_TOLERANCE_PCT: parseFloat(process.env.QUANTITY_TOLERANCE_PCT || '0.01'),
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads'),
  REPORT_DIR: process.env.REPORT_DIR || path.resolve(process.cwd(), 'reports')
};
