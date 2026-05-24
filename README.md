# Transaction Reconciliation Engine

This service ingests user and exchange transaction CSVs, reconciles transactions using configurable tolerances, and exports reconciliation reports.

Quick start

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies: `npm install`.
3. Start: `npm start`.

APIs

- POST `/upload/user` — multipart form `file` upload for user CSVs.
- POST `/upload/exchange` — multipart form `file` upload for exchange CSVs.
- POST `/reconcile` — trigger reconciliation, optional JSON body: `timestampToleranceSeconds`, `quantityTolerancePct`.
- GET `/report/:runId` — download full CSV report.
- GET `/report/:runId/summary` — JSON counts.
- GET `/report/:runId/unmatched` — paginated unmatched rows.

Assumptions & Strategy

- Assets and types are normalized before matching. Asset alias map present in `src/utils/normalize.js`.
- Matching looks up candidate exchange records using indexes and a timestamp window to avoid O(n^2).
- Candidates are ranked by timestamp delta then quantity delta.

Tradeoffs

- This implementation focuses on correctness and clarity. For very large datasets, consider batching, sharding, or using an external search index.
