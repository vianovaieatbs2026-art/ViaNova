import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  AlertTriangle, 
  MapPin, 
  ThumbsUp, 
  Filter, 
  Camera, 
  X,
  ExternalLink,
  Navigation as NavigationIcon,
  Search,
  Crosshair,
  Radio,
  Layers,
  ZoomIn,
  ZoomOut,
  Car,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { COLOMBIAN_ROAD_INCIDENTS } from '../data/mockData';
import { RoadIncident, UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface MobilityReportsScreenProps {
  user: UserProfile | null;
  onBackToDashboard: () => void;
  onNavigateToAuth: (mode: 'login' | 'registro') => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

const INCIDENTS_STORAGE_KEY = 'vianova_road_incidents';

interface CityOption {
  name: string;
  department: string;
  coords: { lat: number; lng: number };
  zoom: number;
}

import { GoogleMapsLive, MapMarkerPoint } from './GoogleMapsLive';

// Medellín, Antioquia is the PRIMARY and exclusive city of the platform (NO Bogotá)
export const MEDELLIN_COORDS = { lat: 6.2476, lng: -75.5658 };

export const COLOMBIAN_CITIES: CityOption[] = [
  { name: 'Medellín (Centro)', department: 'Antioquia', coords: { lat: 6.2476, lng: -75.5658 }, zoom: 14 },
  { name: 'El Poblado', department: 'Antioquia', coords: { lat: 6.2085, lng: -75.5678 }, zoom: 15 },
  { name: 'Laureles / Estadio', department: 'Antioquia', coords: { lat: 6.25184, lng: -75.5898 }, zoom: 15 },
  { name: 'Belén / Av. 80', department: 'Antioquia', coords: { lat: 6.2312, lng: -75.6015 }, zoom: 15 },
  { name: 'Envigado', department: 'Antioquia', coords: { lat: 6.1685, lng: -75.5842 }, zoom: 15 },
  { name: 'Bello', department: 'Antioquia', coords: { lat: 6.3355, lng: -75.5583 }, zoom: 15 },
  { name: 'Itagüí', department: 'Antioquia', coords: { lat: 6.1725, lng: -75.6111 }, zoom: 15 },
  { name: 'Sabaneta', department: 'Antioquia', coords: { lat: 6.1514, lng: -75.6156 }, zoom: 15 },
];

export const MEDELLIN_SURROUNDING_ZONES = [
  { id: 'poblado', name: 'El Poblado / Calle 10', coords: { lat: 6.2085, lng: -75.5678 }, label: 'El Poblado' },
  { id: 'laureles', name: 'Laureles / San Juan / Cra 70', coords: { lat: 6.25184, lng: -75.5898 }, label: 'Laureles / Estadio' },
  { id: 'centro', name: 'Centro / Av. Oriental', coords: { lat: 6.2486, lng: -75.5689 }, label: 'Centro' },
  { id: 'sur', name: 'Autopista Sur / Guayabal', coords: { lat: 6.2285, lng: -75.5795 }, label: 'Autopista Sur' },
  { id: 'vegas', name: 'Av. Las Vegas / EAFIT', coords: { lat: 6.1982, lng: -75.5786 }, label: 'Las Vegas' },
  { id: 'regional', name: 'Av. Regional / Eje del Río', coords: { lat: 6.2401, lng: -75.5762 }, label: 'Av. Regional' },
  { id: 'belen', name: 'Belén / Av. 80', coords: { lat: 6.2312, lng: -75.6015 }, label: 'Belén / La 80' },
  { id: 'envigado', name: 'Envigado / Sabaneta', coords: { lat: 6.1685, lng: -75.5842 }, label: 'Envigado' },
];

// Helper to calculate distance between two coordinates in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const MobilityReportsScreen: React.FC<MobilityReportsScreenProps> = ({ 
  user, 
  onBackToDashboard,
  onNavigateToAuth: _onNavigateToAuth,
  onUpdateUser
}) => {
  const { t } = useThemeLanguage();

  // Load and persist incidents
  const [incidents, setIncidents] = useState<RoadIncident[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading incidents from storage', e);
      }
    }
    return COLOMBIAN_ROAD_INCIDENTS;
  });

  // Selected city defaults strictly to Medellín, Antioquia
  const [selectedCity, setSelectedCity] = useState<CityOption>(COLOMBIAN_CITIES[0]);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(incidents[0]?.id || null);
  const [mapType, setMapType] = useState<'traffic' | 'roadmap' | 'satellite'>('traffic');
  const [customSearchLocation, setCustomSearchLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [upvotedIds, setUpvotedIds] = useState<{ [id: string]: boolean }>({});

  // Real-time GPS Geolocation states
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [geolocationState, setGeolocationState] = useState<'locating' | 'granted' | 'denied' | 'fallback'>('locating');
  const [locationLabel, setLocationLabel] = useState<string>('Detectando ubicación...');
  const [mapZoom, setMapZoom] = useState<number>(15);
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number }>(MEDELLIN_COORDS);

  // Search submit state
  const [submittedSearchLocation, setSubmittedSearchLocation] = useState<string>('');
  const [foregroundNotice, setForegroundNotice] = useState<string | null>(null);

  // New Report Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoadIncident['category']>('bache');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<RoadIncident['severity']>('media');
  const [reportCoords, setReportCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hasAttachedPhoto, setHasAttachedPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map incidents to GoogleMapsLive marker points
  const incidentMarkers: MapMarkerPoint[] = useMemo(() => {
    return incidents
      .filter((inc) => inc.lat && inc.lng)
      .map((inc) => ({
        id: inc.id,
        title: inc.title,
        description: `${inc.location} • ${inc.description}`,
        coords: { lat: inc.lat!, lng: inc.lng! },
        category: 'incident' as const,
        severity: inc.severity as any
      }));
  }, [incidents]);

  // 1. Initial Automatic Geolocation on Mount (Exactly like Google Maps does)
  useEffect(() => {
    requestUserLocation(true);
  }, []);

  const requestUserLocation = (isInitial: boolean = false) => {
    setIsLocating(true);
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setIsLocating(false);
      setGeolocationState('fallback');
      setLocationLabel('Medellín, Antioquia (Predeterminado)');
      setCurrentMapCenter(MEDELLIN_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = { lat: latitude, lng: longitude, accuracy };
        setUserLocation(coords);
        setCurrentMapCenter({ lat: latitude, lng: longitude });
        setMapZoom(16); // Close-up view of current location and surroundings
        setIsLocating(false);
        setGeolocationState('granted');
        setLocationLabel('Tu ubicación actual (GPS en vivo)');

        setForegroundNotice('Ubicado en tu posición actual. Mostrando zonas e incidencias aledañas.');
        setTimeout(() => setForegroundNotice(null), 4000);
      },
      (error) => {
        console.info('GPS no disponible o denegado por el navegador:', error.message);
        setIsLocating(false);
        setGeolocationState('fallback');
        // Defaults seamlessly to Medellín, Antioquia (NO Bogotá)
        setCurrentMapCenter(MEDELLIN_COORDS);
        setMapZoom(14);
        setLocationLabel('Medellín, Antioquia (Valle de Aburrá)');

        if (!isInitial) {
          setForegroundNotice('Permiso de GPS no concedido. Ubicado en Medellín, Antioquia.');
          setTimeout(() => setForegroundNotice(null), 4000);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000
      }
    );
  };

  const activeIncident = incidents.find(inc => inc.id === activeIncidentId);

  // Compute Google Maps Embed URL
  const mapEmbedUrl = useMemo(() => {
    let query = `${currentMapCenter.lat},${currentMapCenter.lng}`;
    let zoom = mapZoom;

    if (submittedSearchLocation.trim()) {
      query = encodeURIComponent(`${submittedSearchLocation.trim()}, Medellín, Colombia`);
      zoom = 16;
    } else if (activeIncident) {
      if (activeIncident.lat && activeIncident.lng) {
        query = `${activeIncident.lat},${activeIncident.lng}`;
      } else {
        query = encodeURIComponent(`${activeIncident.location}, ${activeIncident.city || 'Medellín'}, Colombia`);
      }
      zoom = 17; // Close-up foreground for active incident
    } else if (userLocation && geolocationState === 'granted') {
      query = `${userLocation.lat},${userLocation.lng}`;
    }

    const mapTypeParam = mapType === 'satellite' ? '&t=k' : '';
    return `https://maps.google.com/maps?q=${query}&z=${zoom}${mapTypeParam}&output=embed`;
  }, [currentMapCenter, mapZoom, submittedSearchLocation, activeIncident, userLocation, geolocationState, mapType]);

  const handleSearchLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSearchLocation.trim();
    if (!query) return;

    setActiveIncidentId(null);
    setSubmittedSearchLocation(query);
    setForegroundNotice(`Buscando y ubicando en Google Maps: ${query}`);

    const mapElement = document.getElementById('mapa-reportes-movilidad');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setForegroundNotice(null);
    }, 4500);
  };

  const handleSelectSurroundingZone = (zone: typeof MEDELLIN_SURROUNDING_ZONES[0]) => {
    setActiveIncidentId(null);
    setSubmittedSearchLocation('');
    setCustomSearchLocation(zone.name);
    setCurrentMapCenter(zone.coords);
    setMapZoom(16);
    setForegroundNotice(`Centrado en zona: ${zone.name}`);
    setTimeout(() => setForegroundNotice(null), 3000);
  };

  const handleCenterOnUserLocation = () => {
    if (userLocation) {
      setActiveIncidentId(null);
      setSubmittedSearchLocation('');
      setCurrentMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
      setMapZoom(16);
      setForegroundNotice('Centrado en tu ubicación actual.');
      setTimeout(() => setForegroundNotice(null), 3000);
    } else {
      requestUserLocation(false);
    }
  };

  const saveIncidents = (updatedList: RoadIncident[]) => {
    setIncidents(updatedList);
    try {
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Error saving incidents', e);
    }
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds(prev => ({ ...prev, [id]: true }));
    const nextList = incidents.map(inc => inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc);
    saveIncidents(nextList);
  };

  const handleUseCurrentLocationForReport = () => {
    if (userLocation) {
      setReportCoords({ lat: userLocation.lat, lng: userLocation.lng });
      setLocation(`Mi Ubicación GPS (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}), Medellín`);
    } else {
      requestUserLocation(false);
      setReportCoords(MEDELLIN_COORDS);
      setLocation('Medellín, Antioquia');
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const author = user ? `${user.name}` : 'Ciudadano en Vía (Medellín)';
    const coords = reportCoords || {
      lat: currentMapCenter.lat + (Math.random() - 0.5) * 0.02,
      lng: currentMapCenter.lng + (Math.random() - 0.5) * 0.02
    };

    const newReport: RoadIncident = {
      id: `inc-med-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim(),
      city: 'Medellín',
      lat: coords.lat,
      lng: coords.lng,
      description: description.trim() || 'Incidencia vial registrada y georreferenciada en Medellín, Antioquia.',
      severity,
      status: 'reportado',
      reportedAt: 'Hace un momento',
      authorName: author,
      upvotes: 1
    };

    const nextList = [newReport, ...incidents];
    saveIncidents(nextList);
    setActiveIncidentId(newReport.id);
    setCurrentMapCenter({ lat: coords.lat, lng: coords.lng });
    setMapZoom(17);
    setCustomSearchLocation('');

    // Reward points for civic participation
    if (user && onUpdateUser) {
      onUpdateUser({
        ...user,
        gamificationPoints: (user.gamificationPoints || 0) + 15,
        activeReports: (user.activeReports || 0) + 1
      });
    }

    // Reset modal
    setTitle('');
    setLocation('');
    setDescription('');
    setReportCoords(null);
    setHasAttachedPhoto(false);
    setShowNewModal(false);

    setForegroundNotice('¡Reporte publicado con éxito en el mapa de Medellín!');
    setTimeout(() => setForegroundNotice(null), 4000);
  };

  // Filter and sort incidents by proximity if user coordinates are known
  const filteredIncidents = useMemo(() => {
    let result = incidents.filter(inc => {
      if (filterCategory !== 'todos' && inc.category !== filterCategory) return false;
      if (filterStatus !== 'todos' && inc.status !== filterStatus) return false;
      return true;
    });

    // If userLocation is available, calculate distances and sort closest first
    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = a.lat && a.lng ? calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) : 999;
        const distB = b.lat && b.lng ? calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng) : 999;
        return distA - distB;
      });
    }

    return result;
  }, [incidents, filterCategory, filterStatus, userLocation]);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft size={14} />
          <span>{t('sim_back_to_dashboard', 'Volver al Inicio')}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* GPS Live Geolocation Status Badge */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700">
            <span className="relative flex h-2.5 w-2.5">
              {isLocating ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              ) : geolocationState === 'granted' ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              ) : null}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isLocating ? 'bg-amber-500' : geolocationState === 'granted' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}></span>
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {isLocating ? 'Localizando GPS...' : locationLabel}
            </span>
            <button
              type="button"
              onClick={handleCenterOnUserLocation}
              disabled={isLocating}
              title="Centrar en mi ubicación actual"
              className="ml-1 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0052cc] dark:text-sky-400 cursor-pointer disabled:opacity-50"
            >
              <Crosshair size={13} className={isLocating ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* City Selector Tabs - Medellín is ALWAYS first */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {COLOMBIAN_CITIES.map((city) => {
              const isSelected = selectedCity.name === city.name;
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setActiveIncidentId(null);
                    setSubmittedSearchLocation('');
                    setCustomSearchLocation('');
                    setCurrentMapCenter(city.coords);
                    setMapZoom(city.zoom);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {city.name.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* Hero Header with Medellín & Google Maps Branding */}
      <div className="bg-gradient-to-r from-[#0a2540] via-[#0052cc] to-[#041e42] rounded-3xl p-6 sm:p-7 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-center">
          <MapPin size={240} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={13} className="text-[#38bdf8]" />
              <span>GOOGLE MAPS • MEDELLÍN & VALLE DE ABURRÁ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mapa Interactivo de Incidencias Viales • Medellín, Antioquia
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Georreferenciación en tiempo real con Google Maps. Tu vista se orienta a tu ubicación actual para mostrarte baches, semáforos, cierres viales y zonas aledañas en el Valle de Aburrá.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCenterOnUserLocation}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Crosshair size={14} />
              <span>Mi Ubicación GPS</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Medellin, Antioquia, Colombia')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Abrir Google Maps App</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Quick Chips: Zonas Aledañas en Medellín (Surrounding Areas) */}
        <div className="pt-2 border-t border-white/15 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-200 mb-2">
            <Radio size={13} className="animate-pulse text-amber-300" />
            <span>Zonas aledañas en Medellín (Acceso rápido):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {MEDELLIN_SURROUNDING_ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => handleSelectSurroundingZone(zone)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border border-white/10"
              >
                📍 {zone.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Incidents List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Google Map Container & Controls */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Map Controls Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            {/* Search address / avenue form */}
            <form 
              onSubmit={handleSearchLocationSubmit}
              className="flex-1 min-w-[240px] flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar en Medellín (ej: Av. El Poblado, San Juan, Cra 70, La 80)..."
                  value={customSearchLocation}
                  onChange={(e) => setCustomSearchLocation(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-500"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {customSearchLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSearchLocation('');
                      setSubmittedSearchLocation('');
                      setForegroundNotice(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    title="Limpiar"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                id="btn-buscar-mapa-reportes"
                className="px-3.5 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Buscar y ubicar en el mapa de Medellín"
              >
                <Search size={13} />
                <span>Buscar</span>
              </button>
            </form>

            {/* View Layers Toggle (Traffic, Satellite, Default) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMapType('traffic')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  mapType === 'traffic' ? 'bg-[#0052cc] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Tráfico
              </button>
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  mapType === 'roadmap' ? 'bg-[#0052cc] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Calles
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  mapType === 'satellite' ? 'bg-[#0052cc] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Satélite
              </button>
            </div>
          </div>

          {/* Interactive Google Map Box with Official Google Maps Platform */}
          <div 
            id="mapa-reportes-movilidad"
            className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <GoogleMapsLive 
              initialCenter={selectedCity.coords}
              initialZoom={selectedCity.zoom}
              heightClass="h-[460px] sm:h-[540px]"
              customMarkers={incidentMarkers}
              onMarkerClick={(m) => setActiveIncidentId(m.id)}
              showSurroundingSelector={false}
              showSearchBar={false}
            />

            {/* Active Incident Overlay Card at bottom of map */}
            {activeIncident && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 animate-fade-in z-20">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                      {activeIncident.category.replace("_", " ")} • {activeIncident.city || "Medellín"}
                    </span>
                    {userLocation && activeIncident.lat && activeIncident.lng && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        A {calculateDistanceKm(userLocation.lat, userLocation.lng, activeIncident.lat, activeIncident.lng) < 1 
                          ? `${Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, activeIncident.lat, activeIncident.lng) * 1000)} m` 
                          : `${calculateDistanceKm(userLocation.lat, userLocation.lng, activeIncident.lat, activeIncident.lng).toFixed(1)} km`} de ti
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeIncident.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activeIncident.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((activeIncident.lat && activeIncident.lng ? `${activeIncident.lat},${activeIncident.lng}` : activeIncident.location) + ", Medellín, Colombia")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <NavigationIcon size={12} />
                    <span>Cómo llegar</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Community Incidents List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Incidencias en Medellín ({filteredIncidents.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Clic para enfocar en Google Maps</span>
            </div>

            {/* Categories filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'bache', label: 'Baches' },
                { id: 'semaforo', label: 'Semáforos' },
                { id: 'senal_caida', label: 'Señales' },
                { id: 'obras', label: 'Obras' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    filterCategory === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Incidents in Medellín */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredIncidents.map((incident) => {
              const isActive = activeIncidentId === incident.id;
              const hasUpvoted = upvotedIds[incident.id];
              const distKm = userLocation && incident.lat && incident.lng
                ? calculateDistanceKm(userLocation.lat, userLocation.lng, incident.lat, incident.lng)
                : null;

              return (
                <div
                  key={incident.id}
                  onClick={() => {
                    setActiveIncidentId(incident.id);
                    setSubmittedSearchLocation('');
                    setCustomSearchLocation('');
                    if (incident.lat && incident.lng) {
                      setCurrentMapCenter({ lat: incident.lat, lng: incident.lng });
                      setMapZoom(17);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#0052cc] dark:border-sky-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {incident.category.replace('_', ' ')}
                      </span>
                      {distKm !== null && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          📍 {distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`}
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      incident.status === 'resuelto' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                        : incident.status === 'en_proceso'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {incident.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0f172a] dark:text-white leading-snug">
                    {incident.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
                    <span className="truncate">{incident.location} • {incident.city || 'Medellín'}</span>
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">Por {incident.authorName}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(incident.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        hasUpvoted
                          ? 'bg-blue-100 text-[#0052cc] dark:bg-blue-950/80 dark:text-sky-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp size={12} />
                      <span>{incident.upvotes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-[#0f172a] dark:text-white flex items-center gap-2">
                <PlusCircle size={18} className="text-[#0052cc] dark:text-sky-400" />
                <span>Nuevo Reporte en Medellín (Google Maps)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Título del Reporte *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Bache profundo en carril derecho o Semáforo intermitente"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tipo de Incidencia
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                  >
                    <option value="bache">Hueco / Bache</option>
                    <option value="semaforo">Semáforo averiado</option>
                    <option value="senal_caida">Señal caída o dañada</option>
                    <option value="obras">Obras en la vía</option>
                    <option value="bloqueo">Bloqueo vial</option>
                    <option value="accidente">Colisión vehicular</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Severidad
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Riesgo inminente)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ubicación exacta o Dirección (Medellín) *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocationForReport}
                    className="text-[11px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Crosshair size={11} />
                    <span>Usar mi GPS actual</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. El Poblado con Calle 10 o Carrera 70 con San Juan, Medellín"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detalles y Observaciones
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe la situación en Medellín para que otros conductores y autoridades tomen precauciones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              {/* Photo attachment simulation */}
              <div className="space-y-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={() => setHasAttachedPhoto(true)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera size={14} className="text-[#0052cc] dark:text-sky-400" />
                  <span>{hasAttachedPhoto ? '✓ Fotografía de la vía adjuntada' : 'Adjuntar foto de la vía (Opcional)'}</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin size={13} />
                  <span>Publicar en Google Maps</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
