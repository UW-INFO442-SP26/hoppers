import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AppHeader } from './components/AppHeader'
import { BuildingDetails } from './components/BuildingDetails'
import { CampusMap } from './components/CampusMap'
import { MvpHub } from './components/MvpHub'
import { NavigationCard } from './components/NavigationCard'
import { ReportForm } from './components/ReportForm'
import { RouteAlert } from './components/RouteAlert'
import { RoutePanel } from './components/RoutePanel'
import { getReportType } from './data/reportTypes'
import { places } from './data/places'
import { routeOptions } from './data/routeOptions'
import { stairWarnings } from './data/stairWarnings'
import { getMarkerIcon, getReportIcon, getStairIcon } from './utils/mapMarkers'
import { buildFallbackRoute, getValhallaRoute } from './utils/routing'
import './App.css'

const reportStorageKey = 'huskypath-report-submissions'

const getRouteFitOptions = (animate = false) => {
  if (typeof window === 'undefined' || window.innerWidth <= 980) {
    return {
      animate,
      maxZoom: 17,
      padding: [26, 26],
    }
  }

  return {
    animate,
    maxZoom: 17,
    paddingTopLeft: [420, 132],
    paddingBottomRight: [380, 168],
  }
}

const readStoredReports = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedReports = window.localStorage.getItem(reportStorageKey)
    return storedReports ? JSON.parse(storedReports) : []
  } catch {
    return []
  }
}

function App() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerLayerRef = useRef(null)
  const routeLayerRef = useRef(null)
  const reportsLayerRef = useRef(null)
  const stairLayerRef = useRef(null)
  const [activeView, setActiveView] = useState('mvp')
  const [startId, setStartId] = useState('red-square')
  const [destinationId, setDestinationId] = useState('mgh')
  const [routeId, setRouteId] = useState('accessible')
  const [clockStart] = useState(() => Date.now())
  const [preferences, setPreferences] = useState({
    avoidStairs: true,
    allowStairs: false,
    preferCovered: false,
  })

  // Pin-drop state
  const [reports, setReports] = useState(readStoredReports)
  const [pendingPin, setPendingPin] = useState(null)
  const [pendingType, setPendingType] = useState('stairs')
  const [pendingNote, setPendingNote] = useState('')

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
    window.localStorage.setItem(reportStorageKey, JSON.stringify(reports))
  }, [reports])

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
    }, 300)

    getValhallaRoute(
      startLocation,
      selectedBuilding,
      selectedRoute,
      controller.signal,
    )
      .then((route) => {
        window.clearTimeout(loadingTimer)
        setRouteData(route)
      })
      .catch((error) => {
         window.clearTimeout(loadingTimer)
          if (error.name === 'AbortError' || controller.signal.aborted) {
             return
             }
          console.error('Routing API failed:', error)
          setRouteData(fallbackRoute)
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

    map.on('click', (e) => {
      console.log(
        `latLng: [${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}]`
       )
     })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    markerLayerRef.current = L.layerGroup().addTo(map)
    routeLayerRef.current = L.layerGroup().addTo(map)
    reportsLayerRef.current = L.layerGroup().addTo(map)
    stairLayerRef.current = L.layerGroup().addTo(map)
    mapInstanceRef.current = map

    map.on('click', (e) => {
      setPendingPin((currentPin) =>
        currentPin ?? { latLng: [e.latlng.lat, e.latlng.lng] },
      )
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
      stairLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = stairLayerRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()

    stairWarnings.forEach((warning) => {
      L.marker(warning.latLng, {
        icon: getStairIcon(),
        bubblingMouseEvents: false,
        keyboard: true,
        title: warning.label,
      })
        .bindTooltip(`${warning.label}: ${warning.description}`, {
          direction: 'top',
        })
        .addTo(layer)
    })
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
        bubblingMouseEvents: false,
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
        ? [...routeData.path, startLocation.latLng, selectedBuilding.latLng]
        : [startLocation.latLng, selectedBuilding.latLng],
    )

    map.fitBounds(bounds.pad(0.12), getRouteFitOptions(false))
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
        title: getReportType(report.type).label,
      })
        .bindTooltip(report.note || getReportType(report.type).description, {
          direction: 'top',
        })
        .addTo(layer)
    })
  }, [reports])

  useEffect(() => {
    if (activeView === 'map' && mapInstanceRef.current) {
      window.setTimeout(() => {
        mapInstanceRef.current?.invalidateSize()
      }, 0)
    }
  }, [activeView])

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
        ? [...routeData.path, startLocation.latLng, selectedBuilding.latLng]
        : [startLocation.latLng, selectedBuilding.latLng],
    )

    map.fitBounds(bounds.pad(0.12), getRouteFitOptions(true))
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
  const routeAnnouncement =
    routeData.status === 'loading'
      ? `Checking route from ${startLocation.name} to ${selectedBuilding.name}.`
      : `${selectedRoute.label} route from ${startLocation.name} to ${selectedBuilding.name}: ${routeData.duration} minutes, ${routeData.distance}. ${routeData.source}`

  const cancelReport = () => {
    setPendingPin(null)
    setPendingType('stairs')
    setPendingNote('')
  }

  const submitReport = () => {
    if (!pendingPin) return

    const newReport = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      latLng: pendingPin.latLng,
      note: pendingNote.trim(),
      type: pendingType,
      status: 'pending',
    }

    setReports((prev) => [...prev, newReport])
    cancelReport()
    setActiveView('mvp')
  }

  const approveReport = (reportId) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status: 'approved' } : report,
      ),
    )
  }

  const dismissReport = (reportId) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status: 'dismissed' } : report,
      ),
    )
  }

  return (
    <main className="app-shell">
      <a
        className="skip-link"
        href={activeView === 'map' ? '#route-title' : '#mvp-title'}
      >
        Skip to current content
      </a>
      <p className="sr-only" role="status" aria-live="polite">
        {routeAnnouncement}
      </p>

      <AppHeader
        activeView={activeView}
        destinationId={destinationId}
        handleDestinationChange={handleDestinationChange}
        places={places}
        setActiveView={setActiveView}
        startId={startId}
      />

      <section
        className="map-stage"
        aria-labelledby="route-title"
        hidden={activeView !== 'map'}
      >
        <CampusMap
          ref={mapRef}
          selectedBuilding={selectedBuilding}
          startLocation={startLocation}
        />

        <ReportForm
          cancelReport={cancelReport}
          pendingNote={pendingNote}
          pendingPin={pendingPin}
          pendingType={pendingType}
          setPendingNote={setPendingNote}
          setPendingType={setPendingType}
          submitReport={submitReport}
        />

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

      {activeView === 'mvp' && (
        <MvpHub
          approveReport={approveReport}
          dismissReport={dismissReport}
          reports={reports}
        />
      )}
    </main>
  )
}

export default App
