export function RouteAlert({ focusRouteOnMap, routeData }) {
  return (
    <article className={`route-alert ${routeData.status}`}>
      <div>
        <strong>
          {routeData.status === 'loading'
            ? 'Checking Route'
            : routeData.status === 'fallback'
              ? 'Preview Route'
              : 'Route Updated'}
        </strong>
        <span>
          {routeData.status === 'ready'
            ? 'Pedestrian route loaded from real campus map data.'
            : routeData.source}
        </span>
      </div>
      <button onClick={focusRouteOnMap} type="button">
        Update Route
      </button>
    </article>
  )
}
