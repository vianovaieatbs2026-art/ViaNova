import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Car,
  Layers,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

// Google Maps Platform API Key (provided by user & env)
const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAadWNX0HMHQXtXlvegmSOU_VXGRl6PCSE';

// Medellín, Antioquia Coordinates & Surrounding Zones
export const MEDELLIN_CENTER = { lat: 6.2476, lng: -75.5658 };

export interface ZoneItem {
  id: string;
  name: string;
  nameEn?: string;
  sector: string;
  sectorEn?: string;
  coords: { lat: number; lng: number };
  zoom: number;
  highlight: string;
  highlightEn?: string;
}

export const MEDELLIN_SURROUNDING_AREAS: ZoneItem[] = [
  {
    id: 'centro',
    name: 'Centro / Av. Oriental',
    nameEn: 'Downtown / Av. Oriental',
    sector: 'La Candelaria',
    sectorEn: 'La Candelaria',
    coords: { lat: 6.2486, lng: -75.5689 },
    zoom: 16,
    highlight: 'Eje comercial y administrativo de Medellín',
    highlightEn: 'Commercial & administrative hub of Medellín'
  },
  {
    id: 'el-poblado',
    name: 'El Poblado',
    nameEn: 'El Poblado',
    sector: 'Suroriente',
    sectorEn: 'Southeast',
    coords: { lat: 6.2085, lng: -75.5678 },
    zoom: 15,
    highlight: 'Milla de Oro, Calle 10 y Parque Lleras',
    highlightEn: 'Golden Mile, 10th St & Lleras Park'
  },
  {
    id: 'laureles',
    name: 'Laureles / Estadio',
    nameEn: 'Laureles / Stadium',
    sector: 'Occidente',
    sectorEn: 'West',
    coords: { lat: 6.25184, lng: -75.5898 },
    zoom: 16,
    highlight: 'Corredor Carrera 70 y Calle San Juan',
    highlightEn: 'Carrera 70 & San Juan Corridor'
  },
  {
    id: 'belen',
    name: 'Belén / Av. 80',
    nameEn: 'Belén / 80th Ave',
    sector: 'Suroccidente',
    sectorEn: 'Southwest',
    coords: { lat: 6.2312, lng: -75.6015 },
    zoom: 15,
    highlight: 'Corredor vial Av. 80 y Parque de Belén',
    highlightEn: 'Av. 80 road corridor & Belén Park'
  },
  {
    id: 'av-regional',
    name: 'Av. Regional (Río Medellín)',
    nameEn: 'Av. Regional (Medellín River)',
    sector: 'Corredor Norte-Sur',
    sectorEn: 'North-South Corridor',
    coords: { lat: 6.2401, lng: -75.5762 },
    zoom: 15,
    highlight: 'Eje estructurante multimodal del Valle de Aburrá',
    highlightEn: 'Multimodal corridor of Aburrá Valley'
  },
  {
    id: 'autopista-sur',
    name: 'Autopista Sur',
    nameEn: 'Autopista Sur (South Highway)',
    sector: 'Guayabal - Sur',
    sectorEn: 'Guayabal - South',
    coords: { lat: 6.2285, lng: -75.5795 },
    zoom: 15,
    highlight: 'Conexión con Itagüí, La Estrella y Envigado',
    highlightEn: 'Connection with Itagüí, La Estrella & Envigado'
  },
  {
    id: 'envigado',
    name: 'Envigado',
    nameEn: 'Envigado',
    sector: 'Sur Metropolitano',
    sectorEn: 'Southern Metro Area',
    coords: { lat: 6.1685, lng: -75.5842 },
    zoom: 15,
    highlight: 'Área Metropolitana del Valle de Aburrá',
    highlightEn: 'Aburrá Valley Metropolitan Area'
  },
  {
    id: 'bello',
    name: 'Bello',
    nameEn: 'Bello',
    sector: 'Norte Metropolitano',
    sectorEn: 'Northern Metro Area',
    coords: { lat: 6.3355, lng: -75.5583 },
    zoom: 15,
    highlight: 'Acceso norte Valle de Aburrá',
    highlightEn: 'Northern access to Aburrá Valley'
  },
  {
    id: 'itagui',
    name: 'Itagüí',
    nameEn: 'Itagüí',
    sector: 'Suroeste Metropolitano',
    sectorEn: 'Southwestern Metro Area',
    coords: { lat: 6.1725, lng: -75.6111 },
    zoom: 15,
    highlight: 'Centro industrial y comercial del sur',
    highlightEn: 'Southern industrial & commercial hub'
  }
];

export interface MapMarkerPoint {
  id: string;
  title: string;
  description?: string;
  coords: { lat: number; lng: number };
  category?: 'incident' | 'traffic' | 'corridor' | 'user';
  severity?: 'alta' | 'media' | 'baja';
}

interface GoogleMapsLiveProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  heightClass?: string;
  customMarkers?: MapMarkerPoint[];
  onMarkerClick?: (marker: MapMarkerPoint) => void;
  showSurroundingSelector?: boolean;
  showSearchBar?: boolean;
}

export const GoogleMapsLive: React.FC<GoogleMapsLiveProps> = ({
  initialCenter = MEDELLIN_CENTER,
  initialZoom = 14,
  heightClass = 'h-[520px] sm:h-[600px]',
  customMarkers = [],
  onMarkerClick,
  showSurroundingSelector = true,
  showSearchBar = true
}) => {
  const { language, t, themeMode } = useThemeLanguage();
  const isEn = language === 'en';

  // Live Camera state
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(initialCenter);
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);

  // Live GPS user location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>(
    isEn ? 'Medellín, Antioquia (Centered)' : 'Medellín, Antioquia (Centrado)'
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Map Layer / Controls
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap'); // roadmap, satellite, terrain

  // Search input state
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  // Reset loading state and ensure fallback timeout when language/theme changes
  useEffect(() => {
    setIframeLoaded(false);
    const safetyTimer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2500);
    return () => clearTimeout(safetyTimer);
  }, [language, themeMode]);

  // Update status message when language changes
  useEffect(() => {
    if (!selectedZoneId) {
      setLocationStatus(
        isEn ? 'Medellín, Antioquia (Centered)' : 'Medellín, Antioquia (Centrado)'
      );
    } else {
      const zone = MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === selectedZoneId);
      if (zone) {
        const zoneName = isEn && zone.nameEn ? zone.nameEn : zone.name;
        const zoneSector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;
        setLocationStatus(`${zoneName} (${zoneSector}) • Medellín, Antioquia`);
      }
    }
  }, [language, isEn, selectedZoneId]);

  // Automatic GPS Geolocation on mount
  const detectUserLocation = useCallback((forceCenter: boolean = true) => {
    if (!navigator.geolocation) {
      setLocationStatus(
        isEn
          ? 'Geolocation not available in this browser. View: Medellín, Antioquia.'
          : 'Geolocalización no disponible en este navegador. Vista: Medellín, Antioquia.'
      );
      return;
    }

    setIsLocating(true);
    setLocationStatus(
      isEn ? 'Locating your position in real time...' : 'Localizando tu posición en tiempo real...'
    );

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setIsLocating(false);

        if (forceCenter) {
          setCurrentCoords(coords);
          setCurrentZoom(16);
          setLocationStatus(
            isEn
              ? 'Live location detected • Medellín surrounding areas'
              : 'Ubicación actual detectada en vivo • Zonas aledañas de Medellín'
          );
          setSearchFeedback(
            isEn
              ? 'Located at your current position (Google Maps GPS)'
              : 'Ubicado en tu posición actual (Google Maps GPS)'
          );
          setTimeout(() => setSearchFeedback(null), 4000);

          // Tell map iframe to update
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: 'SET_CENTER',
              coords,
              zoom: 16,
              userLocation: coords
            },
            '*'
          );
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation notice:', err.message);
        setCurrentCoords(MEDELLIN_CENTER);
        setCurrentZoom(14);
        setLocationStatus(
          isEn
            ? 'Medellín, Antioquia (Aburrá Valley) • Live coverage'
            : 'Medellín, Antioquia (Valle de Aburrá) • Cobertura en vivo'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000
      }
    );
  }, [isEn]);

  useEffect(() => {
    detectUserLocation(true);
  }, [detectUserLocation]);

  // Handle Zone Selection
  const handleSelectZone = (zone: ZoneItem) => {
    setSelectedZoneId(zone.id);
    setCurrentCoords(zone.coords);
    setCurrentZoom(zone.zoom);
    const zName = isEn && zone.nameEn ? zone.nameEn : zone.name;
    const zSector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;
    setLocationStatus(`${zName} (${zSector}) • Medellín, Antioquia`);
    setSearchFeedback(isEn ? `Centered on ${zName}` : `Centrado en ${zName}`);
    setTimeout(() => setSearchFeedback(null), 3000);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_CENTER',
        coords: zone.coords,
        zoom: zone.zoom,
        highlightZoneId: zone.id
      },
      '*'
    );
  };

  // Reset to full Medellín view
  const handleResetToMedellin = () => {
    setSelectedZoneId(null);
    setCurrentCoords(MEDELLIN_CENTER);
    setCurrentZoom(13);
    setLocationStatus(
      isEn ? 'Medellín, Antioquia • Metropolitan View' : 'Medellín, Antioquia • Vista Metropolitana'
    );
    setSearchFeedback(isEn ? 'Overview of Medellín' : 'Vista general de Medellín');
    setTimeout(() => setSearchFeedback(null), 3000);

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_CENTER',
        coords: MEDELLIN_CENTER,
        zoom: 13,
        highlightZoneId: null
      },
      '*'
    );
  };

  // Toggle Traffic Layer
  const handleToggleTraffic = () => {
    const nextVal = !trafficEnabled;
    setTrafficEnabled(nextVal);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_TRAFFIC',
        enabled: nextVal
      },
      '*'
    );
  };

  // Change Map Type
  const handleSelectMapType = (type: string) => {
    setMapTypeId(type);
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'SET_MAP_TYPE',
        mapTypeId: type
      },
      '*'
    );
  };

  // Handle Search Input in Medellín
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    // Check in surrounding zones first
    const matchedZone = MEDELLIN_SURROUNDING_AREAS.find(
      (z) =>
        z.name.toLowerCase().includes(query) ||
        (z.nameEn && z.nameEn.toLowerCase().includes(query)) ||
        z.sector.toLowerCase().includes(query) ||
        (z.sectorEn && z.sectorEn.toLowerCase().includes(query)) ||
        z.id.includes(query)
    );

    if (matchedZone) {
      handleSelectZone(matchedZone);
      return;
    }

    if (query.includes('poblado') || query.includes('lleras') || query.includes('milla')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'el-poblado')!);
    } else if (query.includes('laureles') || query.includes('estadio') || query.includes('70')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'laureles')!);
    } else if (query.includes('centro') || query.includes('oriental') || query.includes('botero') || query.includes('berrio')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'centro')!);
    } else if (query.includes('belen') || query.includes('80') || query.includes('america')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'belen')!);
    } else if (query.includes('regional') || query.includes('rio')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'av-regional')!);
    } else if (query.includes('autopista') || query.includes('guayabal')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'autopista-sur')!);
    } else if (query.includes('envigado')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'envigado')!);
    } else if (query.includes('bello')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'bello')!);
    } else if (query.includes('itagui')) {
      handleSelectZone(MEDELLIN_SURROUNDING_AREAS.find((z) => z.id === 'itagui')!);
    } else {
      setCurrentCoords(MEDELLIN_CENTER);
      setCurrentZoom(14);
      setLocationStatus(
        isEn
          ? `Search: «${searchInput}» • Medellín, Antioquia`
          : `Búsqueda: «${searchInput}» • Medellín, Antioquia`
      );
      setSearchFeedback(
        isEn ? `Searching «${searchInput}» in Medellín` : `Buscando «${searchInput}» en Medellín`
      );
      setTimeout(() => setSearchFeedback(null), 3000);

      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_CENTER',
          coords: MEDELLIN_CENTER,
          zoom: 14
        },
        '*'
      );
    }
  };

  // Listen to messages from the map iframe
  useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'MAP_READY') {
        setIframeLoaded(true);
      } else if (event.data.type === 'MARKER_CLICK') {
        const marker = event.data.marker;
        if (onMarkerClick && marker) {
          onMarkerClick(marker);
        }
      }
    };

    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [onMarkerClick]);

  // Construct isolated HTML payload for the Google Map iframe
  // This guarantees that Google Maps JavaScript API loads natively with language=en or language=es
  const iframeSrcDoc = useMemo(() => {
    const isDark = themeMode === 'dark';
    const lang = language === 'en' ? 'en' : 'es';

    const serializedZones = JSON.stringify(
      MEDELLIN_SURROUNDING_AREAS.map((z) => ({
        id: z.id,
        title: isEn && z.nameEn ? z.nameEn : z.name,
        sector: isEn && z.sectorEn ? z.sectorEn : z.sector,
        highlight: isEn && z.highlightEn ? z.highlightEn : z.highlight,
        coords: z.coords,
        zoom: z.zoom
      }))
    );

    const serializedCustomMarkers = JSON.stringify(customMarkers);

    const routeText = isEn ? 'Directions' : 'Ruta';
    const userLocTitle = isEn ? 'Your current location' : 'Tu ubicación actual';
    const userLocDesc = isEn
      ? 'Detected via Google Maps Geolocation in Medellín / Antioquia'
      : 'Detectada vía Google Maps Geolocation en Medellín / Antioquia';

    // Google Maps Dark Mode Style
    const darkMapStyle = isDark
      ? `[
          { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] },
          { "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
          { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#38bdf8" }] },
          { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#0284c7" }] },
          { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }
        ]`
      : '[]';

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Maps Live</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map-canvas {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: ${isDark ? '#0f172a' : '#f8fafc'};
    }
    .custom-pulse-marker {
      position: relative;
      width: 22px;
      height: 22px;
    }
    .pulse-ring {
      position: absolute;
      top: -9px;
      left: -9px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 82, 204, 0.45);
      animation: gmapPulse 1.8s infinite ease-out;
      pointer-events: none;
    }
    .pulse-core {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0052cc;
      border: 2.5px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #fbbf24;
    }
    @keyframes gmapPulse {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .gm-style .gm-style-iw-c {
      border-radius: 16px !important;
      padding: 12px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2) !important;
    }
    .info-box {
      font-size: 12px;
      color: #0f172a;
      max-width: 240px;
    }
    .info-title {
      font-weight: 800;
      font-size: 13px;
      margin-bottom: 4px;
      color: #0052cc;
    }
    .info-desc {
      font-size: 11px;
      color: #475569;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .info-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 700;
      color: #0052cc;
      text-decoration: none;
      font-size: 11px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      width: 100%;
    }
    .info-btn:hover {
      text-decoration: underline;
    }
  </style>
  <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&language=${lang}&region=CO"></script>
</head>
<body>
  <div id="map-canvas"></div>
  <script>
    var map;
    var trafficLayer;
    var markers = [];
    var userMarker = null;
    var infoWindow = null;
    var initialCoords = { lat: ${currentCoords.lat}, lng: ${currentCoords.lng} };
    var initialZoom = ${currentZoom};
    var zones = ${serializedZones};
    var customMarkersData = ${serializedCustomMarkers};
    var isTrafficOn = ${trafficEnabled};
    var currentMapTypeId = '${mapTypeId}';

    function initMap() {
      try {
        var mapOptions = {
          center: initialCoords,
          zoom: initialZoom,
          mapTypeId: currentMapTypeId,
          styles: ${darkMapStyle},
          gestureHandling: 'greedy',
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          scaleControl: true
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        infoWindow = new google.maps.InfoWindow();

        // Traffic Layer
        trafficLayer = new google.maps.TrafficLayer();
        if (isTrafficOn) {
          trafficLayer.setMap(map);
        }

        // Add Zone Markers
        zones.forEach(function(zone) {
          var marker = new google.maps.Marker({
            position: zone.coords,
            map: map,
            title: zone.title + ' (' + zone.sector + ')',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#0052cc',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          marker.addListener('click', function() {
            var content = '<div class="info-box">' +
              '<div class="info-title">' + zone.title + '</div>' +
              '<div class="info-desc">' + zone.sector + ' • ' + zone.highlight + '</div>' +
              '<a class="info-btn" href="https://www.google.com/maps/dir/?api=1&destination=' + zone.coords.lat + ',' + zone.coords.lng + '&hl=${lang}" target="_blank" rel="noopener">' +
              '<span>' + '${routeText}' + '</span> &rarr;</a>' +
              '</div>';

            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            window.parent.postMessage({
              type: 'MARKER_CLICK',
              marker: {
                id: zone.id,
                title: zone.title,
                description: zone.sector + ' • ' + zone.highlight,
                coords: zone.coords,
                category: 'corridor'
              }
            }, '*');
          });

          markers.push(marker);
        });

        // Add Custom Incident Markers
        customMarkersData.forEach(function(cm) {
          var color = cm.severity === 'alta' ? '#e11d48' : cm.severity === 'media' ? '#f59e0b' : '#10b981';
          var marker = new google.maps.Marker({
            position: cm.coords,
            map: map,
            title: cm.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          marker.addListener('click', function() {
            var content = '<div class="info-box">' +
              '<div class="info-title" style="color: ' + color + ';">' + cm.title + '</div>' +
              (cm.description ? '<div class="info-desc">' + cm.description + '</div>' : '') +
              '<a class="info-btn" href="https://www.google.com/maps/dir/?api=1&destination=' + cm.coords.lat + ',' + cm.coords.lng + '&hl=${lang}" target="_blank" rel="noopener">' +
              '<span>' + '${routeText}' + '</span> &rarr;</a>' +
              '</div>';

            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            window.parent.postMessage({
              type: 'MARKER_CLICK',
              marker: cm
            }, '*');
          });

          markers.push(marker);
        });

        // Notify parent that map is ready
        window.parent.postMessage({ type: 'MAP_READY' }, '*');
      } catch (err) {
        console.error('Map init error:', err);
      }
    }

    // Handle messages from parent window
    window.addEventListener('message', function(event) {
      if (!event.data || !map) return;
      var data = event.data;

      if (data.type === 'SET_CENTER') {
        if (data.coords) {
          map.panTo(data.coords);
        }
        if (data.zoom) {
          map.setZoom(data.zoom);
        }
        if (data.userLocation) {
          updateUserLocationMarker(data.userLocation);
        }
      } else if (data.type === 'SET_MAP_TYPE') {
        map.setMapTypeId(data.mapTypeId);
      } else if (data.type === 'SET_TRAFFIC') {
        if (data.enabled) {
          if (!trafficLayer) trafficLayer = new google.maps.TrafficLayer();
          trafficLayer.setMap(map);
        } else {
          if (trafficLayer) trafficLayer.setMap(null);
        }
      }
    });

    function updateUserLocationMarker(coords) {
      if (!userMarker) {
        userMarker = new google.maps.Marker({
          position: coords,
          map: map,
          title: '${userLocTitle}',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#2563eb',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        });

        userMarker.addListener('click', function() {
          var content = '<div class="info-box">' +
            '<div class="info-title">${userLocTitle}</div>' +
            '<div class="info-desc">${userLocDesc}</div>' +
            '</div>';
          infoWindow.setContent(content);
          infoWindow.open(map, userMarker);
        });
      } else {
        userMarker.setPosition(coords);
      }
    }

    // Start map once script loads with polling fallback
    function tryInitMap(attempts) {
      if (map) return;
      if (window.google && window.google.maps) {
        initMap();
      } else if (attempts < 25) {
        setTimeout(function() { tryInitMap(attempts + 1); }, 120);
      } else {
        window.parent.postMessage({ type: 'MAP_READY' }, '*');
      }
    }

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.addEventListener('load', function() { tryInitMap(0); });
      tryInitMap(0);
    }
  </script>
</body>
</html>`;
  }, [
    language,
    themeMode,
    isEn,
    currentCoords.lat,
    currentCoords.lng,
    currentZoom,
    trafficEnabled,
    mapTypeId,
    customMarkers
  ]);

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Surrounding Areas Selector Chips (Zonas Aledañas de Medellín) */}
      {showSurroundingSelector && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-[#0052cc] dark:text-sky-400" />
            {t('map_zones_label', 'Zonas de Medellín:')}
          </span>

          {MEDELLIN_SURROUNDING_AREAS.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const displayName = isEn && zone.nameEn ? zone.nameEn : zone.name;
            const displaySector = isEn && zone.sectorEn ? zone.sectorEn : zone.sector;

            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectZone(zone)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0052cc] text-white font-bold shadow-md ring-2 ring-blue-400/40 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`${displayName} (${displaySector})`}
              >
                <MapPin size={12} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                <span>{displayName}</span>
                {isSelected && <CheckCircle2 size={12} className="text-emerald-300 ml-0.5" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleResetToMedellin}
            className="px-2.5 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            title={t('map_all_medellin', 'Todo Medellín')}
          >
            <RotateCcw size={12} />
            <span>{t('map_all_medellin', 'Todo Medellín')}</span>
          </button>
        </div>
      )}

      {/* Google Maps Container */}
      <div
        id="google-maps-canvas-box"
        className={`relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md transition-all`}
      >
        {/* Floating Top Left Search Bar */}
        {showSearchBar && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-[calc(100%-24px)] sm:w-[420px] max-w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/80 p-1.5 flex items-center gap-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0052cc] dark:text-sky-400 shrink-0">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t(
                  'map_search_placeholder',
                  'Buscar calle o zona en Medellín (ej. El Poblado, Laureles, Av. 80)...'
                )}
                className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {t('map_search_btn', 'Ubicar')}
              </button>
            </form>

            {/* Notification Badge */}
            {searchFeedback && (
              <div className="mt-2 bg-[#0052cc] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-blue-400/50 flex items-center gap-2 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>{searchFeedback}</span>
              </div>
            )}
          </div>
        )}

        {/* Floating Top Right Controls (Traffic Toggle + Map Types + GPS) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-2">
          {/* Layer and Traffic Buttons */}
          <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200/90 dark:border-slate-700/80">
            <button
              type="button"
              onClick={handleToggleTraffic}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                trafficEnabled
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={
                isEn
                  ? 'Google Maps real-time traffic layer'
                  : 'Capa de tráfico en tiempo real de Google Maps'
              }
            >
              <Car size={13} />
              <span>{t('map_traffic_btn', 'Tráfico')}</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={() => handleSelectMapType('roadmap')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'roadmap'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Standard map view' : 'Vista de mapa estándar'}
            >
              {t('map_type_roadmap', 'Mapa')}
            </button>
            <button
              type="button"
              onClick={() => handleSelectMapType('satellite')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'satellite'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Satellite photographic view' : 'Vista satelital fotográfica'}
            >
              {t('map_type_satellite', 'Satélite')}
            </button>
            <button
              type="button"
              onClick={() => handleSelectMapType('terrain')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'terrain'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isEn ? 'Topographic terrain view' : 'Vista de relieve topográfico'}
            >
              {t('map_type_terrain', 'Relieve')}
            </button>
          </div>

          {/* Quick GPS Geolocation Button (Locate Me) */}
          <button
            type="button"
            onClick={() => detectUserLocation(true)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-700/80 text-[#0052cc] dark:text-sky-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            title={t('map_my_location_title', 'Centrar en mi ubicación actual GPS')}
          >
            <Crosshair size={16} className={isLocating ? 'animate-spin text-amber-500' : ''} />
            <span className="hidden sm:inline">{t('map_my_location', 'Mi Ubicación')}</span>
          </button>
        </div>

        {/* Floating Bottom Left Status Pill */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2 px-3 shadow-lg border border-slate-200/90 dark:border-slate-700/80 flex items-center gap-2 max-w-[calc(100%-24px)] text-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
            {locationStatus}
          </span>
          {trafficEnabled && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md hidden sm:inline shrink-0">
              {t('map_traffic_live', 'Tráfico en vivo')}
            </span>
          )}
        </div>

        {/* Loading Indicator before iframe executes */}
        {!iframeLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xs transition-opacity">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc] animate-ping" />
              <span>{t('map_loading', 'Cargando Google Maps en vivo...')}</span>
            </div>
          </div>
        )}

        {/* ============= Isolated Google Maps Iframe with Native Dynamic Language Reload ============= */}
        <iframe
          key={`gmap-frame-${language}-${themeMode}`}
          ref={iframeRef}
          srcDoc={iframeSrcDoc}
          title="Google Maps Medellín Live"
          className="w-full h-full border-0 block bg-slate-100 dark:bg-slate-900"
          loading="lazy"
          allow="geolocation"
        />
      </div>
    </div>
  );
};
