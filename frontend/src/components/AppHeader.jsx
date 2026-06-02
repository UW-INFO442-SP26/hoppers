export function AppHeader({
  activeView,
  destinationId,
  handleDestinationChange,
  places,
  setActiveView,
  startId,
}) {
  return (
    <header className="app-bar">
      <a className="brand-lockup" href="#route-title" aria-label="HuskyPath home">
        <img
          alt=""
          aria-hidden="true"
          className="brand-mark"
          src={`${import.meta.env.BASE_URL}uw-w-logo.png`}
        />
        <strong>HuskyPath</strong>
      </a>

      <div className="header-actions">
        <nav className="view-tabs" aria-label="Primary views">
          <button
            aria-pressed={activeView === 'mvp'}
            className={activeView === 'mvp' ? 'active' : ''}
            onClick={() => setActiveView('mvp')}
            type="button"
          >
            Home
          </button>
          <button
            aria-pressed={activeView === 'map'}
            className={activeView === 'map' ? 'active' : ''}
            onClick={() => setActiveView('map')}
            type="button"
          >
            Map
          </button>
        </nav>

        {activeView === 'map' && (
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
        )}
      </div>
    </header>
  )
}
