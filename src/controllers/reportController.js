const reportService = require('../services/reportService');

async function getReportCsv(req, res, next) {
  try {
    const { runId } = req.params;
    const file = await reportService.getReportFilePath(runId);
    if (!file) return res.status(404).json({ error: 'report not found' });
    res.download(file);
  } catch (err) { next(err); }
}

async function getReportSummary(req, res, next) {
  try {
    const { runId } = req.params;
    const summary = await reportService.getSummary(runId);
    res.json(summary);
  } catch (err) { next(err); }
}

async function getUnmatched(req, res, next) {
  try {
    const { runId } = req.params;
    const { page, limit, skip } = req.pagination;
    const data = await reportService.getUnmatched(runId, { skip, limit });
    res.json({ page, limit, data });
  } catch (err) { next(err); }
}

module.exports = { getReportCsv, getReportSummary, getUnmatched };
