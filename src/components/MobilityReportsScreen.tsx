import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  AlertTriangle, 
  MapPin, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Camera, 
  Send,
  X,
  ExternalLink,
  Compass,
  Navigation as NavigationIcon,
  Layers,
  Search,
  Check,
  ShieldAlert,
  Car
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

const COLOMBIAN_CITIES: CityOption[] = [
  { name: 'Bogotá D.C.', department: 'Cundinamarca', coords: { lat: 4.64828, lng: -74.0684 }, zoom: 13 },
  { name: 'Medellín', department: 'Antioquia', coords: { lat: 6.25184, lng: -75.5898 }, zoom: 13 },
  { name: 'Cali', department: 'Valle del Cauca', coords: { lat: 3.4352, lng: -76.5411 }, zoom: 13 },
  { name: 'Barranquilla', department: 'Atlántico', coords: { lat: 11.0041, lng: -74.8070 }, zoom: 13 },
  { name: 'Bucaramanga', department: 'Santander', coords: { lat: 7.1193, lng: -73.1227 }, zoom: 13 },
  { name: 'Cartagena', department: 'Bolívar', coords: { lat: 10.3910, lng: -75.4794 }, zoom: 13 },
];

export const MobilityReportsScreen: React.FC<MobilityReportsScreenProps> = ({ 
  user, 
  onBackToDashboard,
  onNavigateToAuth: _onNavigateToAuth,
  onUpdateUser
}) => {
  const { t } = useThemeLanguage();
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

  const [selectedCity, setSelectedCity] = useState<CityOption>(COLOMBIAN_CITIES[0]);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(incidents[0]?.id || null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'traffic'>('traffic');
  const [customSearchLocation, setCustomSearchLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [upvotedIds, setUpvotedIds] = useState<{ [id: string]: boolean }>({});
  
  // New Report Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoadIncident['category']>('bache');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<RoadIncident['severity']>('media');

  const activeIncident = incidents.find(inc => inc.id === activeIncidentId);

  // Foreground location state
  const [submittedSearchLocation, setSubmittedSearchLocation] = useState<string>('');
  const [isForegroundActive, setIsForegroundActive] = useState<boolean>(false);
  const [foregroundNotice, setForegroundNotice] = useState<string | null>(null);

  // Compute map embed URL
  const mapEmbedUrl = React.useMemo(() => {
    let query = `${selectedCity.coords.lat},${selectedCity.coords.lng}`;
    let zoom = selectedCity.zoom;

    if (submittedSearchLocation.trim()) {
      query = encodeURIComponent(`${submittedSearchLocation}, Colombia`);
      zoom = 17; // Close-up foreground zoom (primer plano)
    } else if (customSearchLocation.trim()) {
      query = encodeURIComponent(`${customSearchLocation}, Colombia`);
      zoom = 16;
    } else if (activeIncident) {
      if (activeIncident.lat && activeIncident.lng) {
        query = `${activeIncident.lat},${activeIncident.lng}`;
      } else {
        query = encodeURIComponent(`${activeIncident.location}, ${activeIncident.city}, Colombia`);
      }
      zoom = 17;
    }

    const mapTypeParam = mapType === 'satellite' ? '&t=k' : '';
    return `https://maps.google.com/maps?q=${query}&z=${zoom}${mapTypeParam}&output=embed`;
  }, [selectedCity, activeIncident, customSearchLocation, submittedSearchLocation, mapType]);

  const handleSearchLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSearchLocation.trim();
    if (!query) return;

    setActiveIncidentId(null);
    setSubmittedSearchLocation(query);
    setIsForegroundActive(true);
    setForegroundNotice(`Ubicado en primer plano: ${query}`);

    const mapElement = document.getElementById('mapa-reportes-movilidad');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setForegroundNotice(null);
    }, 4500);
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

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const author = user ? `${user.name}` : 'Ciudadano en Vía (Colombia)';

    const newReport: RoadIncident = {
      id: `inc-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim(),
      city: selectedCity.name,
      lat: selectedCity.coords.lat + (Math.random() - 0.5) * 0.04,
      lng: selectedCity.coords.lng + (Math.random() - 0.5) * 0.04,
      description: description.trim() || 'Reporte de incidencia vial registrado en Google Maps Colombia.',
      severity,
      status: 'reportado',
      reportedAt: 'Hace un momento',
      authorName: author,
      upvotes: 1
    };

    const nextList = [newReport, ...incidents];
    saveIncidents(nextList);
    setActiveIncidentId(newReport.id);
    setCustomSearchLocation('');

    // Reward user points if logged in
    if (user && onUpdateUser) {
      onUpdateUser({
        ...user,
        gamificationPoints: (user.gamificationPoints || 0) + 15
      });
    }

    // Reset modal
    setTitle('');
    setLocation('');
    setDescription('');
    setShowNewModal(false);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterCategory !== 'todos' && inc.category !== filterCategory) return false;
    if (filterStatus !== 'todos' && inc.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in">
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
          {/* City Selector Tabs */}
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
                    setCustomSearchLocation('');
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
            className="bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* Hero Header with Google Maps Branding */}
      <div className="bg-gradient-to-r from-[#0a2540] via-[#0052cc] to-[#0a192f] rounded-3xl p-6 text-white shadow-md space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={13} />
              <span>GOOGLE MAPS & MOVILIDAD COLOMBIA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mapa Interactivo de Incidencias Viales • {selectedCity.name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
              Visualiza en tiempo real baches, semáforos fuera de servicio, señales caídas y obras viales georreferenciadas con Google Maps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCity.name + ' Colombia')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>Abrir Google Maps App</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left/Top) + Incident List (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Google Map Container & Controls */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Map Controls Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {/* Search location form with Buscar button */}
            <form 
              onSubmit={handleSearchLocationSubmit}
              className="flex-1 min-w-[240px] flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar dirección en Google Maps (ej: Calle 72 con Cra 7)..."
                  value={customSearchLocation}
                  onChange={(e) => setCustomSearchLocation(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {customSearchLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSearchLocation('');
                      setSubmittedSearchLocation('');
                      setIsForegroundActive(false);
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
                title="Buscar y ubicar en el mapa en primer plano"
              >
                <Search size={13} />
                <span>Buscar</span>
              </button>
            </form>

            {/* Layer Toggle */}
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
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  mapType === 'satellite' ? 'bg-[#0052cc] text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Satélite
              </button>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div 
            id="mapa-reportes-movilidad"
            className="relative w-full h-[400px] sm:h-[480px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            {/* Foreground notification badge */}
            {foregroundNotice && (
              <div className="absolute top-4 left-4 z-20 bg-[#0052cc] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl border border-blue-400/50 flex items-center gap-2 animate-bounce">
                <MapPin size={13} className="text-amber-300 shrink-0" />
                <span className="truncate max-w-[240px] sm:max-w-md">{foregroundNotice}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                  Primer Plano (17x)
                </span>
              </div>
            )}

            <iframe
              title="Google Maps Colombia Incidents"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Active Incident Overlay Badge */}
            {activeIncident && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-3 animate-fade-in">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                      {activeIncident.category.replace('_', ' ')} • {activeIncident.city}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeIncident.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activeIncident.location}
                  </p>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeIncident.location + ', ' + activeIncident.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <NavigationIcon size={12} />
                  <span>Cómo llegar</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Community Incidents List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Incidencias Reportadas ({filteredIncidents.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Haz clic para centrar en Google Maps</span>
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

          {/* List of Incidents */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredIncidents.map((incident) => {
              const isActive = activeIncidentId === incident.id;
              const hasUpvoted = upvotedIds[incident.id];

              return (
                <div
                  key={incident.id}
                  onClick={() => {
                    setActiveIncidentId(incident.id);
                    setCustomSearchLocation('');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#0052cc] dark:border-sky-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                      {incident.category.replace('_', ' ')}
                    </span>
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
                    <span className="truncate">{incident.location} • {incident.city}</span>
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
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-colors ${
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
                <span>Nuevo Reporte en Google Maps</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  placeholder="Ej: Bache peligroso en carril rápido"
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ubicación exacta o Dirección *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carrera 15 con Calle 85, Chapinero"
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
                  placeholder="Describe la situación para que otros conductores y autoridades tomen precauciones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publicar en Google Maps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
