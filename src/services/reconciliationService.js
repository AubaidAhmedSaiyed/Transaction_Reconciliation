const { v4: uuidv4 } = require('uuid');
const ReconciliationRun = require('../models/ReconciliationRun');
const ReconciliationResult = require('../models/ReconciliationResult');
const UserTransaction = require('../models/UserTransaction');
const ExchangeTransaction = require('../models/ExchangeTransaction');
const reconciliationEngine = require('../engines/reconciliationEngine');
const reportService = require('./reportService');
const config = require('../config');

async function run(params = {}) {
  const runId = uuidv4();
  const runParams = {
    timestampToleranceSeconds: params.timestampToleranceSeconds || config.TIMESTAMP_TOLERANCE_SECONDS,
    quantityTolerancePct: params.quantityTolerancePct || config.QUANTITY_TOLERANCE_PCT
  };
  await ReconciliationRun.create({ runId, params: runParams });

  // invoke engine
  const results = await reconciliationEngine.reconcile({ runId, ...runParams });

  // persist results and generate CSV
  if (results && results.length) {
    await ReconciliationResult.insertMany(results.map(r => ({ runId, ...r })));
  }

  const reportPath = await reportService.generateCsv(runId);

  return { runId, resultsCount: results.length, reportPath };
}

module.exports = { run };
