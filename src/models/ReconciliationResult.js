const mongoose = require('mongoose');

const ReconciliationResultSchema = new mongoose.Schema({
  runId: { type: String, required: true, index: true },
  category: { type: String, required: true, enum: ['MATCHED','CONFLICTING','USER_ONLY','EXCHANGE_ONLY'] },
  reason: String,
  userTransaction: mongoose.Schema.Types.Mixed,
  exchangeTransaction: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('ReconciliationResult', ReconciliationResultSchema);
