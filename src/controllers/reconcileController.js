const reconciliationService = require('../services/reconciliationService');

async function runReconciliation(req, res, next) {
  try {
    const params = {
      timestampToleranceSeconds: req.body.timestampToleranceSeconds,
      quantityTolerancePct: req.body.quantityTolerancePct
    };
    const run = await reconciliationService.run(params);
    res.json(run);
  } catch (err) { next(err); }
}

module.exports = { runReconciliation };
