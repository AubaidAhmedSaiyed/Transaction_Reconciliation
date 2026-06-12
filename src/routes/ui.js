const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Transaction Reconciliation UI</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; }
          fieldset { margin-bottom: 24px; padding: 16px; }
          label { display: block; margin: 8px 0; }
          pre { background: #f5f5f5; padding: 12px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>Transaction Reconciliation UI</h1>
        <p>Use the forms below to upload CSVs, reconcile data, and view reports.</p>

        <fieldset>
          <legend>Upload CSV</legend>
          <form id="uploadUserForm" action="/api/upload/user" method="post" enctype="multipart/form-data">
            <label>User CSV:<input type="file" name="file" required></label>
            <button type="submit">Upload User CSV</button>
          </form>
          <form id="uploadExchangeForm" action="/api/upload/exchange" method="post" enctype="multipart/form-data" style="margin-top: 16px;">
            <label>Exchange CSV:<input type="file" name="file" required></label>
            <button type="submit">Upload Exchange CSV</button>
          </form>
        </fieldset>

        <fieldset>
          <legend>Run Reconciliation</legend>
          <form id="reconcileForm">
            <label>Timestamp tolerance seconds: <input type="number" name="timestampToleranceSeconds" value="300" min="0"></label>
            <label>Quantity tolerance pct: <input type="number" name="quantityTolerancePct" value="0.01" step="0.001" min="0"></label>
            <button type="submit">Run Reconciliation</button>
          </form>
          <pre id="reconcileResult"></pre>
        </fieldset>

        <fieldset>
          <legend>Report</legend>
          <form id="reportSummaryForm">
            <label>Run ID: <input type="text" name="runId" required></label>
            <button type="submit">Get Summary</button>
          </form>
          <pre id="reportSummaryResult"></pre>
          <form id="reportUnmatchedForm" style="margin-top:16px;">
            <label>Run ID: <input type="text" name="runId" required></label>
            <label>Page: <input type="number" name="page" value="1" min="1"></label>
            <label>Limit: <input type="number" name="limit" value="20" min="1"></label>
            <button type="submit">Get Unmatched</button>
          </form>
          <pre id="reportUnmatchedResult"></pre>
        </fieldset>

        <script>
          const message = (target, data) => {
            document.getElementById(target).textContent = JSON.stringify(data, null, 2);
          };

          document.getElementById('reconcileForm').addEventListener('submit', async event => {
            event.preventDefault();
            const form = event.target;
            const body = {
              timestampToleranceSeconds: Number(form.timestampToleranceSeconds.value),
              quantityTolerancePct: Number(form.quantityTolerancePct.value)
            };
            const res = await fetch('/api/reconcile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            message('reconcileResult', { status: res.status, body: await res.json() });
          });

          document.getElementById('reportSummaryForm').addEventListener('submit', async event => {
            event.preventDefault();
            const runId = event.target.runId.value.trim();
            const res = await fetch(`/api/report/${encodeURIComponent(runId)}/summary`);
            message('reportSummaryResult', { status: res.status, body: await res.json() });
          });

          document.getElementById('reportUnmatchedForm').addEventListener('submit', async event => {
            event.preventDefault();
            const runId = event.target.runId.value.trim();
            const page = event.target.page.value;
            const limit = event.target.limit.value;
            const res = await fetch(`/api/report/${encodeURIComponent(runId)}/unmatched?page=${page}&limit=${limit}`);
            message('reportUnmatchedResult', { status: res.status, body: await res.json() });
          });
        </script>
      </body>
    </html>
  `);
});

module.exports = router;
