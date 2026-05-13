export function BuildingDetails({ focusRouteOnMap, selectedBuilding }) {
  return (
    <aside className="details-panel" aria-labelledby="details-title">
      <button
        className="back-button"
        onClick={focusRouteOnMap}
        type="button"
        aria-label="Recenter map on current route"
      >
        &lt;
      </button>

      <p className="building-type">Academic Building</p>
      <h2 id="details-title">{selectedBuilding.name}</h2>
      <p className="building-code">{selectedBuilding.shortName}</p>

      <div className="details-actions">
        <button onClick={focusRouteOnMap} type="button">
          Directions
        </button>
      </div>

      <section aria-labelledby="amenities-title">
        <h3 id="amenities-title">Building Amenities</h3>
        <div className="info-list">
          <article>
            <span>Restrooms Available</span>
            <strong>{selectedBuilding.bathrooms}</strong>
          </article>
          <article>
            <span>Fully Accessible</span>
            <strong>{selectedBuilding.accessibility}</strong>
          </article>
          <article>
            <span>Open Hours</span>
            <strong>{selectedBuilding.hours}</strong>
          </article>
        </div>
      </section>

      <section aria-labelledby="services-title">
        <h3 id="services-title">Departments & Services</h3>
        <div className="service-tags">
          {selectedBuilding.services.map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      </section>
    </aside>
  )
}
