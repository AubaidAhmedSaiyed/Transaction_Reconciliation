const mongoose = require('mongoose');

const ExchangeTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  asset: { type: String, required: true, index: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true, index: true },
  originalRow: { type: mongoose.Schema.Types.Mixed },
  ingestionRunId: { type: String }
}, { timestamps: true });

ExchangeTransactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model('ExchangeTransaction', ExchangeTransactionSchema);
