const mongoose = require('mongoose');

const IngestionIssueSchema = new mongoose.Schema({
  source: { type: String, enum: ['user', 'exchange'], required: true },
  rowNumber: Number,
  transactionId: String,
  reason: String,
  originalRow: mongoose.Schema.Types.Mixed,
  ingestionRunId: String
}, { timestamps: true });

module.exports = mongoose.model('IngestionIssue', IngestionIssueSchema);
