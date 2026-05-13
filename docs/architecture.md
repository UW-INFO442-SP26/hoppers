# Frontend Architecture

HuskyPath is a React and Vite frontend. The app keeps campus data locally for the prototype, asks Valhalla for pedestrian directions, and renders the route on a Leaflet map using OpenStreetMap tiles.

## Main Flow

1. The user chooses a start and destination in the route panel.
2. `App.jsx` stores those ids in React state.
3. The selected ids are matched to campus place records from `src/data/places.js`.
4. A route request is sent to Valhalla with the two coordinates.
5. The returned route shape is decoded into coordinates.
6. Leaflet redraws the map route and building markers.
7. The panels display distance, time, directions, and building details.

## File Map

- `src/App.jsx` owns the map lifecycle and route state.
- `src/data/places.js` stores the prototype building records.
- `src/data/routeOptions.js` stores the route modes and Valhalla costing options.
- `src/utils/routing.js` contains the Valhalla call, shape decoding, and fallback route.
- `src/utils/mapMarkers.js` creates Leaflet marker icons.
- `src/components/` contains the header, route panel, live navigation card, alert, map node, and building details panel.
- `src/styles/` splits the visual styling into base, header, map, panel, and responsive rules.

## Current Limits

- Building metadata is curated prototype data, not an official UW API.
- Live GPS is not connected yet.
- Construction closures are represented as UI states, not real-time closure data.
- Accessible routing depends on the completeness of OpenStreetMap pedestrian data.
