const metersPerMile = 1609.344

const toRadians = (degrees) => (degrees * Math.PI) / 180

const distanceMeters = ([lat1, lon1], [lat2, lon2]) => {
  const earthRadiusMeters = 6371000
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMeters * c
}

const getRouteMetrics = (path) => {
  const meters = path.reduce((total, coordinate, index) => {
    if (index === 0) {
      return total
    }

    return total + distanceMeters(path[index - 1], coordinate)
  }, 0)
  const miles = meters / metersPerMile
  const minutes = Math.max(1, Math.round((miles / 3) * 60))

  return {
    distance: `${miles.toFixed(2)} mi`,
    duration: minutes,
    lengthMiles: Number(miles.toFixed(3)),
  }
}

const campusNodes = {
  redSquare: {
    label: 'Red Square',
    latLng: [47.65623, -122.30878],
  },
  suzzalloEntry: {
    label: 'Suzzallo Library',
    latLng: [47.65596, -122.3085],
  },
  allenEntry: {
    label: 'Allen Library',
    latLng: [47.65564, -122.30755],
  },
  kaneEntry: {
    label: 'Kane Hall',
    latLng: [47.65648, -122.30913],
  },
  odegaardEntry: {
    label: 'Odegaard Library',
    latLng: [47.65638, -122.31002],
  },
  odegaardSouth: {
    label: 'Odegaard south walkway',
    latLng: [47.65572, -122.31028],
  },
  gouldWalkway: {
    label: 'Gould Hall walkway',
    latLng: [47.65491, -122.31015],
  },
  architectureEntry: {
    label: 'Architecture Hall',
    latLng: [47.65482, -122.31058],
  },
  mghNorth: {
    label: 'Mary Gates Hall',
    latLng: [47.65512, -122.3079],
  },
  mghEast: {
    label: 'Mary Gates east path',
    latLng: [47.65498, -122.30705],
  },
  hubWest: {
    label: 'HUB west walkway',
    latLng: [47.65524, -122.30576],
  },
  hubEntry: {
    label: 'Husky Union Building',
    latLng: [47.6553, -122.30555],
  },
  hubNorthWalk: {
    label: 'HUB north walkway',
    latLng: [47.65608, -122.30588],
  },
  fountainNorth: {
    label: 'Fountain north path',
    latLng: [47.65444, -122.30792],
  },
  fountain: {
    label: 'Drumheller Fountain',
    latLng: [47.653707, -122.307953],
  },
  fountainWest: {
    label: 'Fountain west path',
    latLng: [47.65372, -122.30902],
  },
  bagleyEntry: {
    label: 'Bagley Hall',
    latLng: [47.65346, -122.30884],
  },
  quadSouth: {
    label: 'Quad south path',
    latLng: [47.65704, -122.30845],
  },
  quadCenter: {
    label: 'The Quad',
    latLng: [47.657816, -122.307739],
  },
  stevensWay: {
    label: 'Stevens Way crossing',
    latLng: [47.65837, -122.30765],
  },
  quadWest: {
    label: 'Quad west path',
    latLng: [47.65772, -122.30892],
  },
  paccarSouth: {
    label: 'Paccar south walk',
    latLng: [47.65854, -122.30861],
  },
  paccarEntry: {
    label: 'Paccar Hall',
    latLng: [47.65878, -122.30863],
  },
}

const campusEdges = [
  ['redSquare', 'suzzalloEntry', {
    main: true,
    points: [[47.65606, -122.30846]],
  }],
  ['redSquare', 'allenEntry', {
    main: true,
    points: [[47.65598, -122.30835], [47.65572, -122.30781]],
  }],
  ['redSquare', 'mghNorth', {
    main: true,
    points: [[47.65594, -122.30863], [47.65553, -122.30828]],
  }],
  ['redSquare', 'kaneEntry', {
    stairs: true,
    points: [[47.65641, -122.30894]],
  }],
  ['redSquare', 'odegaardEntry', {
    stairs: true,
    points: [[47.65635, -122.30948], [47.65642, -122.30993]],
  }],
  ['redSquare', 'quadSouth', {
    main: true,
    points: [[47.65652, -122.3086]],
  }],
  ['suzzalloEntry', 'allenEntry', {
    main: true,
    covered: true,
    points: [[47.65566, -122.30769]],
  }],
  ['allenEntry', 'mghNorth', {
    main: true,
    points: [[47.65521, -122.30757]],
  }],
  ['allenEntry', 'fountainNorth', {
    main: true,
    points: [[47.65508, -122.30756], [47.65468, -122.30777]],
  }],
  ['mghNorth', 'gouldWalkway', {
    main: true,
    points: [[47.65488, -122.30865], [47.65488, -122.30942]],
  }],
  ['mghNorth', 'fountainNorth', {
    main: true,
    points: [[47.65466, -122.30784]],
  }],
  ['mghNorth', 'mghEast', {
    main: true,
    points: [[47.65491, -122.30743]],
  }],
  ['mghEast', 'hubWest', {
    main: true,
    points: [[47.65506, -122.30658], [47.65518, -122.30614]],
  }],
  ['hubWest', 'hubEntry', {
    main: true,
    points: [[47.6553, -122.30543]],
  }],
  ['hubEntry', 'hubNorthWalk', {
    main: true,
    points: [[47.65568, -122.30566]],
  }],
  ['hubNorthWalk', 'stevensWay', {
    main: true,
    points: [
      [47.65676, -122.30622],
      [47.65742, -122.3069],
      [47.65796, -122.30742],
    ],
  }],
  ['fountainNorth', 'fountain', {
    main: true,
    points: [[47.6541, -122.30794]],
  }],
  ['fountain', 'bagleyEntry', {
    main: true,
    points: [[47.65356, -122.30842], [47.65344, -122.30879]],
  }],
  ['fountain', 'fountainWest', {
    main: true,
    points: [[47.6537, -122.30848]],
  }],
  ['fountainWest', 'bagleyEntry', {
    main: true,
    points: [[47.6535, -122.30905]],
  }],
  ['fountainWest', 'gouldWalkway', {
    main: true,
    points: [[47.65416, -122.30935], [47.65458, -122.30975]],
  }],
  ['gouldWalkway', 'architectureEntry', {
    main: true,
    points: [[47.65484, -122.31047]],
  }],
  ['gouldWalkway', 'odegaardSouth', {
    main: true,
    points: [[47.65528, -122.31022]],
  }],
  ['odegaardSouth', 'odegaardEntry', {
    main: true,
    points: [[47.65604, -122.31035]],
  }],
  ['quadSouth', 'kaneEntry', {
    main: true,
    points: [[47.65682, -122.30886]],
  }],
  ['quadSouth', 'quadCenter', {
    main: true,
    points: [[47.65738, -122.30814]],
  }],
  ['quadCenter', 'quadWest', {
    main: true,
    points: [[47.65778, -122.30834]],
  }],
  ['quadWest', 'paccarSouth', {
    main: true,
    points: [[47.65812, -122.30882]],
  }],
  ['quadCenter', 'stevensWay', {
    main: true,
    points: [[47.65805, -122.30768]],
  }],
  ['stevensWay', 'paccarEntry', {
    main: true,
    points: [[47.65864, -122.30791], [47.65891, -122.3083]],
  }],
  ['paccarSouth', 'paccarEntry', {
    main: true,
    points: [[47.65883, -122.30862]],
  }],
]

const getEdgePath = (fromNode, toNode, metadata) => [
  fromNode.latLng,
  ...(metadata.points ?? []),
  toNode.latLng,
]

const getPathDistance = (path) =>
  path.reduce((total, coordinate, index) => {
    if (index === 0) {
      return total
    }

    return total + distanceMeters(path[index - 1], coordinate)
  }, 0)

const edgeWeight = (fromNode, toNode, metadata, route) => {
  const baseDistance = getPathDistance(getEdgePath(fromNode, toNode, metadata))
  const stairPenalty =
    metadata.stairs && route.id === 'accessible'
      ? 760
      : metadata.stairs && route.id !== 'stairs'
        ? 90
        : 0
  const mainWalkwayPenalty =
    route.id === 'sheltered' && !metadata.main ? 90 : 0
  const coveredBonus = route.id === 'sheltered' && metadata.covered ? -24 : 0

  return Math.max(1, baseDistance + stairPenalty + mainWalkwayPenalty + coveredBonus)
}

const getEdgeWaypoints = (fromNodeId, toNodeId) => {
  const edge = campusEdges.find(
    ([edgeFromId, edgeToId]) =>
      (edgeFromId === fromNodeId && edgeToId === toNodeId) ||
      (edgeFromId === toNodeId && edgeToId === fromNodeId),
  )

  if (!edge) {
    return []
  }

  const [edgeFromId, , metadata] = edge
  const waypoints = metadata.points ?? []

  return edgeFromId === fromNodeId ? waypoints : [...waypoints].reverse()
}

const findCampusPath = (startNodeId, destinationNodeId, route) => {
  if (!startNodeId || !destinationNodeId || !campusNodes[startNodeId] || !campusNodes[destinationNodeId]) {
    return []
  }

  const distances = new Map([[startNodeId, 0]])
  const previous = new Map()
  const unvisited = new Set(Object.keys(campusNodes))

  while (unvisited.size > 0) {
    let currentNodeId = null
    let currentDistance = Infinity

    unvisited.forEach((nodeId) => {
      const nodeDistance = distances.get(nodeId) ?? Infinity

      if (nodeDistance < currentDistance) {
        currentDistance = nodeDistance
        currentNodeId = nodeId
      }
    })

    if (!currentNodeId || currentNodeId === destinationNodeId) {
      break
    }

    unvisited.delete(currentNodeId)

    campusEdges.forEach(([fromId, toId, metadata]) => {
      const neighborId =
        fromId === currentNodeId ? toId : toId === currentNodeId ? fromId : null

      if (!neighborId || !unvisited.has(neighborId)) {
        return
      }

      const alternateDistance =
        currentDistance +
        edgeWeight(campusNodes[currentNodeId], campusNodes[neighborId], metadata, route)

      if (alternateDistance < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, alternateDistance)
        previous.set(neighborId, currentNodeId)
      }
    })
  }

  if (startNodeId !== destinationNodeId && !previous.has(destinationNodeId)) {
    return []
  }

  const nodePath = [destinationNodeId]
  let currentNodeId = destinationNodeId

  while (currentNodeId !== startNodeId) {
    currentNodeId = previous.get(currentNodeId)

    if (!currentNodeId) {
      return []
    }

    nodePath.unshift(currentNodeId)
  }

  return nodePath
}

const samePoint = (firstPoint, secondPoint) =>
  Math.abs(firstPoint[0] - secondPoint[0]) < 0.000001 &&
  Math.abs(firstPoint[1] - secondPoint[1]) < 0.000001

const appendCoordinate = (path, coordinate) => {
  if (path.length === 0 || !samePoint(path[path.length - 1], coordinate)) {
    path.push(coordinate)
  }
}

const getRoutePoint = (place) =>
  campusNodes[place.routeNode]?.latLng ?? place.latLng

const getFallbackSteps = (start, destination, route, nodePath) => {
  const connectors = nodePath
    .slice(1, -1)
    .map((nodeId) => campusNodes[nodeId]?.label)
    .filter(Boolean)
    .filter((label, index, labels) => labels.indexOf(label) === index)
    .slice(0, 3)

  const routeGuidance =
    route.id === 'accessible'
      ? 'Use the highlighted step-free campus walkways and avoid the stair warning markers.'
      : route.id === 'stairs'
        ? 'Take the highlighted direct campus path; it may include stair transitions.'
        : 'Follow the highlighted campus walkways toward the destination.'

  return [
    `Start at ${start.name}.`,
    routeGuidance,
    connectors.length > 0
      ? `Continue by ${connectors.join(', ')}.`
      : `Continue toward ${destination.zone.toLowerCase()}.`,
    `Arrive at ${destination.name}.`,
  ]
}

export const buildFallbackRoute = (start, destination, route) => {
  const nodePath = findCampusPath(start.routeNode, destination.routeNode, route)
  const path = []

  if (nodePath.length > 0) {
    nodePath.forEach((nodeId, index) => {
      if (index > 0) {
        getEdgeWaypoints(nodePath[index - 1], nodeId).forEach((coordinate) =>
          appendCoordinate(path, coordinate),
        )
      }

      appendCoordinate(path, campusNodes[nodeId].latLng)
    })
  } else {
    appendCoordinate(path, start.latLng)
    appendCoordinate(path, destination.latLng)
  }

  const metrics = getRouteMetrics(path)

  return {
    path,
    steps: getFallbackSteps(start, destination, route, nodePath),
    ...metrics,
    source: 'Local UW campus walkway preview',
    status: 'fallback',
  }
}


export const getValhallaRoute = async (start, destination, route, signal) => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY
  const profile = route.orsProfile ?? 'foot-walking'
  const startPoint = getRoutePoint(start)
  const destinationPoint = getRoutePoint(destination)

  if (!apiKey) {
    throw new Error('Missing OpenRouteService API key')
  }

  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [startPoint[1], startPoint[0]],
          [destinationPoint[1], destinationPoint[0]],
        ],
        preference: 'recommended',
        instructions: true,
      }),
      signal,
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `OpenRouteService failed: ${response.status} ${errorText}`,
    )
  }

  const data = await response.json()

  const feature = data.features?.[0]

  if (!feature?.geometry?.coordinates?.length) {
    throw new Error('No route geometry returned')
  }

  const path = feature.geometry.coordinates.map(([lon, lat]) => [lat, lon])

  const summary = feature.properties?.summary ?? {}
  const computedMetrics = getRouteMetrics(path)

  const steps =
    feature.properties?.segments?.[0]?.steps
      ?.map((step) => step.instruction)
      .filter(Boolean)
      .slice(0, 8) ?? []

  return {
    path,
    steps:
      steps.length > 0
        ? steps
        : [`Start at ${start.name}.`, `Arrive at ${destination.name}.`],

    distance:
      typeof summary.distance === 'number'
        ? `${(summary.distance / 1609.34).toFixed(2)} mi`
        : computedMetrics.distance,

    duration: Math.max(
      1,
      Math.round((summary.duration ?? computedMetrics.duration * 60) / 60),
    ),

    lengthMiles:
      typeof summary.distance === 'number'
        ? Number((summary.distance / 1609.34).toFixed(3))
        : computedMetrics.lengthMiles,

    source: `Pedestrian route from OpenRouteService (${profile})`,

    status: 'ready',
  }
}
