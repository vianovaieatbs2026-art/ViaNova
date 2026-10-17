import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  BookOpen, 
  SlidersHorizontal, 
  HelpCircle, 
  FileCheck2, 
  Sparkles, 
  ChevronRight, 
  User,
  UserPlus, 
  LogIn, 
  AlertTriangle, 
  Scale, 
  Search, 
  Globe,
  Home,
  ExternalLink,
  X,
  RotateCcw,
  Layers,
  Compass,
  Navigation as NavIcon,
  Loader2,
  Landmark,
  Building2
} from 'lucide-react';
import { UserProfile, ScreenId, SearchResultItem } from '../types';
import { ViaNovaLogo } from './ViaNovaLogo';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { searchViaNovaItems } from '../data/searchIndex';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
interface DashboardScreenProps {
  user: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const { 
    themeMode, 
    activeThemeConfig, 
    t 
  } = useThemeLanguage();



  // Search Bar state in Dashboard (opens in small white dropdown, no black screen)
  const [dashboardSearchQuery, setDashboardSearchQuery] = React.useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Popular suggested searches when search is focused/empty
  const popularDashboardItems: SearchResultItem[] = React.useMemo(() => [
    {
      id: 'quick-sr01',
      title: 'SR-01 - Señal de Pare',
      categoryType: 'senales',
      categoryLabel: 'Señal Reglamentaria',
      subtitle: 'Detención obligatoria total del vehículo en intersección',
      targetScreen: 'senales',
      description: 'Detención obligatoria',
      tags: ['sr-01', 'pare']
    },
    {
      id: 'quick-sim',
      title: 'Simulador de Examen Oficial',
      categoryType: 'evaluacion',
      categoryLabel: 'Simulador Licencias',
      subtitle: 'Prueba teórica de 30 preguntas con temporizador',
      targetScreen: 'simulador',
      description: 'Simulador oficial',
      tags: ['simulador', 'examen']
    },
    {
      id: 'quick-quiz',
      title: 'Quiz de Conocimiento Vial',
      categoryType: 'evaluacion',
      categoryLabel: 'Evaluación Rápida',
      subtitle: 'Practica preguntas clave sobre normas y señalización',
      targetScreen: 'quiz',
      description: 'Quiz interactivo',
      tags: ['quiz']
    },
    {
      id: 'quick-ley2251',
      title: 'Límites de Velocidad (Ley 2251)',
      categoryType: 'educacion',
      categoryLabel: 'Educación Vial',
      subtitle: 'Ley Julián Esteban: 50 km/h urbanas y 30 km/h residenciales',
      targetScreen: 'educacion_vial',
      description: 'Ley Julián Esteban',
      tags: ['velocidad', 'ley 2251']
    },
    {
      id: 'quick-mapa',
      title: 'Reportes y Tráfico en Vivo (Google Maps)',
      categoryType: 'reportes',
      categoryLabel: 'Google Maps',
      subtitle: 'Monitoreo de tráfico, vías e incidencias ciudadanas',
      targetScreen: 'reportes',
      description: 'Mapa de tráfico en tiempo real y reportes viales',
      tags: ['mapa', 'medellin', 'reportes']
    }
  ], []);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!dashboardSearchQuery.trim()) return popularDashboardItems;
    return searchViaNovaItems(dashboardSearchQuery, 'todos').slice(0, 6);
  }, [dashboardSearchQuery, popularDashboardItems]);

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setIsSearchDropdownOpen(false);
    setDashboardSearchQuery('');
    if (item.targetScreen) {
      onNavigate(item.targetScreen);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-fade-in">
      {/* ===================== HERO / WELCOME BANNER ===================== */}
      {user ? (
        <div className="space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-[#0052cc] dark:text-sky-400 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#0052cc] dark:bg-sky-400"></span>
            <span>{t('landing_badge', 'MOVILIDAD INTELIGENTE PARA TU CIUDAD')}</span>
          </div>

          {/* Greeting & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
                {t('dash_hello', '¡Hola,')} {user.name}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#475569] dark:text-slate-400 font-medium mt-1">
                <div className="w-5 h-4 rounded border border-blue-500/80 flex items-center justify-center text-[10px] text-[#0052cc] dark:text-sky-400 font-bold">
                  ID
                </div>
                <span>{user.licenseCategory || t('dash_aspirant', 'Aspirante a Licencia Tipo B')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Guest / Unauthenticated Hero Welcome */
        <div className="bg-gradient-to-br from-white dark:from-slate-900 via-[#f8fafc] dark:via-slate-900 to-[#eff6ff] dark:to-slate-800 rounded-3xl p-6 sm:p-10 border border-[#e2e8f0] dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border"
              style={{ 
                backgroundColor: activeThemeConfig.bgLightHex, 
                color: activeThemeConfig.primaryHex,
                borderColor: activeThemeConfig.borderLightHex 
              }}
            >
              <Scale size={14} />
              Educación y Seguridad Vial en Colombia (Leyes 769 & 2251)
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight leading-tight">
              Movilidad Inteligente para <span style={{ color: activeThemeConfig.primaryHex }}>tu Ciudad</span>
            </h1>

            <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
              Plataforma integral para aprender señales de tránsito colombianas, realizar simulacros de examen teórico para licencias de conducción (A2, B1, C1), practicar quizzes y reportar el estado de las vías en tiempo real.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('registro')}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: activeThemeConfig.primaryHex }}
              >
                <UserPlus size={16} />
                <span>{t('nav_register', 'Crear Cuenta Gratis')}</span>
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 hover:bg-[#f8fafc] text-[#334155] dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <LogIn size={16} />
                <span>{t('nav_login', 'Iniciar Sesión')}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 flex justify-center">
            <ViaNovaLogo size="xl" showText={false} />
          </div>
        </div>
      )}

      {/* ===================== FAST SEARCH SEARCHBAR WITH WHITE DROPDOWN ===================== */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-xs hover:border-[#0052cc] dark:hover:border-sky-500 transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ 
                  backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                  color: activeThemeConfig.primaryHex 
                }}
              >
                <Search size={20} />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  id="dashboard-search-input"
                  value={dashboardSearchQuery}
                  onChange={(e) => {
                    setDashboardSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  onClick={() => setIsSearchDropdownOpen(true)}
                  placeholder={t('search_prompt', '¿Qué deseas buscar hoy en ViaNova? (Señales, leyes, quiz, simulador...)')}
                  className="w-full py-2 pr-8 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                {dashboardSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setDashboardSearchQuery('');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setIsSearchDropdownOpen(prev => !prev)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0047b3] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>{t('search_open_finder', 'Buscar')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Resultados al escribir: absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl z-50 */}
          {/* SIN ningún fondo negro detrás, SIN fixed, SIN inset-0, SIN backdrop */}
          {isSearchDropdownOpen && dashboardSearchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white text-slate-800 rounded-xl shadow-2xl z-50 border border-slate-200 overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 px-4">
                <span>Resultados encontrados ({searchResults.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Selecciona una opción para navegar
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="py-1 max-h-[320px] overflow-y-auto">
                  {searchResults.map((item, idx) => {
                    const isSignal = item?.categoryType === 'senales';
                    const signCodeMatch = item?.title ? item.title.match(/^[A-Z]{2}-\d{2}/i) : null;

                    return (
                      <button
                        key={item?.id || idx}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer text-xs border-b border-slate-50 last:border-0 hover:bg-blue-50/70"
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSignal && signCodeMatch && signCodeMatch[0] ? (
                            <div className="w-6 h-6 flex items-center justify-center">
                              <TrafficSignGraphic 
                                signCode={signCodeMatch[0].toUpperCase()}
                                size="xs"
                                showCodeBadge={false}
                              />
                            </div>
                          ) : item?.categoryType === 'senales' ? (
                            <SlidersHorizontal size={16} className="text-amber-500" />
                          ) : item?.categoryType === 'evaluacion' ? (
                            <FileCheck2 size={16} className="text-blue-500" />
                          ) : item?.categoryType === 'educacion' ? (
                            <BookOpen size={16} className="text-emerald-500" />
                          ) : item?.categoryType === 'reportes' ? (
                            <MapPin size={16} className="text-rose-500" />
                          ) : (
                            <Sparkles size={16} className="text-indigo-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate text-sm text-slate-900">
                              {item?.title || 'Contenido'}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {item?.categoryLabel || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item?.subtitle || item?.description || ''}
                          </p>
                        </div>

                        <ArrowRight size={14} className="text-slate-300 mt-1 shrink-0" />
                      </button>
                    );
                  })}

                  <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs px-4">
                    <span className="text-slate-400 text-[11px]">¿Deseas una búsqueda exhaustiva?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchDropdownOpen(false);
                        onNavigate('busqueda');
                      }}
                      className="text-[#0052cc] font-bold hover:underline inline-flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <span>Abrir centro de búsqueda completo</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">No encontramos resultados directos para "{dashboardSearchQuery}"</p>
                  <p className="text-slate-400 mt-1">Prueba buscando "SR-01", "Pare", "Simulador", "Quiz" o "Velocidad"</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchDropdownOpen(false);
                      onNavigate('busqueda');
                    }}
                    className="mt-3 px-4 py-2 bg-[#0052cc] text-white rounded-xl font-bold hover:bg-[#0047b3] cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Buscar en toda la plataforma</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};
