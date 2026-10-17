import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Compass,
  RotateCcw,
  Navigation,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { RoadIncident } from '../types';
import { soundEngine } from '../utils/soundEffects';

// Google Maps Platform API Key (Provisioned via Google Maps Platform Skill)
export const GOOGLE_MAPS_API_KEY = 
  ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) as string) || 
  'AIzaSyDwMPlKTAQ4zaEz_IiHjHmfISAjV4Nw-gk';

// Default reference coordinates (Medellín, Colombia - Valle de Aburrá)
export const MEDELLIN_COORDS = { lat: 6.2476, lng: -75.5658 };

export interface SectorItem {
  id: string;
  name: string;
  zone: string;
  coords: { lat: number; lng: number };
  zoom: number;
}

export const COLOMBIA_SECTORS: SectorItem[] = [
  { id: 'med-centro', name: 'Medellín Centro', zone: 'Antioquia', coords: { lat: 6.2476, lng: -75.5658 }, zoom: 15 },
  { id: 'med-poblado', name: 'El Poblado / Las Vegas', zone: 'Medellín Sur', coords: { lat: 6.2089, lng: -75.5684 }, zoom: 15 },
  { id: 'med-laureles', name: 'Laureles - Estadio', zone: 'Medellín Occidente', coords: { lat: 6.2443, lng: -75.5925 }, zoom: 15 },
  { id: 'med-envigado', name: 'Envigado', zone: 'Valle de Aburrá', coords: { lat: 6.1698, lng: -75.5874 }, zoom: 14 },
  { id: 'bogota-centro', name: 'Bogotá Centro / Séptima', zone: 'Cundinamarca', coords: { lat: 4.6097, lng: -74.0817 }, zoom: 15 },
  { id: 'cali-centro', name: 'Cali / Av. Colombia', zone: 'Valle del Cauca', coords: { lat: 3.4516, lng: -76.5320 }, zoom: 15 },
  { id: 'barranquilla-centro', name: 'Barranquilla / Vía 40', zone: 'Atlántico', coords: { lat: 10.9685, lng: -74.7813 }, zoom: 14 },
];

/**
 * Controller sub-component to handle map panTo and zoom via google.maps.Map instance
 */
function MapCameraController({ 
  targetCenter, 
  targetZoom,
  triggerCenter
}: { 
  targetCenter: { lat: number; lng: number }; 
  targetZoom: number;
  triggerCenter: number;
}) {
  const map = useMap('google-maps-road-view');

  useEffect(() => {
    if (!map) return;
    map.panTo(targetCenter);
    map.setZoom(targetZoom);
  }, [map, triggerCenter, targetCenter, targetZoom]);

  return null;
}

/**
 * Real-time Google Maps Traffic Layer controller
 */
function GoogleMapsTrafficOverlay({ enabled }: { enabled: boolean }) {
  const map = useMap('google-maps-road-view');
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (enabled) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
    };
  }, [map, enabled]);

  return null;
}

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
  // Coordinates & Viewport State
  const [center, setCenter] = useState<{ lat: number; lng: number }>(MEDELLIN_COORDS);
  const [zoom, setZoom] = useState<number>(15);
  const [triggerCenter, setTriggerCenter] = useState<number>(0);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Obteniendo tu ubicación en Google Maps...');
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Search & Interaction State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedIncidentForInfo, setSelectedIncidentForInfo] = useState<RoadIncident | null>(null);
  const [clickedMapPoint, setClickedMapPoint] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reverse geocodes coordinates to street / neighborhood
  const reverseGeocode = useCallback((coords: { lat: number; lng: number }, callback: (formatted: string) => void) => {
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          callback(results[0].formatted_address);
        } else {
          callback(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        }
      });
    } else {
      callback(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    }
  }, []);

  // Center map on user location and reveal surrounding roads
  const handleDetectLocation = useCallback((isManualClick = false) => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocalización no soportada en este navegador. Vista fijada en Medellín, Colombia.');
      setHasLocationPermission(false);
      return;
    }

    setIsLocating(true);
    setLocationStatus('Accediendo a tu ubicación exacta con Google Maps...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newUserLoc = { lat: latitude, lng: longitude };
        setUserLocation(newUserLoc);
        setCenter(newUserLoc);
        setZoom(16); // High zoom to display surrounding neighborhood streets
        setTriggerCenter(prev => prev + 1);
        setIsLocating(false);
        setHasLocationPermission(true);

        reverseGeocode(newUserLoc, (addr) => {
          setUserAddress(addr);
          setLocationStatus(`📍 Estás en: ${addr}. Mostrando tus vías y zonas aledañas (precisión ~${Math.round(accuracy)}m).`);
        });

        if (isManualClick) {
          soundEngine.playSuccess();
        }
      },
      (error) => {
        setIsLocating(false);
        setHasLocationPermission(false);
        console.warn('Geolocation warning:', error.message);
        setLocationStatus('📍 Permiso de GPS no concedido. Vista fijada en Medellín, Colombia. Presiona «Mi Ubicación» para reintentar.');
        setCenter(MEDELLIN_COORDS);
        setZoom(14);
        setTriggerCenter(prev => prev + 1);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000
      }
    );
  }, [reverseGeocode]);

  // Request location on initial mount (as requested: "Debe ubicarme la vista de acuerdo al lugar en donde me encuentre")
  useEffect(() => {
    handleDetectLocation(false);
  }, [handleDetectLocation]);

  // Sync selected incident from external props
  useEffect(() => {
    if (activeIncidentId) {
      const inc = incidents.find(i => i.id === activeIncidentId);
      if (inc && inc.lat && inc.lng) {
        setCenter({ lat: inc.lat, lng: inc.lng });
        setZoom(16);
        setTriggerCenter(prev => prev + 1);
        setSelectedIncidentForInfo(inc);
      }
    }
  }, [activeIncidentId, incidents]);

  // Search Address / Point using Google Maps Geocoder API
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);

    // Try Google Maps Geocoder
    if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: q }, (results, status) => {
        setIsSearching(false);
        if (status === 'OK' && results && results[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          const newCoords = { lat: loc.lat(), lng: loc.lng() };
          setCenter(newCoords);
          setZoom(16);
          setTriggerCenter(prev => prev + 1);
          setLocationStatus(`📍 Ubicación encontrada: ${results[0].formatted_address}. Mostrando vías aledañas.`);
          soundEngine.playSuccess();
          return;
        }

        // Fallback local search
        fallbackLocalSearch(q);
      });
    } else {
      setIsSearching(false);
      fallbackLocalSearch(q);
    }
  };

  const fallbackLocalSearch = (q: string) => {
    const qLower = q.toLowerCase();
    const matchedSector = COLOMBIA_SECTORS.find(s => 
      s.name.toLowerCase().includes(qLower) || s.zone.toLowerCase().includes(qLower)
    );

    if (matchedSector) {
      setCenter(matchedSector.coords);
      setZoom(matchedSector.zoom);
      setTriggerCenter(prev => prev + 1);
      setLocationStatus(`Sector ubicado: ${matchedSector.name} (${matchedSector.zone})`);
      soundEngine.playClick();
      return;
    }

    const matchedIncident = incidents.find(i => 
      i.location.toLowerCase().includes(qLower) || i.title.toLowerCase().includes(qLower)
    );

    if (matchedIncident && matchedIncident.lat && matchedIncident.lng) {
      setCenter({ lat: matchedIncident.lat, lng: matchedIncident.lng });
      setZoom(16);
      setTriggerCenter(prev => prev + 1);
      setSelectedIncidentForInfo(matchedIncident);
      onSelectIncident(matchedIncident.id);
      setLocationStatus(`Incidencia encontrada: ${matchedIncident.title}`);
      soundEngine.playClick();
      return;
    }

    setLocationStatus(`No se encontró "${q}". Mostrando zona actual.`);
  };

  const handleSectorClick = (sector: SectorItem) => {
    soundEngine.playClick();
    setCenter(sector.coords);
    setZoom(sector.zoom);
    setTriggerCenter(prev => prev + 1);
    setSelectedIncidentForInfo(null);
    setClickedMapPoint(null);
    setLocationStatus(`Vista centrada en: ${sector.name} (${sector.zone})`);
  };

  // Toggle fullscreen mode
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

  // Handle map click to place incident marker
  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const clicked = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      reverseGeocode(clicked, (addr) => {
        setClickedMapPoint({ ...clicked, address: addr });
      });
      soundEngine.playClick();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-900 flex flex-col ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : '520px', height: isFullscreen ? '100vh' : '580px' }}
    >
      {/* ================= BARRA SUPERIOR FLOTANTE DE CONTROL GOOGLE MAPS ================= */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        
        {/* Search bar inside Google Maps */}
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
              placeholder="Buscar dirección, calle o sector en el mapa..."
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
            disabled={isSearching}
            className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
          >
            {isSearching ? <Loader2 size={13} className="animate-spin" /> : <span>Buscar</span>}
          </button>
        </form>

        {/* Action Controls (GPS Live, Layers, Traffic, Fullscreen) */}
        <div className="pointer-events-auto flex items-center gap-1.5 self-end sm:self-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          {/* Real-time GPS Button */}
          <button
            type="button"
            id="btn-gps-my-location"
            onClick={() => handleDetectLocation(true)}
            disabled={isLocating}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              userLocation
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
            title="Ubicar mi posición actual en tiempo real en Google Maps"
          >
            <Crosshair size={15} className={isLocating ? 'animate-spin text-white' : ''} />
            <span className="text-xs font-bold">
              {isLocating ? 'Ubicando...' : 'Mi Ubicación'}
            </span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-750" />

          {/* Traffic Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowTraffic(prev => !prev);
              soundEngine.playClick();
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              showTraffic
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Activar o desactivar flujo de tráfico en vivo"
          >
            <Car size={13} />
            <span className="hidden md:inline">Tráfico</span>
          </button>

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
                setMapType('hybrid');
                soundEngine.playClick();
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                mapType === 'hybrid' || mapType === 'satellite'
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

      {/* ================= STATUS BADGE (CURRENT LOCATION & ROADS BANNER) ================= */}
      <div className="absolute top-16 sm:top-14 left-3 right-3 sm:right-auto z-20 pointer-events-none">
        <div className="bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 text-xs font-semibold flex items-center gap-2 max-w-xl pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
          <span className="truncate">{locationStatus}</span>
          {userLocation ? (
            <button
              type="button"
              onClick={() => {
                setCenter(userLocation);
                setZoom(16);
                setTriggerCenter(prev => prev + 1);
                soundEngine.playClick();
              }}
              className="ml-auto text-[11px] font-black uppercase text-sky-300 hover:text-sky-200 underline shrink-0 cursor-pointer"
            >
              Re-centrar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleDetectLocation(true)}
              className="ml-auto text-[11px] font-black uppercase text-amber-300 hover:text-amber-200 underline shrink-0 cursor-pointer"
            >
              Activar GPS
            </button>
          )}
        </div>
      </div>

      {/* ================= GOOGLE MAPS PLATFORM ENGINE CONTAINER ================= */}
      <div className="relative w-full flex-1 h-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'places']}>
          <Map
            id="google-maps-road-view"
            mapId="DEMO_MAP_ID"
            defaultCenter={center}
            defaultZoom={zoom}
            center={center}
            zoom={zoom}
            mapTypeId={mapType}
            disableDefaultUI={false}
            gestureHandling="greedy"
            className="w-full h-full"
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            onClick={handleMapClick}
          >
            {/* Camera Smooth Pan & Zoom Controller */}
            <MapCameraController 
              targetCenter={center} 
              targetZoom={zoom} 
              triggerCenter={triggerCenter} 
            />

            {/* Google Maps Traffic Layer */}
            <GoogleMapsTrafficOverlay enabled={showTraffic} />

            {/* User Live Location Marker (Authentic Pulsing Google Maps Blue Dot) */}
            {userLocation && (
              <AdvancedMarker position={userLocation} title="Tu ubicación actual">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
                  <span className="absolute w-6 h-6 rounded-full bg-blue-500/50 pointer-events-none" />
                  <span className="w-4 h-4 rounded-full bg-[#0052cc] border-2 border-white shadow-xl z-10" />
                </div>
              </AdvancedMarker>
            )}

            {/* Temporary Marker for Clicked Point to Report Incident */}
            {clickedMapPoint && (
              <AdvancedMarker position={{ lat: clickedMapPoint.lat, lng: clickedMapPoint.lng }}>
                <Pin
                  background="#0284c7"
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                  scale={1.2}
                />
              </AdvancedMarker>
            )}

            {/* Road Incidents Markers */}
            {incidents.map((incident) => {
              if (!incident.lat || !incident.lng) return null;
              const isSelected = activeIncidentId === incident.id;

              let pinColor = '#f59e0b'; // Amber for pothole
              if (incident.category === 'semaforo') pinColor = '#ef4444'; // Red for traffic light
              if (incident.category === 'obras') pinColor = '#3b82f6'; // Blue for roadworks
              if (incident.category === 'senal_caida') pinColor = '#8b5cf6'; // Purple for sign

              return (
                <AdvancedMarker
                  key={incident.id}
                  position={{ lat: incident.lat, lng: incident.lng }}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedIncidentForInfo(incident);
                    onSelectIncident(incident.id);
                    setCenter({ lat: incident.lat!, lng: incident.lng! });
                    setZoom(16);
                    setTriggerCenter(prev => prev + 1);
                  }}
                >
                  <Pin
                    background={pinColor}
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={isSelected ? 1.3 : 1.0}
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
                <div className="p-2.5 max-w-xs text-slate-900 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800">
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
                  <p className="text-[10px] text-slate-500 italic">
                    {selectedIncidentForInfo.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpvoteIncident) onUpvoteIncident(selectedIncidentForInfo.id);
                      }}
                      className="text-[11px] font-bold text-slate-700 hover:text-[#0052cc] flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp size={12} />
                      <span>{selectedIncidentForInfo.upvotes} apoyos</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedIncidentForInfo.lat},${selectedIncidentForInfo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-black text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Cómo llegar</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* ================= FLOATING ACTION: CREAR REPORTE EN ESTE PUNTO ================= */}
        {clickedMapPoint && onOpenReportModalWithCoords && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-sky-400/80 flex items-center gap-3 animate-fade-in max-w-md w-[calc(100%-2rem)] sm:w-auto">
            <div className="text-xs flex-1 truncate">
              <span className="font-bold text-sky-400 block">Punto marcado en la vía:</span>
              <span className="text-[11px] text-slate-200 truncate block">
                {clickedMapPoint.address || `${clickedMapPoint.lat.toFixed(5)}, ${clickedMapPoint.lng.toFixed(5)}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenReportModalWithCoords({
                  lat: clickedMapPoint.lat,
                  lng: clickedMapPoint.lng,
                  addressHint: clickedMapPoint.address
                });
                setClickedMapPoint(null);
                soundEngine.playClick();
              }}
              className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>Reportar aquí</span>
            </button>
            <button
              type="button"
              onClick={() => setClickedMapPoint(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ================= QUICK SECTOR CHIPS ================= */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-sky-400 shrink-0 border border-slate-700 flex items-center gap-1">
            <Compass size={12} />
            <span>Sectores:</span>
          </div>

          {COLOMBIA_SECTORS.map((sector) => {
            const isNear = Math.abs(center.lat - sector.coords.lat) < 0.008 && Math.abs(center.lng - sector.coords.lng) < 0.008;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSectorClick(sector)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs cursor-pointer shrink-0 border select-none ${
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
