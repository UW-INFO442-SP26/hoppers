import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AppHeader } from './components/AppHeader'
import { BuildingDetails } from './components/BuildingDetails'
import { CampusMap } from './components/CampusMap'
import { NavigationCard } from './components/NavigationCard'
import { RouteAlert } from './components/RouteAlert'
import { RoutePanel } from './components/RoutePanel'
import { places } from './data/places'
import { routeOptions } from './data/routeOptions'
import { getMarkerIcon, getReportIcon } from './utils/mapMarkers'
import { buildFallbackRoute, getValhallaRoute } from './utils/routing'
import './App.css'

function App() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerLayerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const reportsLayerRef = useRef(null)
  const [startId, setStartId] = useState('red-square')
  const [destinationId, setDestinationId] = useState('mgh')
  const [routeId, setRouteId] = useState('accessible')
  const [clockStart] = useState(() => Date.now())
  const [preferences, setPreferences] = useState({
    avoidStairs: true,
    preferCovered: false,
  })

  // Pin-drop state
  const [reports, setReports] = useState([])
  const [pendingPin, setPendingPin] = useState(null)
  const [pendingType, setPendingType] = useState('pothole')

  const startLocation = useMemo(
    () => places.find((place) => place.id === startId),
    [startId],
  )

  const selectedBuilding = useMemo(
    () => places.find((place) => place.id === destinationId),
    [destinationId],
  )

  const selectedRoute = useMemo(() => {
    if (preferences.avoidStairs) {
      return routeOptions.find((route) => route.id === 'accessible')
    }
    if (preferences.preferCovered) {
      return routeOptions.find((route) => route.id === 'sheltered')
    }
    return routeOptions.find((route) => route.id === routeId)
  }, [preferences.avoidStairs, preferences.preferCovered, routeId])

  const [routeData, setRouteData] = useState(() =>
    buildFallbackRoute(
      places.find((place) => place.id === 'red-square'),
      places.find((place) => place.id === 'mgh'),
      routeOptions.find((route) => route.id === 'accessible'),
    ),
  )

  useEffect(() => {
    if (!startLocation || !selectedBuilding || !selectedRoute) {
      return undefined
    }

    const fallbackRoute = buildFallbackRoute(
      startLocation,
      selectedBuilding,
      selectedRoute,
    )

    const controller = new AbortController()

    const loadingTimer = window.setTimeout(() => {
      setRouteData({
        ...fallbackRoute,
        source: 'Calculating pedestrian route...',
        status: 'loading',
      })
    }, 0)

    getValhallaRoute(
      startLocation,
      selectedBuilding,
      selectedRoute,
      controller.signal,
    )
      .then((route) => {
        setRouteData(route)
      })
      .catch((error) => {
        console.error('Valhalla failed:', error)

        if (!controller.signal.aborted) {
          setRouteData(fallbackRoute)
        }
      })

    return () => {
      window.clearTimeout(loadingTimer)
      controller.abort()
    }
  }, [startLocation, selectedBuilding, selectedRoute])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return undefined
    }

    const map = L.map(mapRef.current, {
      center: [47.65635, -122.3083],
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    markerLayerRef.current = L.layerGroup().addTo(map)
    routeLayerRef.current = L.layerGroup().addTo(map)
    reportsLayerRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    // Click to drop a pin (ignore if already placing one)
    map.on('click', (e) => {
      if (pendingPin) return
      setPendingPin({ latLng: [e.latlng.lat, e.latlng.lng] })
    })

    window.setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerLayerRef.current = null
      routeLayerRef.current = null
      reportsLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const markerLayer = markerLayerRef.current
    const routeLayer = routeLayerRef.current

    if (!map || !markerLayer || !routeLayer || !startLocation || !selectedBuilding) {
      return
    }

    markerLayer.clearLayers()
    routeLayer.clearLayers()

    if (routeData.path.length > 1) {
      L.polyline(routeData.path, {
        color: selectedRoute.id === 'accessible' ? '#3d6f46' : '#9a6634',
        weight: 6,
        opacity: 0.88,
        lineCap: 'round',
      }).addTo(routeLayer)
    }

    places.forEach((place) => {
      const markerType =
        place.id === startLocation.id
          ? 'origin'
          : place.id === selectedBuilding.id
            ? 'selected'
            : 'building'

      L.marker(place.latLng, {
        icon: getMarkerIcon(
          place.id === startLocation.id ? 'Start' : place.shortName,
          markerType,
        ),
        keyboard: true,
        title: place.name,
      })
        .on('click', () => {
          if (place.id !== startLocation.id) {
            setDestinationId(place.id)
          }
        })
        .bindTooltip(
          place.id === startLocation.id ? `Start: ${place.name}` : place.name,
          { direction: 'top' },
        )
        .addTo(markerLayer)
    })

    const bounds = L.latLngBounds(
      routeData.path.length > 1
        ? routeData.path
        : [startLocation.latLng, selectedBuilding.latLng],
    )

    map.fitBounds(bounds.pad(0.45), {
      animate: false,
      maxZoom: 17,
    })
  }, [routeData.path, selectedRoute.id, startLocation, selectedBuilding])

  // Temporary marker for pending pin
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !pendingPin) return

    const tempMarker = L.marker(pendingPin.latLng, {
      // small dot instead of labeled marker
      icon: getReportIcon('pending'),
    }).addTo(map)

    return () => {
      map.removeLayer(tempMarker)
    }
  }, [pendingPin])

  // Render approved reports
  useEffect(() => {
    const layer = reportsLayerRef.current
    if (!layer) return

    layer.clearLayers()

    reports.forEach((report) => {
      if (report.status !== 'approved') return

      L.marker(report.latLng, {
        icon: getReportIcon(report.type),
      }).addTo(layer)
    })
  }, [reports])

  const handleStartChange = (event) => {
    const nextStartId = event.target.value
    setStartId(nextStartId)

    if (nextStartId === destinationId) {
      const nextDestination = places.find((place) => place.id !== nextStartId)
      setDestinationId(nextDestination.id)
    }
  }

  const handleDestinationChange = (event) => {
    const nextDestinationId = event.target.value

    if (nextDestinationId !== startId) {
      setDestinationId(nextDestinationId)
    }
  }

  const swapRoute = () => {
    setStartId(destinationId)
    setDestinationId(startId)
  }

  const focusRouteOnMap = () => {
    const map = mapInstanceRef.current

    if (!map || !startLocation || !selectedBuilding) {
      return
    }

    const bounds = L.latLngBounds(
      routeData.path.length > 1
        ? routeData.path
        : [startLocation.latLng, selectedBuilding.latLng],
    )

    map.fitBounds(bounds.pad(0.45), {
      animate: true,
      maxZoom: 17,
    })
  }

  const arrivalTime = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(clockStart + routeData.duration * 60000)),
    [clockStart, routeData.duration],
  )

  const primaryStep =
    routeData.steps[0] ?? `Head toward ${selectedBuilding?.name ?? 'destination'}.`

  const submitReport = () => {
    if (!pendingPin) return

    const newReport = {
      id: Date.now(),
      latLng: pendingPin.latLng,
      type: pendingType,
      status: 'approved',
    }

    setReports((prev) => [...prev, newReport])
    setPendingPin(null)
    setPendingType('pothole')
  }

  return (
    <main className="app-shell">
      <AppHeader
        destinationId={destinationId}
        handleDestinationChange={handleDestinationChange}
        places={places}
        startId={startId}
      />

      <section className="map-stage" aria-labelledby="route-title">
        <CampusMap
          ref={mapRef}
          selectedBuilding={selectedBuilding}
          startLocation={startLocation}
        />

        {pendingPin && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 2000,
            }}
          >
            <div
              className="pin-form"
              style={{
                background: '#fff',
                padding: 16,
                borderRadius: 10,
                minWidth: 240,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 600 }}>
                Report an issue
              </div>

              <select
                value={pendingType}
                onChange={(e) => setPendingType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="pothole">Pothole</option>
                <option value="graffiti">Graffiti</option>
                <option value="streetlight">Streetlight</option>
              </select>

              <div
                style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}
              >
                <button onClick={() => setPendingPin(null)}>Cancel</button>
                <button onClick={submitReport}>Submit</button>
              </div>
            </div>
          </div>
        )}

        <RoutePanel
          arrivalTime={arrivalTime}
          destinationId={destinationId}
          focusRouteOnMap={focusRouteOnMap}
          handleDestinationChange={handleDestinationChange}
          handleStartChange={handleStartChange}
          places={places}
          routeData={routeData}
          routeOptions={routeOptions}
          selectedBuilding={selectedBuilding}
          selectedRoute={selectedRoute}
          setPreferences={setPreferences}
          setRouteId={setRouteId}
          startId={startId}
          startLocation={startLocation}
          swapRoute={swapRoute}
        />

        <NavigationCard primaryStep={primaryStep} routeData={routeData} />

        <RouteAlert focusRouteOnMap={focusRouteOnMap} routeData={routeData} />

        <BuildingDetails
          focusRouteOnMap={focusRouteOnMap}
          selectedBuilding={selectedBuilding}
        />
      </section>
    </main>
  )
}

export default App
