const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const UserTransaction = require('../models/UserTransaction');
const ExchangeTransaction = require('../models/ExchangeTransaction');
const IngestionIssue = require('../models/IngestionIssue');
const { normalizeAsset, normalizeType } = require('../utils/normalize');

async function ingestCSV(source, filePath) {
  const ingestionRunId = uuidv4();
  const results = { imported: 0, issues: 0, path: filePath, ingestionRunId };

  const Model = source === 'user' ? UserTransaction : ExchangeTransaction;

  try {
    let rowNumber = 0;
    const parser = fs.createReadStream(filePath).pipe(csv());
    for await (const row of parser) {
      rowNumber += 1;
      try {
        const original = { ...row };
        const transactionId = (row.transactionId || row.id || '').toString().trim();
        const timestamp = new Date(row.timestamp || row.time || row.date);
        const asset = normalizeAsset((row.asset || row.currency || '').toString());
        const quantity = parseFloat((row.quantity || row.amount || '').toString());
        const type = normalizeType((row.type || '').toString());

        const issues = [];
        if (!transactionId) issues.push('missing_transaction_id');
        if (!timestamp || Number.isNaN(timestamp.getTime())) issues.push('invalid_timestamp');
        if (!asset) issues.push('missing_asset');
        if (!Number.isFinite(quantity)) issues.push('malformed_quantity');
        if (!type) issues.push('unsupported_type');

        const exists = await Model.findOne({ transactionId }).lean().exec();
        if (exists) issues.push('duplicate_transaction_id');

        if (issues.length) {
          results.issues += 1;
          await IngestionIssue.create({ source, rowNumber, transactionId, reason: issues.join(';'), originalRow: original, ingestionRunId });
          continue;
        }

        await Model.create({ transactionId, timestamp, asset, quantity, type, originalRow: original, ingestionRunId });
        results.imported += 1;
      } catch (err) {
        results.issues += 1;
        await IngestionIssue.create({ source, rowNumber, reason: (err.message || 'parse_error'), originalRow: row, ingestionRunId });
      }
    }
    return results;
  } catch (err) {
    throw err;
  }
}

module.exports = { ingestCSV };
