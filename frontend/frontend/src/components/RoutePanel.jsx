export function RoutePanel({
  arrivalTime,
  destinationId,
  focusRouteOnMap,
  handleDestinationChange,
  handleStartChange,
  places,
  routeData,
  routeOptions,
  selectedBuilding,
  selectedRoute,
  setPreferences,
  setRouteId,
  startId,
  startLocation,
  swapRoute,
}) {
  return (
    <aside className="route-panel" aria-labelledby="route-title">
      <div className="panel-topline">
        <span className="round-icon" aria-hidden="true">
          &lt;
        </span>
        <div>
          <p className="eyebrow">Route Details</p>
          <h1 id="route-title">
            {startLocation.name} to {selectedBuilding.name}
          </h1>
        </div>
      </div>

      <div className="route-form" aria-label="Route search">
        <label htmlFor="start">Current Location</label>
        <select id="start" value={startId} onChange={handleStartChange}>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>

        <button className="swap-button" onClick={swapRoute} type="button">
          Swap
        </button>

        <label htmlFor="destination">To</label>
        <select
          id="destination"
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
      </div>

      <div className="route-tabs" aria-label="Route options">
        {routeOptions.map((route) => (
          <button
            className={route.id === selectedRoute.id ? 'active' : ''}
            key={route.id}
            onClick={() => {
              setRouteId(route.id)
              setPreferences((current) => ({
                ...current,
                avoidStairs: route.id === 'accessible',
                preferCovered: route.id === 'sheltered',
              }))
            }}
            type="button"
          >
            {route.label}
          </button>
        ))}
      </div>

      <div className="travel-summary" aria-live="polite">
        <strong>{routeData.duration} min</strong>
        <span>
          {routeData.distance} - ETA {arrivalTime}
        </span>
      </div>

      <button className="primary-action" onClick={focusRouteOnMap} type="button">
        Start Navigation
      </button>

      <section className="steps-panel" aria-labelledby="steps-title">
        <h2 id="steps-title">Step-by-step</h2>
        <ol>
          {routeData.steps.slice(0, 5).map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
