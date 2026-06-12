const UserTransaction = require('../models/UserTransaction');
const ExchangeTransaction = require('../models/ExchangeTransaction');
const normalize = require('../utils/normalize');

function qtyWithinTolerance(a, b, pct) {
  const diff = Math.abs(a - b);
  const avg = Math.max(Math.abs(a), Math.abs(b), 1e-12);
  return (diff / avg) <= (pct / 100);
}

async function reconcile({ runId, timestampToleranceSeconds, quantityTolerancePct }) {
  const results = [];
  const matchedExchangeIds = new Set();

  // stream user transactions and for each find candidates in exchange using indexed query
  const cursor = UserTransaction.find().cursor();
  for await (const u of cursor) {
    const uAsset = normalize.normalizeAsset(u.asset);
    const uType = normalize.mapTypeForUser(u.type);
    const windowStart = new Date(u.timestamp.getTime() - timestampToleranceSeconds * 1000);
    const windowEnd = new Date(u.timestamp.getTime() + timestampToleranceSeconds * 1000);

    const candidates = await ExchangeTransaction.find({
      asset: uAsset,
      type: { $in: [uType, normalize.reverseType(uType)] },
      timestamp: { $gte: windowStart, $lte: windowEnd }
    }).lean().exec();

    if (!candidates.length) {
      results.push({ category: 'Unmatched (User only)', reason: 'no_candidate', userTransaction: u, exchangeTransaction: null, metadata: {} });
      continue;
    }

    // filter out already matched
    const filtered = candidates.filter(c => !matchedExchangeIds.has(String(c._id)));
    if (!filtered.length) {
      results.push({ category: 'Conflicting', reason: 'duplicate_candidates_matched', userTransaction: u, exchangeTransaction: null, metadata: {} });
      continue;
    }

    // rank by timestamp delta then quantity delta
    filtered.sort((a,b) => {
      const dtA = Math.abs(new Date(a.timestamp) - u.timestamp);
      const dtB = Math.abs(new Date(b.timestamp) - u.timestamp);
      if (dtA !== dtB) return dtA - dtB;
      const dqA = Math.abs(a.quantity - u.quantity);
      const dqB = Math.abs(b.quantity - u.quantity);
      return dqA - dqB;
    });

    const best = filtered[0];
    const tsDelta = Math.abs(new Date(best.timestamp) - u.timestamp) / 1000;
    const qtyMatch = qtyWithinTolerance(u.quantity, best.quantity, quantityTolerancePct);

    if (!qtyMatch) {
      results.push({ category: 'Conflicting', reason: 'quantity_outside_tolerance', userTransaction: u, exchangeTransaction: best, metadata: { tsDelta, qtyDelta: Math.abs(u.quantity - best.quantity) } });
      continue;
    }

    // matched
    matchedExchangeIds.add(String(best._id));
    results.push({ category: 'Matched', reason: 'ok', userTransaction: u, exchangeTransaction: best, metadata: { tsDelta } });
  }

  // any exchange transactions not matched are EXCHANGE_ONLY
  const unmatchedExchange = await ExchangeTransaction.find({ _id: { $nin: Array.from(matchedExchangeIds) } }).lean().exec();
  for (const e of unmatchedExchange) {
    results.push({ category: 'Unmatched (Exchange only)', reason: 'no_user_candidate', userTransaction: null, exchangeTransaction: e, metadata: {} });
  }

  return results;
}

module.exports = { reconcile };
