# Firebase Handoff Plan

The current MVP uses `localStorage` for report pins so the group can test the full report workflow locally without Firebase credentials.

## Current Local Flow

1. A tester clicks the Leaflet map.
2. The app opens a report form for that coordinate.
3. The submitted report is stored with `status: pending`.
4. The `MVP` tab shows a local admin review queue.
5. Approved reports render as map pins.

## Data Shape

```json
{
  "id": 1717000000000,
  "createdAt": "2026-05-29T09:00:00.000Z",
  "latLng": [47.65635, -122.3083],
  "type": "stairs",
  "note": "stairs on this path",
  "status": "pending"
}
```

## Firebase Version

When deployment credentials are ready, move the reports from localStorage into a Firestore collection, for example:

- Collection: `reports`
- Fields: `createdAt`, `lat`, `lng`, `type`, `note`, `status`
- Public users can create pending reports.
- Admin users can update `status` to `approved` or `dismissed`.

Authentication can stay optional for the main route planner. Admin-only report approval can use Firebase Auth later if the team wants it.
