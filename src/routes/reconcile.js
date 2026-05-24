const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const { runReconciliation } = require('../controllers/reconcileController');

const router = express.Router();

router.post('/', [
  body('timestampToleranceSeconds').optional().isInt({ min: 0 }),
  body('quantityTolerancePct').optional().isFloat({ min: 0 })
], validateRequest, runReconciliation);

module.exports = router;
