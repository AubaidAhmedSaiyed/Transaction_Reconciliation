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

const uploadPage = () => `
    <html>
      <head><title>Upload Transactions</title></head>
      <body>
        <h1>Upload Transactions</h1>
        <form action="/api/upload/user" method="post" enctype="multipart/form-data">
          <label>User CSV: <input type="file" name="file" required></label>
          <button type="submit">Upload User CSV</button>
        </form>
        <form action="/api/upload/exchange" method="post" enctype="multipart/form-data" style="margin-top:16px;">
          <label>Exchange CSV: <input type="file" name="file" required></label>
          <button type="submit">Upload Exchange CSV</button>
        </form>
      </body>
    </html>
  `;

router.get('/', (req, res) => {
  res.send(uploadPage());
});

router.get('/user', (req, res) => {
  res.send(uploadPage());
});

router.get('/exchange', (req, res) => {
  res.send(uploadPage());
});

router.post('/user', upload.single('file'), uploadUserCSV);
router.post('/exchange', upload.single('file'), uploadExchangeCSV);

module.exports = router;
