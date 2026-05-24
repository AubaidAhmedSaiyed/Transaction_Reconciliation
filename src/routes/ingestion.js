const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { uploadUserCSV, uploadExchangeCSV } = require('../controllers/ingestionController');

fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const upload = multer({ storage });

const router = express.Router();
router.post('/user', upload.single('file'), uploadUserCSV);
router.post('/exchange', upload.single('file'), uploadExchangeCSV);

module.exports = router;
