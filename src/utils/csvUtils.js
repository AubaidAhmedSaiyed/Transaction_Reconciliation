const fs = require('fs');
const csv = require('fast-csv');

function writeCsv(filePath, rows) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    csv.write(rows, { headers: true }).pipe(ws).on('finish', resolve).on('error', reject);
  });
}

module.exports = { writeCsv };
