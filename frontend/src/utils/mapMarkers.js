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

export const getStairIcon = () =>
  L.divIcon({
    className: 'hp-map-marker stair-warning',
    html: `
      <svg class="hp-stair-icon" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
        <path class="hp-stair-steps" d="M6 27v-5h6v-5h6v-5h6V7h7v20H6Z" />
        <circle cx="27" cy="8" r="5" />
        <path class="hp-stair-alert" d="M27 5.5v3.4" />
        <circle class="hp-stair-alert-dot" cx="27" cy="11.2" r="0.9" />
      </svg>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
