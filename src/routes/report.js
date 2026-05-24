const express = require('express');
const paginate = require('../middlewares/pagination');
const { getReportCsv, getReportSummary, getUnmatched } = require('../controllers/reportController');

const router = express.Router();

router.get('/:runId', getReportCsv);
router.get('/:runId/summary', getReportSummary);
router.get('/:runId/unmatched', paginate, getUnmatched);

module.exports = router;
