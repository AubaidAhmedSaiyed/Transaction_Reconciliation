const express = require('express');
const router = express.Router();

router.use('/', require('./health'));
router.use('/upload', require('./ingestion'));
router.use('/reconcile', require('./reconcile'));
router.use('/report', require('./report'));
router.use('/ui', require('./ui'));

module.exports = router;
