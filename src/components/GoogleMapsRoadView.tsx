import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Layers, 
  Search, 
  AlertTriangle, 
  Plus, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink,
  Car,
  Clock,
  ThumbsUp,
  X,
  Compass
} from 'lucide-react';
import { RoadIncident } from '../types';
import { soundEngine } from '../utils/soundEffects';

// Default coordinates for Medellín, Antioquia (Parque Berrío / Centro de Medellín)
export const MEDELLIN_COORDS = { lat: 6.2476, lng: -75.5658 };

export interface SectorItem {
  id: string;
  name: string;
  zone: string;
  coords: { lat: number; lng: number };
  zoom: number;
}

export const MEDELLIN_SECTORS: SectorItem[] = [
  { id: 'med-centro', name: 'Centro / La Candelaria', zone: 'Medellín', coords: { lat: 6.2476, lng: -75.5658 }, zoom: 15 },
  { id: 'med-poblado', name: 'El Poblado / Las Vegas', zone: 'Medellín Sur', coords: { lat: 6.2089, lng: -75.5684 }, zoom: 15 },
  { id: 'med-laureles', name: 'Laureles - Estadio', zone: 'Medellín Occidente', coords: { lat: 6.2443, lng: -75.5925 }, zoom: 15 },
  { id: 'med-sur', name: 'Autopista Sur / Guayabal', zone: 'Medellín Sur', coords: { lat: 6.2285, lng: -75.5802 }, zoom: 15 },
  { id: 'med-belen', name: 'Belén / Cra 76', zone: 'Medellín Suroccidente', coords: { lat: 6.2312, lng: -75.5985 }, zoom: 15 },
  { id: 'med-envigado', name: 'Envigado / Viva Envigado', zone: 'Área Metropolitana', coords: { lat: 6.1698, lng: -75.5874 }, zoom: 14 },
  { id: 'med-bello', name: 'Bello / Niquía', zone: 'Área Metropolitana', coords: { lat: 6.3373, lng: -75.5579 }, zoom: 14 },
  { id: 'med-itagui', name: 'Itagüí / Ditaires', zone: 'Área Metropolitana', coords: { lat: 6.1738, lng: -75.6111 }, zoom: 14 },
];

interface GoogleMapsRoadViewProps {
  incidents: RoadIncident[];
  activeIncidentId: string | null;
  onSelectIncident: (id: string | null) => void;
  onOpenReportModalWithCoords?: (coords: { lat: number; lng: number; addressHint?: string }) => void;
  onUpvoteIncident?: (id: string) => void;
  className?: string;
}

export const GoogleMapsRoadView: React.FC<GoogleMapsRoadViewProps> = ({
  incidents,
  activeIncidentId,
  onSelectIncident,
  onOpenReportModalWithCoords,
  onUpvoteIncident,
  className = ''
}) => {
  const apiKey = ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) as string) || '';
  
  // Coordinates & Viewport State - Defaults strictly to Medellín, Antioquia
  const [center, setCenter] = useState<{ lat: number; lng: number }>(MEDELLIN_COORDS);
  const [zoom, setZoom] = useState<number>(14);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  
  // Real Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Localizando tu posición en Google Maps...');
  const [isUserNearbyMedellin, setIsUserNearbyMedellin] = useState<boolean>(true);
  
  // Interactive UI State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncidentForInfo, setSelectedIncidentForInfo] = useState<RoadIncident | null>(null);
  const [clickedMapPoint, setClickedMapPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync selected incident from props
  useEffect(() => {
    if (activeIncidentId) {
      const inc = incidents.find(i => i.id === activeIncidentId);
      if (inc && inc.lat && inc.lng) {
        setCenter({ lat: inc.lat, lng: inc.lng });
        setZoom(16);
        setSelectedIncidentForInfo(inc);
      }
    }
  }, [activeIncidentId, incidents]);

  // Request real user geolocation on mount, conforming to Google Maps standard behavior
  const handleDetectLocation = useCallback((isManualClick = false) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocalización no soportada en este navegador. Vista fijada en Medellín, Antioquia.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Obteniendo tu ubicación actual en tiempo real...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newUserLoc = { lat: latitude, lng: longitude };
        setUserLocation(newUserLoc);
        setCenter(newUserLoc);
        setZoom(16);
        setIsLocating(false);

        // Calculate distance from Medellín center to verify if user is nearby
        const latDiff = Math.abs(latitude - MEDELLIN_COORDS.lat);
        const lngDiff = Math.abs(longitude - MEDELLIN_COORDS.lng);
        const isNearby = latDiff < 1.0 && lngDiff < 1.0;
        setIsUserNearbyMedellin(isNearby);

        if (isNearby) {
          setLocationStatus(`📍 Ubicación detectada con precisión (~${Math.round(accuracy)}m). Mostrando tu sector en Medellín y vías aledañas.`);
        } else {
          setLocationStatus(`📍 Ubicación detectada (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). Mostrando vías aledañas a tu posición.`);
        }

        if (isManualClick) {
          soundEngine.playSuccess();
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation access note:', error.message);
        // Fallback strictly to Medellín, Antioquia
        setCenter(MEDELLIN_COORDS);
        setZoom(14);
        setLocationStatus('📍 Ubicación fijada en Medellín, Antioquia (Centro / Valle de Aburrá). Presiona el botón GPS para activar tu posición.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }, []);

  useEffect(() => {
    handleDetectLocation(false);
  }, [handleDetectLocation]);

  // Search Address / Sector in Medellín
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Check if matches known sector
    const matchedSector = MEDELLIN_SECTORS.find(s => 
      s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)
    );

    if (matchedSector) {
      setCenter(matchedSector.coords);
      setZoom(matchedSector.zoom);
      setLocationStatus(`Sector ubicado: ${matchedSector.name} (${matchedSector.zone})`);
      soundEngine.playClick();
      return;
    }

    // Check if matches an incident location
    const matchedIncident = incidents.find(i => 
      i.location.toLowerCase().includes(q) || i.title.toLowerCase().includes(q)
    );

    if (matchedIncident && matchedIncident.lat && matchedIncident.lng) {
      setCenter({ lat: matchedIncident.lat, lng: matchedIncident.lng });
      setZoom(16);
      setSelectedIncidentForInfo(matchedIncident);
      onSelectIncident(matchedIncident.id);
      setLocationStatus(`Incidencia encontrada: ${matchedIncident.title}`);
      soundEngine.playClick();
      return;
    }

    // Default search pan in Medellín
    setLocationStatus(`Buscando "${searchQuery}" en Medellín, Antioquia...`);
  };

  const handleSectorClick = (sector: SectorItem) => {
    soundEngine.playClick();
    setCenter(sector.coords);
    setZoom(sector.zoom);
    setSelectedIncidentForInfo(null);
    setClickedMapPoint(null);
    setLocationStatus(`Vista centrada en: ${sector.name} • ${sector.zone}`);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => null);
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => null);
      }
      setIsFullscreen(false);
    }
  };

  // Google Maps embed URL for interactive tile fallback
  const getEmbedUrl = () => {
    let q = `${center.lat},${center.lng}`;
    if (selectedIncidentForInfo) {
      q = `${selectedIncidentForInfo.lat},${selectedIncidentForInfo.lng}`;
    } else if (searchQuery.trim()) {
      q = encodeURIComponent(`${searchQuery}, Medellín, Antioquia, Colombia`);
    }

    let layerParam = '';
    if (mapType === 'satellite') {
      layerParam = '&t=k';
    } else if (mapType === 'terrain') {
      layerParam = '&t=p';
    }

    return `https://maps.google.com/maps?q=${q}&z=${zoom}${layerParam}&output=embed`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 flex flex-col ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : '520px', height: isFullscreen ? '100vh' : '560px' }}
    >
      {/* ================= BARRA SUPERIOR DE CONTROL GOOGLE MAPS ================= */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Search bar inside map */}
        <form 
          onSubmit={handleSearchSubmit}
          className="pointer-events-auto flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-1.5 shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full"
        >
          <div className="relative flex-1 flex items-center pl-2">
            <Search size={15} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en Medellín (ej. Av. El Poblado, Laureles, Calle 10)..."
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
          >
            Buscar
          </button>
        </form>

        {/* Action Controls (GPS, Layer toggle, Fullscreen) */}
        <div className="pointer-events-auto flex items-center gap-1.5 self-end sm:self-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">


          {/* Map Layer Mode Toggle */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => {
                setMapType('roadmap');
                soundEngine.playClick();
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                mapType === 'roadmap'
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => {
                setMapType('satellite');
                soundEngine.playClick();
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                mapType === 'satellite'
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Satélite
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-750" />

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ================= STATUS BADGE (LOCATION BANNER) ================= */}
      <div className="absolute top-16 sm:top-14 left-3 right-3 sm:right-auto z-20 pointer-events-none">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/80 text-[11px] font-semibold flex items-center gap-2 max-w-xl pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
          <span className="truncate">{locationStatus}</span>
          <button
            type="button"
            onClick={() => handleSectorClick(MEDELLIN_SECTORS[0])}
            className="ml-auto text-[10px] font-black uppercase text-sky-300 hover:text-sky-200 underline shrink-0 cursor-pointer"
          >
            Ir a Medellín Centro
          </button>
        </div>
      </div>

      {/* ================= MAP ENGINE CONTAINER ================= */}
      <div className="relative w-full flex-1 h-full">
        {apiKey ? (
          // Official Google Maps JavaScript API via @vis.gl/react-google-maps
          <APIProvider apiKey={apiKey}>
            <Map
              id="google-maps-road-view"
              mapId="DEMO_MAP_ID"
              center={center}
              zoom={zoom}
              onCenterChanged={(ev) => setCenter(ev.detail.center)}
              onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
              mapTypeId={mapType}
              disableDefaultUI={false}
              gestureHandling="greedy"
              className="w-full h-full"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              onClick={(e) => {
                if (e.detail?.latLng) {
                  const clicked = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
                  setClickedMapPoint(clicked);
                  soundEngine.playClick();
                }
              }}
            >
              {/* User Live Location Marker (Radar Halo) */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title="Tu ubicación actual">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                    <span className="absolute w-5 h-5 rounded-full bg-blue-500/50" />
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md z-10" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Road Incidents Markers */}
              {incidents.map((incident) => {
                if (!incident.lat || !incident.lng) return null;
                const isSelected = activeIncidentId === incident.id;

                let pinColor = '#f59e0b'; // Amber for pothole/default
                if (incident.category === 'semaforo') pinColor = '#ef4444'; // Red
                if (incident.category === 'obras') pinColor = '#3b82f6'; // Blue
                if (incident.category === 'senal_caida') pinColor = '#8b5cf6'; // Purple

                return (
                  <AdvancedMarker
                    key={incident.id}
                    position={{ lat: incident.lat, lng: incident.lng }}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedIncidentForInfo(incident);
                      onSelectIncident(incident.id);
                      setCenter({ lat: incident.lat!, lng: incident.lng! });
                    }}
                  >
                    <Pin
                      background={pinColor}
                      borderColor="#ffffff"
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* Active Incident InfoWindow */}
              {selectedIncidentForInfo && selectedIncidentForInfo.lat && selectedIncidentForInfo.lng && (
                <InfoWindow
                  position={{ lat: selectedIncidentForInfo.lat, lng: selectedIncidentForInfo.lng }}
                  onCloseClick={() => setSelectedIncidentForInfo(null)}
                >
                  <div className="p-2 max-w-xs text-slate-900 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                        {selectedIncidentForInfo.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {selectedIncidentForInfo.reportedAt}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {selectedIncidentForInfo.title}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {selectedIncidentForInfo.location}
                    </p>
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpvoteIncident) onUpvoteIncident(selectedIncidentForInfo.id);
                        }}
                        className="text-[10px] font-bold text-slate-700 hover:text-[#0052cc] flex items-center gap-1"
                      >
                        <ThumbsUp size={11} />
                        <span>{selectedIncidentForInfo.upvotes} apoyos</span>
                      </button>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncidentForInfo.lat},${selectedIncidentForInfo.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-[#0052cc] hover:underline flex items-center gap-1"
                      >
                        <span>Cómo llegar</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          // Seamless Interactive Google Maps Engine Fallback (Full Features, Live GPS & Satellite)
          <div className="relative w-full h-full bg-slate-900">
            <iframe
              title="Google Maps Medellín y Ubicación Actual"
              src={getEmbedUrl()}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Overlay Simulated User Marker if Geolocation is Live */}
            {userLocation && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center"
                title="Tu posición actual"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-[#0052cc]/30 animate-ping" />
                  <span className="absolute w-8 h-8 rounded-full bg-sky-400/40" />
                  <span className="w-4 h-4 rounded-full bg-[#0052cc] border-2 border-white shadow-xl z-10" />
                </div>
                <span className="mt-1 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-slate-700">
                  Tú estás aquí
                </span>
              </div>
            )}
          </div>
        )}

        {/* ================= FLOATING ACTION: CREAR REPORTE EN ESTE PUNTO ================= */}
        {clickedMapPoint && onOpenReportModalWithCoords && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-sky-400/60 flex items-center gap-3 animate-fade-in">
            <div className="text-xs">
              <span className="font-bold text-sky-400 block">Punto marcado en el mapa:</span>
              <span className="text-[10px] text-slate-300 font-mono">
                {clickedMapPoint.lat.toFixed(5)}, {clickedMapPoint.lng.toFixed(5)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenReportModalWithCoords(clickedMapPoint);
                setClickedMapPoint(null);
                soundEngine.playClick();
              }}
              className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Reportar aquí</span>
            </button>
            <button
              type="button"
              onClick={() => setClickedMapPoint(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ================= QUICK SECTOR CHIPS FOR MEDELLÍN ================= */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <div className="bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black uppercase text-sky-400 shrink-0 border border-slate-700 flex items-center gap-1">
            <Compass size={11} />
            <span>Medellín:</span>
          </div>

          {MEDELLIN_SECTORS.map((sector) => {
            const isNear = Math.abs(center.lat - sector.coords.lat) < 0.008 && Math.abs(center.lng - sector.coords.lng) < 0.008;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSectorClick(sector)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 border select-none ${
                  isNear
                    ? 'bg-[#0052cc] text-white border-blue-400 shadow-sm'
                    : 'bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#0052cc]'
                }`}
              >
                <span>{sector.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
