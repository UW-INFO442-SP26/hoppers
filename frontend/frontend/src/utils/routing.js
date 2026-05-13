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
  const midpoint = [
    (start.latLng[0] + destination.latLng[0]) / 2,
    (start.latLng[1] + destination.latLng[1]) / 2,
  ]
  const routeNudge = {
    fastest: [0.00008, 0.00008],
    accessible: [-0.00015, -0.00008],
    sheltered: [-0.00005, 0.00016],
  }[route.id]
  const path = [
    start.latLng,
    [midpoint[0] + routeNudge[0], midpoint[1] + routeNudge[1]],
    destination.latLng,
  ]
  const metrics = getRouteMetrics(path)

  return {
    path,
    steps: [
      `Start at ${start.name}.`,
      `Follow the highlighted ${route.label.toLowerCase()} walking route across campus.`,
      `Continue toward ${destination.zone.toLowerCase()}.`,
      `Arrive at ${destination.name}.`,
    ],
    ...metrics,
    source: 'Fallback campus preview',
    status: 'fallback',
  }
}

export const getValhallaRoute = async (start, destination, route, signal) => {
  const response = await fetch('https://valhalla1.openstreetmap.de/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locations: [
        { lat: start.latLng[0], lon: start.latLng[1] },
        { lat: destination.latLng[0], lon: destination.latLng[1] },
      ],
      costing: 'pedestrian',
      costing_options: {
        pedestrian: route.costingOptions,
      },
      directions_options: {
        units: 'miles',
      },
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Routing failed: ${response.status}`)
  }

  const data = await response.json()
  const leg = data.trip?.legs?.[0]
  const path = leg?.shape ? decodeValhallaShape(leg.shape) : []

  if (path.length < 2) {
    throw new Error('Routing response did not include a usable route shape')
  }

  const summary = data.trip.summary ?? leg.summary ?? {}
  const steps =
    leg.maneuvers
      ?.map((maneuver) => maneuver.instruction)
      .filter(Boolean)
      .slice(0, 8) ?? []

  return {
    path,
    steps:
      steps.length > 0
        ? steps
        : [`Start at ${start.name}.`, `Arrive at ${destination.name}.`],
    distance: `${Number(summary.length ?? 0).toFixed(2)} mi`,
    duration: Math.max(1, Math.round((summary.time ?? 0) / 60)),
    lengthMiles: Number(summary.length ?? 0),
    source: 'Pedestrian route from OpenStreetMap/Valhalla',
    status: 'ready',
  }
}
