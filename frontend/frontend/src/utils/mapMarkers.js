import L from 'leaflet'

export const getMarkerIcon = (label, type = 'building') =>
  L.divIcon({
    className: `hp-map-marker ${type}`,
    html: `<span>${label}</span>`,
    iconSize: type === 'origin' ? [74, 34] : [54, 54],
    iconAnchor: type === 'origin' ? [37, 17] : [27, 27],
  })
