const path = require('path');
const fs = require('fs');
const ingestService = require('../services/ingestService');

async function uploadUserCSV(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const result = await ingestService.ingestCSV('user', req.file.path);
    res.json(result);
  } catch (err) { next(err); }
}

async function uploadExchangeCSV(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const result = await ingestService.ingestCSV('exchange', req.file.path);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { uploadUserCSV, uploadExchangeCSV };
