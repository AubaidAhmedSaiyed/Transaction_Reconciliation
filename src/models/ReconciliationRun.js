const mongoose = require('mongoose');

const ReconciliationRunSchema = new mongoose.Schema({
  runId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  params: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('ReconciliationRun', ReconciliationRunSchema);
