export function AppHeader({
  destinationId,
  handleDestinationChange,
  places,
  startId,
}) {
  return (
    <header className="app-bar">
      <a className="brand-lockup" href="#route-title" aria-label="HuskyPath home">
        <span className="brand-mark" aria-hidden="true">
          <span></span>
        </span>
        <strong>HuskyPath</strong>
      </a>

      <label className="top-search" htmlFor="top-destination">
        <span>Search map</span>
        <select
          id="top-destination"
          value={destinationId}
          onChange={handleDestinationChange}
        >
          {places.map((place) => (
            <option
              disabled={place.id === startId}
              key={place.id}
              value={place.id}
            >
              {place.name}
            </option>
          ))}
        </select>
      </label>
    </header>
  )
}
