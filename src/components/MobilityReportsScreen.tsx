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
  Send,
  X,
  ExternalLink,
  Compass,
  Navigation as NavigationIcon,
  Search,
  Check,
  ShieldAlert,
  Car
} from 'lucide-react';
import { COLOMBIAN_ROAD_INCIDENTS } from '../data/mockData';
import { RoadIncident, UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { GoogleMapsRoadView, MEDELLIN_COORDS } from './GoogleMapsRoadView';
import { soundEngine } from '../utils/soundEffects';

interface MobilityReportsScreenProps {
  user: UserProfile | null;
  onBackToDashboard: () => void;
  onNavigateToAuth: (mode: 'login' | 'registro') => void;
  onUpdateUser?: (updated: UserProfile) => void;
}

const INCIDENTS_STORAGE_KEY = 'vianova_road_incidents_medellin';

interface CityOption {
  name: string;
  department: string;
  coords: { lat: number; lng: number };
  zoom: number;
}

// Metropolitan Medellín & Antioquia zones
const COLOMBIAN_CITIES: CityOption[] = [
  { name: 'Medellín', department: 'Antioquia', coords: { lat: 6.2476, lng: -75.5658 }, zoom: 14 },
  { name: 'El Poblado', department: 'Medellín', coords: { lat: 6.2089, lng: -75.5684 }, zoom: 15 },
  { name: 'Laureles - Estadio', department: 'Medellín', coords: { lat: 6.2443, lng: -75.5925 }, zoom: 15 },
  { name: 'Envigado', department: 'Antioquia', coords: { lat: 6.1698, lng: -75.5874 }, zoom: 14 },
  { name: 'Itagüí', department: 'Antioquia', coords: { lat: 6.1738, lng: -75.6111 }, zoom: 14 },
  { name: 'Bello', department: 'Antioquia', coords: { lat: 6.3373, lng: -75.5579 }, zoom: 14 },
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
  const [customReportCoords, setCustomReportCoords] = useState<{ lat: number; lng: number } | null>(null);

  const activeIncident = incidents.find(inc => inc.id === activeIncidentId);

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
    soundEngine.playSuccess();
  };

  const handleOpenReportWithCoords = (coords: { lat: number; lng: number; addressHint?: string }) => {
    setCustomReportCoords(coords);
    setLocation(coords.addressHint || `Punto GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) - Medellín, Antioquia`);
    setShowNewModal(true);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const author = user ? `${user.name}` : 'Ciudadano en Vía (Medellín)';

    const newReport: RoadIncident = {
      id: `inc-med-${Date.now()}`,
      title: title.trim(),
      category,
      location: location.trim(),
      city: selectedCity.name,
      lat: customReportCoords ? customReportCoords.lat : (selectedCity.coords.lat + (Math.random() - 0.5) * 0.03),
      lng: customReportCoords ? customReportCoords.lng : (selectedCity.coords.lng + (Math.random() - 0.5) * 0.03),
      description: description.trim() || 'Reporte de incidencia vial registrado en Google Maps Medellín, Antioquia.',
      severity,
      status: 'reportado',
      reportedAt: 'Hace un momento',
      authorName: author,
      upvotes: 1
    };

    const nextList = [newReport, ...incidents];
    saveIncidents(nextList);
    setActiveIncidentId(newReport.id);
    soundEngine.playSuccess();

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
    setCustomReportCoords(null);
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
          {/* City / Metropolitan Zone Selector Tabs */}
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
                    soundEngine.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            id="btn-nuevo-reporte-modal"
            onClick={() => {
              setCustomReportCoords(null);
              setShowNewModal(true);
              soundEngine.playClick();
            }}
            className="bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* Hero Header with Google Maps & Medellín Branding */}
      <div className="bg-gradient-to-r from-[#0a2540] via-[#0052cc] to-[#0a192f] rounded-3xl p-6 text-white shadow-md space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={13} className="text-amber-400" />
              <span>GOOGLE MAPS • MEDELLÍN & ANTIOQUIA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Reportes en Vía en Vivo • Medellín, Antioquia
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
              Geolocalización en tiempo real conforme a tu ubicación exacta y zonas aledañas. Monitorea y reporta baches, semáforos averiados, señales caídas y obras viales en el Valle de Aburrá.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Medellín, Antioquia, Colombia')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Abrir en Google Maps</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Google Maps View (Left 7 Cols) + Incidents List (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Real Google Maps View with Geolocation & Sector Controls */}
        <div className="lg:col-span-7 space-y-4">
          <GoogleMapsRoadView
            incidents={filteredIncidents}
            activeIncidentId={activeIncidentId}
            onSelectIncident={(id) => setActiveIncidentId(id)}
            onOpenReportModalWithCoords={handleOpenReportWithCoords}
            onUpvoteIncident={handleUpvote}
          />
        </div>

        {/* Right 5 Columns: Community Incidents List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>Incidencias en Medellín ({filteredIncidents.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Toca para centrar en Google Maps</span>
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
                  onClick={() => {
                    setFilterCategory(cat.id);
                    soundEngine.playClick();
                  }}
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

          {/* Incidents Scrollable List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Sin reportes activos en esta categoría
                </h4>
                <p className="text-xs text-slate-500">
                  La red vial de Medellín en este filtro se encuentra sin novedades.
                </p>
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                const isSelected = activeIncidentId === inc.id;

                let categoryLabel = 'Hueco / Bache';
                let categoryColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                if (inc.category === 'semaforo') {
                  categoryLabel = 'Semáforo fuera de servicio';
                  categoryColor = 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
                } else if (inc.category === 'senal_caida') {
                  categoryLabel = 'Señal caída o rota';
                  categoryColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
                } else if (inc.category === 'obras') {
                  categoryLabel = 'Obras y mantenimiento';
                  categoryColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
                }

                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setActiveIncidentId(inc.id);
                      soundEngine.playClick();
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#0052cc] dark:border-sky-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${categoryColor}`}>
                        {categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                        <Clock size={11} />
                        <span>{inc.reportedAt}</span>
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {inc.title}
                    </h4>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <MapPin size={12} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
                      <span className="truncate">{inc.location}</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        Por: <strong className="text-slate-600 dark:text-slate-300 font-medium">{inc.authorName}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(inc.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                            upvotedIds[inc.id]
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          <span>{inc.upvotes}</span>
                        </button>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inc.location + ', Medellín, Antioquia')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                          title="Cómo llegar con Google Maps"
                        >
                          <NavigationIcon size={11} />
                          <span className="hidden xs:inline">Ruta</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL DE NUEVO REPORTE ================= */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-black flex items-center gap-2">
                <PlusCircle size={18} className="text-[#0052cc] dark:text-sky-400" />
                <span>Nuevo Reporte en Google Maps • Medellín</span>
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
                  Ubicación exacta o Dirección (Medellín / Valle de Aburrá) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. El Poblado con Calle 10 o Calle San Juan con Cra 65"
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
                  placeholder="Describe la situación para que otros conductores y autoridades en Medellín tomen precauciones..."
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
                  className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
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
