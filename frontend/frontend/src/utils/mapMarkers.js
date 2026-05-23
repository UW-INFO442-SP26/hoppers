import L from 'leaflet'

export const getMarkerIcon = (label, type = 'building') =>
  L.divIcon({
    className: `hp-map-marker ${type}`,
    html: `<span>${label}</span>`,
    iconSize: type === 'origin' ? [74, 34] : [54, 54],
    iconAnchor: type === 'origin' ? [37, 17] : [27, 27],
  })

// Separate icon for user reports (keeps concerns isolated from building markers)
export const getReportIcon = (type) =>
  L.divIcon({
    className: `hp-map-marker report ${type}`,
    html: `<div class="hp-report-dot"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
