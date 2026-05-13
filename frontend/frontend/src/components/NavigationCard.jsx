export function NavigationCard({ primaryStep, routeData }) {
  return (
    <section className="navigation-card" aria-live="polite">
      <p className="eyebrow">Live Navigation</p>
      <h2>{primaryStep}</h2>
      <div className="nav-distance">{routeData.distance}</div>
      <p className={`source-note ${routeData.status}`}>{routeData.source}</p>
    </section>
  )
}
