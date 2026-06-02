import { getReportType } from '../data/reportTypes'

const routeAudioSrc = `${import.meta.env.BASE_URL}route-preview.wav`

const personas = [
  {
    name: 'First-year student finding class',
    need: 'Needs a quick route between familiar campus landmarks without signing in.',
    support:
      'HuskyPath lets them choose a start and destination, then shows time, distance, map path, and directions.',
  },
  {
    name: 'Student avoiding stairs',
    need: 'Needs a route mode that tries to avoid steps and steep paths when map data supports it.',
    support:
      'The Accessible mode asks the routing service to penalize steps and the report flow lets testers flag stair-heavy paths.',
  },
  {
    name: 'Campus visitor on mobile',
    need: 'Needs a phone-friendly way to find a building and confirm basic amenities.',
    support:
      'The layout stacks on small screens and keeps building hours, restrooms, services, and reports readable.',
  },
]

const tutorialSteps = [
  {
    title: 'Choose your route',
    body: 'Open the Map tab, select where you are starting from, then choose the building or campus landmark you want to reach.',
  },
  {
    title: 'Pick a route mode',
    body: 'Use Accessible when you want to avoid stairs where possible, Fastest for short class changes, Simplest for main paths, or Stairs OK when direct routes are fine.',
  },
  {
    title: 'Follow the map',
    body: 'Read the live navigation card, check the distance and ETA, and use Start Navigation to recenter the route if you move the map around.',
  },
  {
    title: 'Report path problems',
    body: 'Click the map where you notice stairs, construction, or hazards, add a quick note, then submit it so the team can review the pin.',
  },
]

const audioTranscript = [
  'HuskyPath route preview.',
  'Start by opening the Map tab.',
  'Pick your current location, then choose where you want to go.',
  'For example, choose Red Square as the start and Mary Gates Hall as the destination.',
  'Select Accessible to avoid stairs when possible.',
  'Follow the green route on the map, read the live navigation card, and use Start Navigation to recenter the path.',
  'If you see stairs, construction, or a hazard, click the map, choose the report type, add a note, and submit it for review.',
].join(' ')

export function MvpHub({ approveReport, dismissReport, reports }) {
  const pendingReports = reports.filter((report) => report.status === 'pending')
  const approvedReports = reports.filter((report) => report.status === 'approved')

  return (
    <section className="mvp-page" aria-labelledby="mvp-title">
      <div className="mvp-intro">
        <p className="eyebrow">HuskyPath</p>
        <h1 id="mvp-title">Find a better way across UW</h1>
        <p>
          HuskyPath helps students and campus visitors compare walking routes,
          avoid stair-heavy paths when possible, and check basic building
          details before heading across the University of Washington campus.
        </p>
      </div>

      <section className="mvp-section" aria-labelledby="media-title">
        <div>
          <p className="eyebrow">Audio Guide</p>
          <h2 id="media-title">Example route instructions</h2>
          <p>
            Listen to a sample walkthrough for planning a route, switching route
            modes, and reporting path issues.
          </p>
        </div>
        <div className="media-panel">
          <audio
            aria-describedby="audio-transcript"
            controls
            preload="metadata"
            src={routeAudioSrc}
          >
            Your browser does not support the audio element.
          </audio>
          <p id="audio-transcript">
            Transcript: {audioTranscript}
          </p>
        </div>
      </section>

      <section className="mvp-section" aria-labelledby="tutorial-title">
        <div>
          <p className="eyebrow">Tutorial</p>
          <h2 id="tutorial-title">How to use HuskyPath</h2>
        </div>
        <ol className="tutorial-grid">
          {tutorialSteps.map((step) => (
            <li className="tutorial-card" key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mvp-section" aria-labelledby="reports-title">
        <div>
          <p className="eyebrow">Community Updates</p>
          <h2 id="reports-title">Review reported path issues</h2>
          <p>
            Submitted pins stay pending until the team approves them, so the map
            can show helpful issues without immediately publishing every report.
          </p>
        </div>

        <div className="report-admin-grid">
          <article className="report-queue">
            <h3>Pending review</h3>
            {pendingReports.length === 0 ? (
              <p>No pending reports yet. Drop a pin on the map to test this.</p>
            ) : (
              pendingReports.map((report) => (
                <div className="report-row" key={report.id}>
                  <div>
                    <strong>{getReportType(report.type).label}</strong>
                    <span>{report.note || 'No note added'}</span>
                  </div>
                  <div className="report-row-actions">
                    <button onClick={() => dismissReport(report.id)} type="button">
                      Dismiss
                    </button>
                    <button onClick={() => approveReport(report.id)} type="button">
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </article>

          <article className="report-queue">
            <h3>Approved map pins</h3>
            <strong className="report-count">{approvedReports.length}</strong>
            <p>
              Approved pins appear on the Leaflet map with the issue type, note,
              coordinates, status, and created time.
            </p>
          </article>
        </div>
      </section>

      <section className="mvp-section" aria-labelledby="personas-title">
        <div>
          <p className="eyebrow">Users</p>
          <h2 id="personas-title">Who we are testing for</h2>
        </div>
        <div className="persona-grid">
          {personas.map((persona) => (
            <article className="persona-card" key={persona.name}>
              <h3>{persona.name}</h3>
              <p>{persona.need}</p>
              <strong>{persona.support}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
