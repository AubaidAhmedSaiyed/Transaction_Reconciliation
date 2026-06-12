const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Transaction Reconciliation UI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg: #f8fafc;
            --surface: rgba(255, 255, 255, 0.7);
            --surface-border: rgba(255, 255, 255, 0.5);
            --text-main: #334155;
            --text-muted: #64748b;
            --primary: #94a3b8;
            --primary-hover: #cbd5e1;
            --accent: #38bdf8;
            --shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
            --radius: 16px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px 20px;
          }
          .container {
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .header {
            text-align: center;
            margin-bottom: 12px;
          }
          h1 {
            font-weight: 600;
            font-size: 2rem;
            color: var(--text-main);
            letter-spacing: -0.5px;
          }
          p { color: var(--text-muted); font-weight: 300; margin-top: 8px; }
          .card {
            background: var(--surface);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--surface-border);
            border-radius: var(--radius);
            padding: 32px;
            box-shadow: var(--shadow);
            transition: var(--transition);
          }
          .card:hover { box-shadow: 0 15px 50px -10px rgba(0,0,0,0.08); transform: translateY(-2px); }
          .card-title { font-weight: 500; font-size: 1.2rem; margin-bottom: 20px; color: var(--text-main); }
          .form-group { margin-bottom: 16px; }
          label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-muted); font-weight: 400; }
          input[type="file"], input[type="number"], input[type="text"] {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
            color: var(--text-main);
            font-family: inherit;
            font-size: 1rem;
            transition: var(--transition);
            outline: none;
          }
          input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); }
          input[type="file"] { padding: 10px; background: rgba(255,255,255,0.5); }
          input[type="file"]::file-selector-button {
            border: none;
            background: var(--primary);
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            margin-right: 12px;
            cursor: pointer;
            transition: var(--transition);
            font-family: inherit;
          }
          input[type="file"]::file-selector-button:hover { background: var(--text-muted); }
          button {
            background: #ffffff;
            color: var(--text-main);
            border: 1px solid #e2e8f0;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            width: 100%;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          button:hover { background: var(--bg); border-color: var(--primary-hover); transform: translateY(-1px); }
          button:active { transform: translateY(0); }
          pre {
            background: rgba(255,255,255,0.8);
            padding: 16px;
            border-radius: 12px;
            overflow-x: auto;
            font-size: 0.85rem;
            color: var(--text-muted);
            border: 1px solid #f1f5f9;
            margin-top: 16px;
          }
          pre:empty { display: none; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
          .hidden { display: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reconciliation Engine</h1>
            <p>A calm, simple space to harmonize your transaction records.</p>
          </div>

          <div class="card">
            <h2 class="card-title">1. Upload Datasets</h2>
            <div class="grid-2">
              <form id="uploadUserForm" action="/api/upload/user" method="post" enctype="multipart/form-data">
                <div class="form-group">
                  <label>User CSV</label>
                  <input type="file" name="file" required>
                </div>
                <button type="submit">Upload User Data</button>
              </form>
              <form id="uploadExchangeForm" action="/api/upload/exchange" method="post" enctype="multipart/form-data">
                <div class="form-group">
                  <label>Exchange CSV</label>
                  <input type="file" name="file" required>
                </div>
                <button type="submit">Upload Exchange Data</button>
              </form>
            </div>
          </div>

          <div class="card">
            <h2 class="card-title">2. Run Engine</h2>
            <form id="reconcileForm">
              <div class="grid-2 form-group">
                <div>
                  <label>Timestamp Tolerance (sec)</label>
                  <input type="number" name="timestampToleranceSeconds" value="300" min="0">
                </div>
                <div>
                  <label>Quantity Tolerance (%)</label>
                  <input type="number" name="quantityTolerancePct" value="0.01" step="0.001" min="0">
                </div>
              </div>
              <button type="submit" style="background: var(--text-main); color: white; border: none;">Run Reconciliation</button>
            </form>
            <pre id="reconcileResult"></pre>
          </div>

          <div class="card">
            <h2 class="card-title">3. View Reports</h2>
            <form id="reportSummaryForm" class="form-group">
              <label>Run ID for Summary</label>
              <div class="grid-2" style="grid-template-columns: 1fr auto;">
                <input type="text" name="runId" placeholder="e.g. 53755fc1-..." required>
                <button type="submit">Get Summary</button>
              </div>
            </form>
            <pre id="reportSummaryResult"></pre>

            <form id="reportUnmatchedForm" style="margin-top:24px;" class="form-group">
              <label>Run ID for Unmatched Items</label>
              <div class="grid-3">
                <input type="text" name="runId" placeholder="Run ID" required>
                <input type="number" name="page" value="1" min="1" placeholder="Page">
                <input type="number" name="limit" value="20" min="1" placeholder="Limit">
              </div>
              <button type="submit" style="margin-top: 12px;">Fetch Unmatched Items</button>
            </form>
            <pre id="reportUnmatchedResult"></pre>
          </div>
        </div>

        <script>
          const showToast = (msg, isError = false) => {
            let toast = document.getElementById('toast');
            if (!toast) {
              toast = document.createElement('div');
              toast.id = 'toast';
              Object.assign(toast.style, {
                position: 'fixed', bottom: '24px', right: '24px', padding: '16px 24px',
                background: isError ? '#ef4444' : '#10b981', color: 'white', borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 9999, transition: 'all 0.3s ease',
                opacity: 0, transform: 'translateY(20px)', fontWeight: 500
              });
              document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.background = isError ? '#ef4444' : '#10b981';
            toast.style.opacity = 1;
            toast.style.transform = 'translateY(0)';
            setTimeout(() => { toast.style.opacity = 0; toast.style.transform = 'translateY(20px)'; }, 3000);
          };

          const message = (target, data) => {
            const el = document.getElementById(target);
            el.textContent = JSON.stringify(data, null, 2);
            el.style.display = 'block';
            el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
          };

          const renderUnmatched = (target, data) => {
            const el = document.getElementById(target);
            el.innerHTML = '';
            el.style.display = 'block';
            el.style.background = 'transparent';
            el.style.border = 'none';
            
            if (!data.body || !data.body.data || data.body.data.length === 0) {
              el.innerHTML = '<div style="padding: 16px; background: rgba(255,255,255,0.8); border-radius: 12px; color: var(--text-muted); text-align: center;">No unmatched items found.</div>';
              return;
            }
            
            const html = data.body.data.map(item => {
              const tx = item.userTransaction || item.exchangeTransaction;
              const source = item.category.includes('User') ? 'User' : 'Exchange';
              return \`
                <div style="background: rgba(255,255,255,0.8); padding: 16px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid \${source === 'User' ? '#f59e0b' : '#8b5cf6'}">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong style="color: var(--text-main);">\${item.category}</strong>
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Reason: \${item.reason}</span>
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 0.9rem;">
                    <div><span style="color: var(--text-muted); font-size: 0.75rem; display: block;">ID</span>\${tx.transactionId}</div>
                    <div><span style="color: var(--text-muted); font-size: 0.75rem; display: block;">Asset</span>\${tx.asset}</div>
                    <div><span style="color: var(--text-muted); font-size: 0.75rem; display: block;">Quantity</span>\${tx.quantity}</div>
                    <div><span style="color: var(--text-muted); font-size: 0.75rem; display: block;">Type</span>\${tx.type}</div>
                  </div>
                </div>
              \`;
            }).join('');
            
            el.innerHTML = html;
            el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
          };

          // Override forms to keep it SPA-like
          const handleUpload = async (formId, endpoint) => {
            document.getElementById(formId).addEventListener('submit', async event => {
              event.preventDefault();
              const form = event.target;
              const btn = form.querySelector('button');
              const ogText = btn.textContent;
              btn.textContent = 'Uploading...';
              btn.style.opacity = '0.7';
              try {
                const formData = new FormData(form);
                const res = await fetch(endpoint, { method: 'POST', body: formData });
                const json = await res.json();
                showToast(\`Upload Complete! \${json.imported} imported, \${json.issues} issues.\`);
              } catch(err) {
                showToast(\`Error: \${err.message}\`, true);
              }
              btn.textContent = ogText;
              btn.style.opacity = '1';
            });
          };

          handleUpload('uploadUserForm', '/api/upload/user');
          handleUpload('uploadExchangeForm', '/api/upload/exchange');

          document.getElementById('reconcileForm').addEventListener('submit', async event => {
            event.preventDefault();
            const form = event.target;
            const btn = form.querySelector('button');
            btn.textContent = 'Processing...';
            const body = {
              timestampToleranceSeconds: Number(form.timestampToleranceSeconds.value),
              quantityTolerancePct: Number(form.quantityTolerancePct.value)
            };
            const res = await fetch('/api/reconcile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            const json = await res.json();
            message('reconcileResult', { status: res.status, body: json });
            
            if (json.runId) {
               document.querySelector('#reportSummaryForm [name="runId"]').value = json.runId;
               document.querySelector('#reportUnmatchedForm [name="runId"]').value = json.runId;
            }
            btn.textContent = 'Run Reconciliation';
            showToast('Reconciliation complete!');
          });

          document.getElementById('reportSummaryForm').addEventListener('submit', async event => {
            event.preventDefault();
            const runId = event.target.runId.value.trim();
            const res = await fetch('/api/report/' + encodeURIComponent(runId) + '/summary');
            message('reportSummaryResult', { status: res.status, body: await res.json() });
          });

          document.getElementById('reportUnmatchedForm').addEventListener('submit', async event => {
            event.preventDefault();
            const runId = event.target.runId.value.trim();
            const page = event.target.page.value;
            const limit = event.target.limit.value;
            const res = await fetch('/api/report/' + encodeURIComponent(runId) + '/unmatched?page=' + page + '&limit=' + limit);
            renderUnmatched('reportUnmatchedResult', { status: res.status, body: await res.json() });
          });
        </script>
      </body>
    </html>
  `);
});

module.exports = router;
