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

const decodeValhallaShape = (encodedShape) => {
  let index = 0
  let lat = 0
  let lon = 0
  const coordinates = []

  while (index < encodedShape.length) {
    let shift = 0
    let result = 0
    let byte

    do {
      byte = encodedShape.charCodeAt(index) - 63
      index += 1
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0
    result = 0

    do {
      byte = encodedShape.charCodeAt(index) - 63
      index += 1
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lon += result & 1 ? ~(result >> 1) : result >> 1
    coordinates.push([lat / 1000000, lon / 1000000])
  }

  return coordinates
}

export const buildFallbackRoute = (start, destination, route) => {
  const isRedSquareToMGH =
    start.id === 'red-square' && destination.id === 'mgh'

  const path = isRedSquareToMGH
    ? [
        start.latLng,
        [47.65627, -122.30695],
        [47.65592, -122.30675],
        [47.65563, -122.30655],
        [47.65539, -122.30638],
        [47.65516, -122.30623],
        destination.latLng,
      ]
    : [start.latLng, destination.latLng]

  const metrics = getRouteMetrics(path)

  return {
    path,
    steps: [
      `Start at ${start.name}.`,
      `Follow the highlighted ${route.label.toLowerCase()} walking route on campus paths.`,
      `Continue along the walkway toward ${destination.zone.toLowerCase()}.`,
      `Arrive at ${destination.name}.`,
    ],
    ...metrics,
    source: 'Fallback campus preview',
    status: 'fallback',
  }
}


export const getValhallaRoute = async (start, destination, route, signal) => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY

  if (!apiKey) {
    throw new Error('Missing OpenRouteService API key')
  }

  const response = await fetch(
    'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
    {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [start.latLng[1], start.latLng[0]],
          [destination.latLng[1], destination.latLng[0]],
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

    distance: `${(summary.distance / 1609.34).toFixed(2)} mi`,

    duration: Math.max(
      1,
      Math.round((summary.duration ?? 60) / 60),
    ),

    lengthMiles: Number((summary.distance / 1609.34).toFixed(3)),

    source: 'Pedestrian route from OpenRouteService',

    status: 'ready',
  }
}