const mongoose = require('mongoose');

const UserTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  asset: { type: String, required: true, index: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true, index: true },
  originalRow: { type: mongoose.Schema.Types.Mixed },
  ingestionRunId: { type: String }
}, { timestamps: true });

UserTransactionSchema.index({ transactionId: 1 }, { unique: false });

module.exports = mongoose.model('UserTransaction', UserTransactionSchema);
