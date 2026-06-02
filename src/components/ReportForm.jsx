import { reportTypes } from '../data/reportTypes'

export function ReportForm({
  cancelReport,
  pendingNote,
  pendingPin,
  pendingType,
  setPendingNote,
  setPendingType,
  submitReport,
}) {
  if (!pendingPin) {
    return null
  }

  return (
    <aside className="report-form-panel" aria-labelledby="report-form-title">
      <p className="eyebrow">Map report</p>
      <h2 id="report-form-title">Review dropped pin</h2>
      <p>
        Add a quick note about the issue. The team can review the report before
        it appears on the public map.
      </p>

      <label htmlFor="report-type">Issue type</label>
      <select
        id="report-type"
        value={pendingType}
        onChange={(event) => setPendingType(event.target.value)}
      >
        {reportTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.label}
          </option>
        ))}
      </select>

      <label htmlFor="report-note">Short note</label>
      <textarea
        id="report-note"
        maxLength="120"
        onChange={(event) => setPendingNote(event.target.value)}
        placeholder="Example: stairs on this route"
        value={pendingNote}
      />

      <div className="report-actions">
        <button onClick={cancelReport} type="button">
          Cancel
        </button>
        <button className="submit-report" onClick={submitReport} type="button">
          Submit for review
        </button>
      </div>
    </aside>
  )
}
