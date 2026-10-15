import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Crosshair,
  Layers,
  Search,
  RotateCcw,
  AlertTriangle,
  Compass,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  Car
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
  sector: string;
  coords: { lat: number; lng: number };
  zoom: number;
  highlight: string;
}

export const MEDELLIN_SURROUNDING_AREAS: ZoneItem[] = [
  {
    id: 'centro',
    name: 'Centro / Av. Oriental',
    sector: 'La Candelaria',
    coords: { lat: 6.2486, lng: -75.5689 },
    zoom: 16,
    highlight: 'Eje comercial y administrativo de Medellín'
  },
  {
    id: 'el-poblado',
    name: 'El Poblado',
    sector: 'Suroriente',
    coords: { lat: 6.2085, lng: -75.5678 },
    zoom: 15,
    highlight: 'Milla de Oro, Calle 10 y Parque Lleras'
  },
  {
    id: 'laureles',
    name: 'Laureles / Estadio',
    sector: 'Occidente',
    coords: { lat: 6.25184, lng: -75.5898 },
    zoom: 16,
    highlight: 'Corredor Carrera 70 y Calle San Juan'
  },
  {
    id: 'belen',
    name: 'Belén / Av. 80',
    sector: 'Suroccidente',
    coords: { lat: 6.2312, lng: -75.6015 },
    zoom: 15,
    highlight: 'Corredor vial Av. 80 y Parque de Belén'
  },
  {
    id: 'av-regional',
    name: 'Av. Regional (Río Medellín)',
    sector: 'Corredor Norte-Sur',
    coords: { lat: 6.2401, lng: -75.5762 },
    zoom: 15,
    highlight: 'Eje estructurante multimodal del Valle de Aburrá'
  },
  {
    id: 'autopista-sur',
    name: 'Autopista Sur',
    sector: 'Guayabal - Sur',
    coords: { lat: 6.2285, lng: -75.5795 },
    zoom: 15,
    highlight: 'Conexión con Itagüí, La Estrella y Envigado'
  },
  {
    id: 'envigado',
    name: 'Envigado',
    sector: 'Sur Metropolitano',
    coords: { lat: 6.1685, lng: -75.5842 },
    zoom: 15,
    highlight: 'Área Metropolitana del Valle de Aburrá'
  },
  {
    id: 'bello',
    name: 'Bello',
    sector: 'Norte Metropolitano',
    coords: { lat: 6.3355, lng: -75.5583 },
    zoom: 15,
    highlight: 'Acceso norte Valle de Aburrá'
  },
  {
    id: 'itagui',
    name: 'Itagüí',
    sector: 'Suroeste Metropolitano',
    coords: { lat: 6.1725, lng: -75.6111 },
    zoom: 15,
    highlight: 'Centro industrial y comercial del sur'
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

// Inner Controller component that has access to `useMap()`
const GoogleMapsController: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  targetCoords: { lat: number; lng: number };
  targetZoom: number;
  trafficEnabled: boolean;
  mapTypeId: string;
  customMarkers: MapMarkerPoint[];
  selectedZoneId: string | null;
  onSelectMarker?: (marker: MapMarkerPoint) => void;
  activeMarkerInfo: MapMarkerPoint | null;
  setActiveMarkerInfo: (marker: MapMarkerPoint | null) => void;
}> = ({
  userLocation,
  targetCoords,
  targetZoom,
  trafficEnabled,
  mapTypeId,
  customMarkers,
  selectedZoneId,
  onSelectMarker,
  activeMarkerInfo,
  setActiveMarkerInfo
}) => {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  // Sync center and zoom
  useEffect(() => {
    if (!map) return;
    map.panTo(targetCoords);
    map.setZoom(targetZoom);
  }, [map, targetCoords, targetZoom]);

  // Sync Map Type (roadmap, satellite, hybrid, terrain)
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(mapTypeId);
  }, [map, mapTypeId]);

  // Toggle Traffic Layer
  useEffect(() => {
    if (!map) return;
    if (trafficEnabled) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(map);
    } else {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    }
    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, trafficEnabled]);

  return (
    <>
      {/* 1. Live User Location Marker (Pulse GPS circle) */}
      {userLocation && (
        <AdvancedMarker
          position={userLocation}
          title="Tu ubicación actual en vivo"
          onClick={() => {
            setActiveMarkerInfo({
              id: 'user-live-loc',
              title: 'Tu ubicación actual',
              description: 'Detectada vía Google Maps Geolocation en Medellín / Antioquia',
              coords: userLocation,
              category: 'user'
            });
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer pulsating radar ring */}
            <span className="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
            <span className="absolute w-7 h-7 rounded-full bg-blue-500/50 animate-pulse pointer-events-none" />
            {/* Inner core badge */}
            <div className="w-6 h-6 rounded-full bg-[#0052cc] border-2 border-white shadow-xl flex items-center justify-center text-white">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            </div>
          </div>
        </AdvancedMarker>
      )}

      {/* 2. Surrounding Zones Markers in Medellín */}
      {MEDELLIN_SURROUNDING_AREAS.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        return (
          <AdvancedMarker
            key={zone.id}
            position={zone.coords}
            title={`${zone.name} (${zone.sector})`}
            onClick={() => {
              const markerItem: MapMarkerPoint = {
                id: zone.id,
                title: zone.name,
                description: `${zone.sector} • ${zone.highlight}`,
                coords: zone.coords,
                category: 'corridor'
              };
              setActiveMarkerInfo(markerItem);
              onSelectMarker?.(markerItem);
            }}
          >
            <Pin
              background={isSelected ? '#0052cc' : '#0284c7'}
              borderColor="#ffffff"
              glyphColor="#ffffff"
              scale={isSelected ? 1.25 : 0.9}
            />
          </AdvancedMarker>
        );
      })}

      {/* 3. Custom / Incident Markers */}
      {customMarkers.map((marker) => {
        const isIncident = marker.category === 'incident';
        const bg =
          marker.severity === 'alta'
            ? '#e11d48'
            : marker.severity === 'media'
            ? '#f59e0b'
            : isIncident
            ? '#ef4444'
            : '#10b981';

        return (
          <AdvancedMarker
            key={marker.id}
            position={marker.coords}
            title={marker.title}
            onClick={() => {
              setActiveMarkerInfo(marker);
              onSelectMarker?.(marker);
            }}
          >
            <Pin background={bg} borderColor="#ffffff" glyphColor="#ffffff" scale={1.0} />
          </AdvancedMarker>
        );
      })}

      {/* InfoWindow for Active Selection */}
      {activeMarkerInfo && (
        <InfoWindow
          position={activeMarkerInfo.coords}
          onCloseClick={() => setActiveMarkerInfo(null)}
        >
          <div className="p-1 max-w-[240px] text-slate-900 font-sans">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
              <p className="font-bold text-xs text-[#0f172a] truncate">
                {activeMarkerInfo.title}
              </p>
            </div>
            {activeMarkerInfo.description && (
              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                {activeMarkerInfo.description}
              </p>
            )}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Medellín, Antioquia</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarkerInfo.coords.lat},${activeMarkerInfo.coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0052cc] font-bold hover:underline flex items-center gap-0.5"
              >
                <span>Ruta</span>
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const GoogleMapsLive: React.FC<GoogleMapsLiveProps> = ({
  initialCenter = MEDELLIN_CENTER,
  initialZoom = 14,
  heightClass = 'h-[520px] sm:h-[600px]',
  customMarkers = [],
  onMarkerClick,
  showSurroundingSelector = true,
  showSearchBar = true
}) => {
  const { language } = useThemeLanguage();
  // Live Camera state
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(initialCenter);
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);

  // Live GPS user location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Medellín, Antioquia (Centrado)');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Map Layer / Controls
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap'); // roadmap, satellite, hybrid, terrain
  const [activeMarkerInfo, setActiveMarkerInfo] = useState<MapMarkerPoint | null>(null);

  // Search input state
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Automatic GPS Geolocation on mount (Tal cual como funciona Google Maps al abrirse)
  const detectUserLocation = useCallback((forceCenter: boolean = true) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocalización no disponible en este navegador. Vista: Medellín, Antioquia.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Localizando tu posición en tiempo real...');

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
          setLocationStatus('Ubicación actual detectada en vivo • Zonas aledañas de Medellín');
          setSearchFeedback('Ubicado en tu posición actual (Google Maps GPS)');
          setTimeout(() => setSearchFeedback(null), 4000);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation notice:', err.message);
        // Fallback gracefully to Medellín Centro
        setCurrentCoords(MEDELLIN_CENTER);
        setCurrentZoom(14);
        setLocationStatus('Medellín, Antioquia (Valle de Aburrá) • Cobertura en vivo');
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000
      }
    );
  }, []);

  useEffect(() => {
    detectUserLocation(true);
  }, [detectUserLocation]);

  // Handle Zone Selection
  const handleSelectZone = (zone: ZoneItem) => {
    setSelectedZoneId(zone.id);
    setCurrentCoords(zone.coords);
    setCurrentZoom(zone.zoom);
    setLocationStatus(`${zone.name} (${zone.sector}) • Medellín, Antioquia`);
    setSearchFeedback(`Centrado en ${zone.name}`);
    setTimeout(() => setSearchFeedback(null), 3000);
  };

  // Reset to full Medellín view
  const handleResetToMedellin = () => {
    setSelectedZoneId(null);
    setCurrentCoords(MEDELLIN_CENTER);
    setCurrentZoom(13);
    setLocationStatus('Medellín, Antioquia • Vista Metropolitana');
    setSearchFeedback('Vista general de Medellín');
    setTimeout(() => setSearchFeedback(null), 3000);
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
        z.sector.toLowerCase().includes(query) ||
        z.id.includes(query)
    );

    if (matchedZone) {
      handleSelectZone(matchedZone);
      return;
    }

    // Keyword matching for popular Medellín landmarks
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
      // General Medellín search
      setCurrentCoords(MEDELLIN_CENTER);
      setCurrentZoom(14);
      setLocationStatus(`Búsqueda: «${searchInput}» • Medellín, Antioquia`);
      setSearchFeedback(`Buscando «${searchInput}» en Medellín`);
      setTimeout(() => setSearchFeedback(null), 3000);
    }
  };

  return (
    <div className="w-full space-y-3 font-sans">
      {/* Surrounding Areas Selector Chips (Zonas Aledañas de Medellín) */}
      {showSurroundingSelector && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-[#0052cc] dark:text-sky-400" />
            Zonas de Medellín:
          </span>

          {MEDELLIN_SURROUNDING_AREAS.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
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
                title={`${zone.name} (${zone.sector})`}
              >
                <MapPin size={12} className={isSelected ? 'text-amber-300' : 'text-slate-400'} />
                <span>{zone.name}</span>
                {isSelected && <CheckCircle2 size={12} className="text-emerald-300 ml-0.5" />}
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleResetToMedellin}
            className="px-2.5 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
            title="Ver todo Medellín"
          >
            <RotateCcw size={12} />
            <span>Todo Medellín</span>
          </button>
        </div>
      )}

      {/* Google Maps Container */}
      <div
        id="google-maps-canvas-box"
        className={`relative w-full ${heightClass} rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-md transition-all`}
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
                placeholder="Buscar calle o zona en Medellín (ej. El Poblado, Laureles, Av. 80)..."
                className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Ubicar
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
              onClick={() => setTrafficEnabled(!trafficEnabled)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                trafficEnabled
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Capa de tráfico en tiempo real de Google Maps"
            >
              <Car size={13} />
              <span>Tráfico</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={() => setMapTypeId('roadmap')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'roadmap'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Vista de mapa estándar"
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId('satellite')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'satellite'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Vista satelital fotográfica"
            >
              Satélite
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId('terrain')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapTypeId === 'terrain'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Vista de relieve topográfico"
            >
              Relieve
            </button>
          </div>

          {/* Quick GPS Geolocation Button (Locate Me) */}
          <button
            type="button"
            onClick={() => detectUserLocation(true)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/90 dark:border-slate-700/80 text-[#0052cc] dark:text-sky-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            title="Centrar en mi ubicación actual GPS"
          >
            <Crosshair size={16} className={isLocating ? 'animate-spin text-amber-500' : ''} />
            <span className="hidden sm:inline">Mi Ubicación</span>
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
              Tráfico en vivo
            </span>
          )}
        </div>

        {/* ============= The Official Google Maps Provider & Component ============= */}
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language={language} region="CO">
          <Map
            defaultCenter={initialCenter}
            defaultZoom={initialZoom}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={true}
            mapTypeControl={false}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <GoogleMapsController
              userLocation={userLocation}
              targetCoords={currentCoords}
              targetZoom={currentZoom}
              trafficEnabled={trafficEnabled}
              mapTypeId={mapTypeId}
              customMarkers={customMarkers}
              selectedZoneId={selectedZoneId}
              onSelectMarker={onMarkerClick}
              activeMarkerInfo={activeMarkerInfo}
              setActiveMarkerInfo={setActiveMarkerInfo}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
