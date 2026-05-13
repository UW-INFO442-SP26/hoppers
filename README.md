# HuskyPath

HuskyPath is a UW campus navigation prototype for previewing walking routes between campus buildings. It uses a real OpenStreetMap base layer and pedestrian routing from Valhalla so route previews follow actual campus paths instead of a placeholder map.

## Features

- Selectable start and destination points around the UW Seattle campus
- Real OpenStreetMap rendering with campus markers
- Pedestrian route geometry and step-by-step directions
- Route options for fastest, accessible, and simpler walking paths
- Building details for hours, bathrooms, accessibility, and services
- Responsive UI based on the HuskyPath Figma direction

## Ready to Test Feature

The first feature ready for public testing is the A-to-B campus route planner.

Test script:

1. Open the deployed HuskyPath site.
2. Change `Current Location` to `Mary Gates Hall`.
3. Change `To` to `Kane Hall`.
4. Confirm the title changes to `Mary Gates Hall to Kane Hall`.
5. Confirm the map route, time, distance, step-by-step directions, and Kane Hall details update.
6. Press `Swap` and confirm the route reverses.

Expected result: a tester can choose two campus places and get a usable walking route preview without logging in.

## How It Works

React owns the current start, destination, and route option. When those values change, the app sends the selected coordinates to Valhalla's pedestrian routing endpoint and stores the returned distance, duration, route shape, and directions. Leaflet then draws that shape on top of OpenStreetMap.

More detail is in [docs/architecture.md](docs/architecture.md).
