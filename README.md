# HuskyPath

HuskyPath is a campus navigation app designed to help students find buildings and routes more easily, with a special focus on accessibility-aware navigation. The system supports search, map display, route generation, detour handling, and optional user preferences for route customization.

---

## System Architecture and Technical Plan

### Key Components of the Software Architecture

#### 1. Client UI
The client side is built with React and provides:
- search for campus buildings and destinations
- interactive map display
- route options and previews
- building detail views

#### 2. Routing and Map Engine
This component is responsible for:
- maintaining the campus graph
- pathfinding logic
- accessibility filtering
- detour and closure handling

#### 3. Backend API
The backend exposes endpoints for:
- building data
- route generation
- path closures
- optional user preferences

#### 4. Database
The database stores:
- building metadata
- path attributes
- accessibility information
- construction and closure updates

#### 5. External Services
Possible external integrations include:
- **Leaflet** or **Mapbox** for map rendering
- an optional **weather API** for weather-aware routing

---

## How the Components Interact

1. The **Client UI** sends search queries and route requests to the **Backend API**.
2. The **Backend API** retrieves building and path data from the **Database**.
3. The **Backend API** calls the **Routing Engine** to generate a route.
4. The **Routing Engine** applies filters such as avoiding stairs or steep slopes.
5. The route, steps, and estimated time are returned to the **Client UI**.
6. The **Client UI** displays the route on the map and updates it when closures or preferences change.

This separation keeps the code modular and easier to maintain:
- UI logic stays in React
- routing logic stays in its own service
- data stays structured in the database

---

## Tech Stack

### Front End
- React
- JavaScript
- React Router
- Leaflet or Mapbox for map rendering  
  - possible future consideration: Google Maps API or UW API

### Backend
- Node.js
- Express

### Database
- Firebase Firestore  
  A flexible NoSQL database that fits building and path documents well.

### Tools
- VS Code
- GitHub
- Jest
- React Testing Library

---

## Hosting Plan

- **Front end:** Vercel or Netlify
- **Backend:** Render, Railway, or Firebase Cloud Functions
- **Database:** Firebase Firestore

This setup keeps deployment simple, affordable, and scalable for a student project.

---

## Database Structure

### Collection: `buildings`
Fields:
- `id`
- `name`
- `shortName`
- `coordinates`
- `entrances`
- `hours`
- `accessibilityInfo`
- `bathroomInfo`

### Collection: `paths`
Fields:
- `id`
- `startNode`
- `endNode`
- `distance`
- `isStairs`
- `isRamp`
- `slope`
- `isCovered`

### Collection: `closures`
Fields:
- `id`
- `affectedPathIds`
- `startDate`
- `endDate`
- `reason`

### Collection: `userPreferences` (optional)
Fields:
- `userId`
- `avoidStairs`
- `avoidHills`
- `preferPaved`
- `preferShortest`

---

## Backend Endpoints

### `GET /api/buildings`
Returns searchable campus destinations.

### `GET /api/buildings/:id`
Returns building details such as:
- hours
- accessibility information
- bathrooms

### `GET /api/routes`
Query parameters:
- `start`
- `end`
- `avoidStairs`
- `avoidHills`
- `preferPaved`

Returns:
- route geometry
- step-by-step directions
- estimated travel time

### `GET /api/closures`
Returns current construction zones or blocked paths.

### `POST /api/preferences` (optional)
Saves user route preferences.

---

## Unit Tests and Verification

### Search Tests
- partial building names return correct suggestions
- no-result searches show a helpful message

### Routing Tests
- valid start and end points return at least one route
- when `avoidStairs=true`, no stair segments appear
- when closures exist, routes avoid closed paths
- estimated travel time scales correctly with distance

### UI Tests
- selecting a building updates the map
- route preview updates when preferences change
- error messages appear when the backend is unavailable

### Error Handling Tests
- invalid coordinates return a clear error
- missing building IDs return a `404`

Testing tools:
- Jest
- React Testing Library
- supertest for backend endpoints

---

## Most Significant Design Decision

### Decision
Use a **custom campus graph** for routing instead of relying only on a generic maps API.

### Pros
- full control over pedestrian paths, shortcuts, and building entrances
- easy to encode accessibility attributes such as stairs, ramps, and slopes
- supports construction updates and detours in a way Google Maps cannot
- aligns directly with HuskyPath’s goal of campus-specific navigation

### Cons
- requires more initial setup to build and maintain the graph
- needs custom pathfinding logic
- requires updates when campus paths or buildings change

### Why We Chose It
The main value of HuskyPath is accurate, accessibility-aware campus navigation. Generic road-based APIs cannot provide the level of detail students need, especially for stairs, hills, and building entrances. A custom graph gives us the flexibility to support all required features and ensures the app solves real campus navigation problems.

---

## User Personas
### Our user personas can be viewed here: 
---

## Summary

HuskyPath is designed as a modular campus navigation system with:
- a React-based client UI
- a Node/Express backend
- a Firestore database
- a custom routing engine for accessibility-aware pathfinding

The project’s architecture emphasizes maintainability, scalability, and campus-specific accuracy, which makes it well-suited for a student-focused navigation tool.

