const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const ReconciliationResult = require('../models/ReconciliationResult');
const config = require('../config');

fs.mkdirSync(config.REPORT_DIR, { recursive: true });

async function generateCsv(runId) {
  const records = await ReconciliationResult.find({ runId }).lean().exec();
  const fields = ['runId','category','reason','userTransaction','exchangeTransaction','metadata','createdAt'];
  const parser = new Parser({ fields });
  const csv = parser.parse(records.map(r => ({ 
    ...r, 
    userTransaction: JSON.stringify(r.userTransaction ? r.userTransaction.originalRow || r.userTransaction : {}), 
    exchangeTransaction: JSON.stringify(r.exchangeTransaction ? r.exchangeTransaction.originalRow || r.exchangeTransaction : {}), 
    metadata: JSON.stringify(r.metadata || {}) 
  })));
  const filePath = path.resolve(config.REPORT_DIR, `${runId}.csv`);
  fs.writeFileSync(filePath, csv);
  return filePath;
}

async function getReportFilePath(runId) {
  const filePath = path.resolve(config.REPORT_DIR, `${runId}.csv`);
  if (fs.existsSync(filePath)) return filePath;
  return null;
}

async function getSummary(runId) {
  const agg = await ReconciliationResult.aggregate([
    { $match: { runId } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]).exec();
  const res = { matched:0, conflicting:0, unmatched:0 };
  agg.forEach(a => { 
    if (a._id === 'Matched') res.matched += a.count;
    else if (a._id === 'Conflicting') res.conflicting += a.count;
    else if (a._id === 'Unmatched (User only)' || a._id === 'Unmatched (Exchange only)') res.unmatched += a.count;
  });
  return res;
}

async function getUnmatched(runId, { skip = 0, limit = 50 } = {}) {
  return ReconciliationResult.find({ runId, category: { $in: ['Conflicting','Unmatched (User only)','Unmatched (Exchange only)'] } }).skip(skip).limit(limit).lean().exec();
}

module.exports = { generateCsv, getReportFilePath, getSummary, getUnmatched };
