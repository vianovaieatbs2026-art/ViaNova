import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Clock, 
  Award, 
  MapPin, 
  ArrowRight, 
  BookOpen, 
  SlidersHorizontal, 
  HelpCircle, 
  FileCheck2, 
  TrendingUp, 
  Car, 
  Sparkles, 
  CheckCircle2, 
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
  Building2,
  Gamepad2,
  Film,
  Lightbulb,
  Play,
  Bike,
  FileText,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserProfile, ScreenId, SearchResultItem } from '../types';
import { ViaNovaLogo } from './ViaNovaLogo';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { searchViaNovaItems } from '../data/searchIndex';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { CityRouteSimulator2D } from './CityRouteSimulator2D';
import { MultimediaVideoSection } from './MultimediaVideoSection';

interface DashboardScreenProps {
  user: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate }) => {
  const { 
    themeMode, 
    activeThemeConfig, 
    t,
    language
  } = useThemeLanguage();

  const [aprenderTab, setAprenderTab] = React.useState<'teoria' | 'consejos' | 'decalogo' | 'multimedia'>('teoria');
  const [practicaTab, setPracticaTab] = React.useState<'simulador_2d' | 'examen_runt'>('simulador_2d');
  const [speakingTipId, setSpeakingTipId] = React.useState<number | null>(null);

  const handleSpeakTip = (tipId: number, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingTipId === tipId) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      setSpeakingTipId(null);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingTipId(null);
      utterance.onerror = () => setSpeakingTipId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingTipId(tipId);
    } catch {
      setSpeakingTipId(null);
    }
  };

  const quickAccessChips = [
    {
      id: 'senales',
      label: 'Señales de Tránsito',
      icon: ShieldAlert,
      action: () => {
        onNavigate('senales');
      },
    },
    {
      id: 'consejos',
      label: '3 Consejos Viales',
      icon: Lightbulb,
      action: () => {
        setAprenderTab('consejos');
        document.getElementById('seccion-aprender-inicio')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'aprender',
      label: 'Aprender (Teoría Vial)',
      icon: BookOpen,
      action: () => {
        document.getElementById('seccion-aprender-inicio')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'practica',
      label: 'Práctica (Simulador 2D)',
      icon: Car,
      action: () => {
        document.getElementById('seccion-practica-inicio')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'quiz',
      label: 'Quiz & Juegos Didácticos',
      icon: HelpCircle,
      action: () => {
        onNavigate('quiz');
      },
    },
    {
      id: 'reportes',
      label: 'Reportes en Vía (Mapa)',
      icon: MapPin,
      isLive: true,
      action: () => {
        onNavigate('reportes');
      },
    },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: User,
      action: () => {
        onNavigate('perfil');
      },
    },
  ];

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
      title: 'Mapa de Tráfico y Reportes en Vía',
      categoryType: 'reportes',
      categoryLabel: 'Reportes en Vía',
      subtitle: 'Monitoreo de corredores viales de Medellín en Google Maps',
      targetScreen: 'reportes',
      description: 'Mapa de tráfico en tiempo real Medellín y reportes de movilidad',
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
    if (item.id === 'quick-mapa' || item.title.toLowerCase().includes('mapa')) {
      onNavigate('reportes');
    } else if (item.targetScreen) {
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

          {/* Hero Featured Banner (Sin cuadro de progreso general) */}
          <div className="bg-gradient-to-r from-[#0052cc] via-[#0047b3] to-[#1d4ed8] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Background Globe Watermark */}
            <div className="absolute -right-6 -top-6 opacity-15 pointer-events-none text-white">
              <Globe size={240} />
            </div>

            <div className="space-y-3 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold w-fit">
                <Sparkles size={13} />
                <span>{t('dash_recommended', 'Formación Vial Integral')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t('dash_road_simulator', 'Simulador de Conducción y Aprendizaje Vial')}
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed max-w-xl">
                {t('dash_simulator_pitch', 'Pon a prueba tus conocimientos en un entorno seguro antes del examen práctico y repasa las normas de tránsito de Colombia.')}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                id="dashboard-start-simulation-btn"
                onClick={() => {
                  document.getElementById('seccion-practica-inicio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-5 bg-white text-[#0052cc] hover:bg-blue-50 font-black text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Car size={16} />
                <span>{t('dash_start_sim_btn', 'Ir a Práctica y Simulador')}</span>
                <ArrowRight size={16} />
              </button>
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
                  placeholder={t('search_prompt', '¿Qué deseas consultar hoy en ViaNova? (Señales, leyes, quiz, simulador...)')}
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

      {/* ===================== BARRITA HORIZONTAL CON ACCESOS RÁPIDOS (CHIP PILL) ===================== */}
      <div className="w-full -mt-2">
        <div 
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth"
          role="navigation"
          aria-label="Accesos rápidos"
        >
          {quickAccessChips.map((chip) => {
            const Icon = chip.icon;
            const isLive = chip.isLive;

            return (
              <button
                key={chip.id}
                type="button"
                id={`quick-chip-${chip.id}`}
                onClick={chip.action}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs shrink-0 select-none active:scale-95 border ${
                  isLive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 hover:text-[#0052cc] dark:hover:text-sky-300 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                }`}
              >
                {isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <Icon size={15} className={isLive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0052cc] dark:text-sky-400'} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== 3 KEY METRICS / STATS (If logged in) ===================== */}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider">
                {t('dash_stat_training_hrs', 'Horas de Formación')}
              </span>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                  color: activeThemeConfig.primaryHex 
                }}
              >
                <Clock size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0f172a] dark:text-white">{user.completedHours || 0}</span>
              <span className="text-xs text-[#64748b] dark:text-slate-400">{t('dash_hours_unit', 'horas certificadas')}</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              <span>{t('dash_advancement_modules', 'Avance en módulos viales')}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider">
                {t('dash_stat_approved_exams', 'Exámenes Aprobados')}
              </span>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                  color: activeThemeConfig.primaryHex 
                }}
              >
                <Award size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0f172a] dark:text-white">{user.passedExams || 0}</span>
              <span className="text-xs text-[#64748b] dark:text-slate-400">{t('dash_exams_unit', 'evaluaciones')}</span>
            </div>
            <p 
              className="text-xs mt-2 font-medium flex items-center gap-1"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <CheckCircle2 size={14} />
              <span>{t('dash_norm_colombiana', 'Normativa colombiana')}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider">
                {t('dash_stat_active_reports', 'Reportes Ciudadanos')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <MapPin size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#0f172a] dark:text-white">{user.activeReports}</span>
              <span className="text-xs text-[#64748b] dark:text-slate-400">{t('dash_reports_unit', 'en seguimiento')}</span>
            </div>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-2">
              {t('dash_comunidad_activa', 'Comunidad activa')}
            </p>
          </div>
        </div>
      )}



      {/* ===================== APARTADO APRENDER (DENTRO DE INICIO) ===================== */}
      <section id="seccion-aprender-inicio" className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#0052cc] dark:text-sky-400 text-xs font-bold tracking-wide">
              <BookOpen size={14} />
              <span>APARTADO APRENDER • DENTRO DE INICIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Educación, Leyes y Normativa Vial en Colombia</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Insumos teóricos indispensables antes de realizar simulaciones y evaluaciones: Ley Julián Esteban (50 y 30 km/h), normas de glorietas, protección a ciclistas (1.5 m), cascos reglamentarios y decálogo del conductor.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setAprenderTab('teoria')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                aprenderTab === 'teoria'
                  ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Scale size={14} />
              <span>Normas & Leyes</span>
            </button>
            <button
              type="button"
              onClick={() => setAprenderTab('consejos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                aprenderTab === 'consejos'
                  ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-sky-400 shadow-xs ring-1 ring-amber-400/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lightbulb size={14} className="text-amber-500 shrink-0" />
              <span>3 Consejos Viales</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                Colombia
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAprenderTab('decalogo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                aprenderTab === 'decalogo'
                  ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Decálogo Vial</span>
            </button>
            <button
              type="button"
              onClick={() => setAprenderTab('multimedia')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                aprenderTab === 'multimedia'
                  ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Film size={14} />
              <span>Aula Multimedia</span>
            </button>
          </div>
        </div>

        {/* Banner de acceso rápido: 3 Consejos de Seguridad Vial en Colombia */}
        {aprenderTab !== 'consejos' && (
          <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-emerald-500/10 border border-amber-300 dark:border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl shrink-0 font-black shadow-xs">
                🇨🇴
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    3 Consejos Clave de Seguridad Vial en Colombia
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  1. Regla de 3 segundos en lluvia • 2. Margen de 1.5 m con ciclistas • 3. Prelación en glorietas y cero celular.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAprenderTab('consejos')}
              className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Lightbulb size={14} />
              <span>Ver y Escuchar los 3 Consejos</span>
            </button>
          </div>
        )}

        {/* Tab 1: Normas & Leyes Clave */}
        {aprenderTab === 'teoria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {/* Card 1: Ley Julián Esteban */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                  Ley 2251 de 2022
                </span>
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Ley Julián Esteban • Velocidades
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Establece el límite máximo de <strong>50 km/h</strong> en vías urbanas (reducido desde 60 km/h) y <strong>30 km/h</strong> en zonas escolares, residenciales, hospitales e intersecciones. Salva vidas al duplicar la supervivencia peatonal.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Vigente en toda Colombia</span>
              </div>
            </div>

            {/* Card 2: Adelantamiento a Ciclistas */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Ley 1811 de 2016
                </span>
                <span className="text-xl">🚲</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Adelantamiento a Ciclistas (1.5 m)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Obligatoriedad de mantener una <strong>distancia lateral mínima de 1.50 metros</strong> respecto al ciclista al realizar maniobras de adelantamiento. Los ciclistas tienen derecho a ocupar el centro del carril cuando sea indispensable.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Distancia reglamentaria obligatoria</span>
              </div>
            </div>

            {/* Card 3: Glorietas e Intersecciones */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Art. 70 Ley 769
                </span>
                <span className="text-xl">🔄</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Prelación en Glorietas & Rotondas
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                En glorietas tiene <strong>prelación absoluta</strong> el vehículo que ya se encuentra circulando dentro de la calzada circular frente a quien pretende ingresar. En cruces sin señalizar, tiene paso quien llega por la derecha.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Evita colisiones por ingreso indebido</span>
              </div>
            </div>

            {/* Card 4: Casco Reglamentario */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Res. 23385 de 2020
                </span>
                <span className="text-xl">🪖</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Casco Certificado de Motociclista
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Exige que la cabeza esté totalmente inmersa en el casco con sistema de retención debidamente abrochado. Prohibido portar teléfonos celulares entre la cabeza y el casco. Visor cerrado o uso obligatorio de gafas protectoras.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Certificaciones DOT, ECE 22.05 o NTC 4533</span>
              </div>
            </div>

            {/* Card 5: Prioridad Peatonal */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Art. 63 CNT
                </span>
                <span className="text-xl">🚶</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Prioridad al Peatón en Cebras
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El peatón es el actor primordial en la pirámide de la movilidad. Los vehículos deben detenerse antes de la línea de pare y ceder el paso en cruces peatonales y senderos escolares demarcados.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Cero tolerancia a invasión de cebra</span>
              </div>
            </div>

            {/* Card 6: Distancia de Seguridad y Frenado */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Física Vial
                </span>
                <span className="text-xl">🌧️</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Regla de los 3 Segundos & Lluvia
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mantén mínimo <strong>3 segundos de separación</strong> con el vehículo precedente en asfalto seco. En caso de lluvia o suelo mojado, <strong>duplica a 6 segundos</strong> para compensar la pérdida de fricción y evitar el aquaplaning.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 size={13} />
                <span>Tiempo de reacción + distancia de frenado</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Decálogo del Conductor Seguro */}
        {aprenderTab === 'decalogo' && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#0052cc] dark:text-sky-400" size={24} />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                El Decálogo del Conductor Ejemplar en Colombia
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { n: '1', t: 'Cero alcohol y sustancias psicoactivas', d: 'Conducir bajo efectos de alcohol o drogas acarrea suspensión o cancelación definitiva de licencia e inmovilización.' },
                { n: '2', t: 'Respeto total a la velocidad reglamentaria', d: '50 km/h en ciudad y 30 km/h en zonas escolares residenciales (Ley 2251 Julián Esteban).' },
                { n: '3', t: 'Cinturón en todos los asientos', d: 'Uso obligatorio para conductor y todos los ocupantes del vehículo en vías urbanas y carreteras nacionales.' },
                { n: '4', t: 'Cero manipulación del teléfono móvil', d: 'El uso manual del celular multiplica por 4 el riesgo de siniestro vial grave. Usa manos libres con moderación.' },
                { n: '5', t: 'Luces direccionales anticipadas', d: 'Señaliza tus giros con al menos 30 metros de anticipación en ciudad y 60 metros en carretera.' },
                { n: '6', t: 'Distancia de 1.5 m con ciclistas', d: 'Respeta la vida y espacio del ciclista como actor vulnerable prioritario de la movilidad.' },
                { n: '7', t: 'Prioridad al peatón en cebras y cruces', d: 'Detén el vehículo por completo antes de la línea de pare y no aceleres para presionar el cruce.' },
                { n: '8', t: 'Mantenimiento preventivo riguroso', d: 'Revisa semanalmente presión de llantas, nivel de frenos, luces y equipo de carretera reglamentario.' },
                { n: '9', t: 'Paciencia en embotellamientos', d: 'No uses las bermas, aceras o carriles exclusivos de transporte público para adelantar filas.' },
                { n: '10', t: 'Documentación al día en el RUNT', d: 'Porta siempre licencia vigente, SOAT activo y revisión técnico-mecánica al día.' }
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-black text-xs shrink-0">
                    {item.n}
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white">{item.t}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: 3 Consejos de Seguridad Vial en Colombia */}
        {aprenderTab === 'consejos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl shrink-0 font-black shadow-xs">
                  🇨🇴
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      3 Consejos Clave de Seguridad Vial en Colombia
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      Hábitos Salvavidas
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl">
                    Pautas prioritarias basadas en la realidad geográfica, accidentalidad vial y la legislación colombiana (Ley 769, Ley 1811 y Ley 2251). Puedes escuchar cada consejo con su botón de voz interactivo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Consejo 1 */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-cyan-300 dark:border-cyan-800/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      Consejo 1 • Clima & Montaña
                    </span>
                    <span className="text-2xl">🌧️</span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    La Regla de los 3 Segundos y Distancia en Vía Húmeda
                  </h4>

                  <div className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                    <Scale size={13} />
                    <span>Art. 108 Ley 769 (Código de Tránsito)</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    En Colombia la topografía montañosa (curvas pronunciadas y aguaceros imprevistos en vías como <strong>La Línea, Las Palmas o Bogotá-Medellín</strong>), el agua sobre el asfalto reduce la adherencia de las llantas hasta en un 70%.
                  </p>

                  <div className="p-3 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-cyan-900 dark:text-cyan-200">¿Cómo aplicarlo en la vía?</p>
                    <p>Fija la vista en un poste o señal; cuando el auto de adelante pase por allí, cuenta <strong>"mil uno, mil dos, mil tres"</strong>. Si llueve o hay niebla, <strong>duplica a 6 segundos</strong> para evitar el aquaplaning y choques traseros.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Evita choques por alcance</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeakTip(1, 'Consejo número 1 de seguridad vial en Colombia: La regla de los 3 segundos y la distancia en vía húmeda. Según el artículo 108 del Código Nacional de Tránsito, debes mantener una distancia prudente con el vehículo que te antecede. En carreteras de montaña y con lluvia, cuenta mentalmente tres segundos en piso seco y duplica a seis segundos si el pavimento está mojado para prevenir el hidroplaneo y salvar tu vida.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      speakingTipId === 1
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/60 dark:hover:bg-cyan-800 text-cyan-800 dark:text-cyan-200'
                    }`}
                  >
                    {speakingTipId === 1 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{speakingTipId === 1 ? 'Detener Voz' : 'Escuchar Voz'}</span>
                  </button>
                </div>
              </div>

              {/* Consejo 2 */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-300 dark:border-emerald-800/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Consejo 2 • Actores Vulnerables
                    </span>
                    <span className="text-2xl">🚲</span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    El Margen Sagrado de 1.50 Metros al Adelantar Ciclistas
                  </h4>

                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Scale size={13} />
                    <span>Ley 1811 de 2016 (Ley Pro-Bici) y Ley 2251</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Colombia es potencia mundial de ciclismo y miles de personas usan la bicicleta a diario para trabajar y entrenar en vías como <strong>Las Palmas, Patios, La Calera o vías intermunicipales</strong>. El ciclista carece de carrocería protectora.
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">¿Cómo aplicarlo en la vía?</p>
                    <p>Al rebasar a un ciclista, <strong>reduce a menos de 30 km/h y abre el carro dejando mínimo 1.5 metros de separación</strong>. Jamás toques el pito detrás de él; el susto puede desestabilizarlo y provocar una caída fatal.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Protege al ciclista</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeakTip(2, 'Consejo número 2 de seguridad vial en Colombia: El margen sagrado de 1.50 metros al adelantar ciclistas. Por mandato de la Ley 1811 y la Ley 2251, al rebasar a un ciclista en cualquier vía del país debes disminuir tu velocidad y dejar al menos un metro y medio de separación lateral libre. No uses el pito detrás de ellos; protégelos como actores vulnerables de la vía.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      speakingTipId === 2
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {speakingTipId === 2 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{speakingTipId === 2 ? 'Detener Voz' : 'Escuchar Voz'}</span>
                  </button>
                </div>
              </div>

              {/* Consejo 3 */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-300 dark:border-amber-800/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Consejo 3 • Intersecciones & Foco
                    </span>
                    <span className="text-2xl">🔄</span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                    Prelación en Glorietas y Cero Celular al Volante
                  </h4>

                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <Scale size={13} />
                    <span>Art. 70 Ley 769 y Ley 1696 (Cero Distracción)</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Las glorietas son complejas en ciudades colombianas (como <strong>San Diego, La Aguacatala, El Campín o la Glorieta de la 80</strong>). La regla de oro: quien ya circula por el anillo interno tiene prelación absoluta.
                  </p>

                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-amber-900 dark:text-amber-200">¿Cómo aplicarlo en la vía?</p>
                    <p>Frena antes de ingresar y mira a tu izquierda. Y <strong>cero celular</strong>: responder un mensaje a 50 km/h significa rodar más de 70 metros a ciegas (más de media cuadra). Mantén ambas manos al volante y la mirada en la vía.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Cero accidentes en rotondas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeakTip(3, 'Consejo número 3 de seguridad vial en Colombia: Prelación en glorietas y desconexión total del celular al volante. En todas las rotondas del país, el vehículo que ya circula por el anillo interno tiene prelación absoluta sobre el que va a entrar. Además, queda prohibido manipular el teléfono celular al conducir; responder un mensaje equivale a avanzar setenta metros a ciegas. Pon siempre tu atención al cien por ciento en el camino.')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      speakingTipId === 3
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-200'
                    }`}
                  >
                    {speakingTipId === 3 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{speakingTipId === 3 ? 'Detener Voz' : 'Escuchar Voz'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Aula Multimedia */}
        {aprenderTab === 'multimedia' && (
          <div className="animate-fade-in space-y-4">
            <MultimediaVideoSection />
          </div>
        )}
      </section>

      {/* ===================== APARTADO PRÁCTICA (DENTRO DE INICIO) ===================== */}
      <section id="seccion-practica-inicio" className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
              <Car size={14} />
              <span>APARTADO PRÁCTICA • DENTRO DE INICIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>Simuladores y Entrenamiento de Conducción</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Pon a prueba tus reflejos y valida lo aprendido: conduce en el simulador 2D de ruta urbana en tiempo real y prepárate para el examen oficial RUNT con 30 preguntas cronometradas. Para acceder a los juegos didácticos (sopa de letras, crucigramas y retos), ingresa al apartado Quiz.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setPracticaTab('simulador_2d')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                practicaTab === 'simulador_2d'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Car size={14} />
              <span>Simulador 2D</span>
            </button>
            <button
              type="button"
              onClick={() => setPracticaTab('examen_runt')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                practicaTab === 'examen_runt'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck2 size={14} />
              <span>Simulador Examen RUNT</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-300 dark:border-amber-700/60"
              title="Los juegos didácticos están exclusivamente en el apartado Quiz"
            >
              <Gamepad2 size={14} className="text-amber-600 dark:text-amber-400" />
              <span>Juegos Didácticos (Ver en Quiz) ➔</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Simulador 2D */}
        {practicaTab === 'simulador_2d' && (
          <div className="animate-fade-in space-y-4">
            <CityRouteSimulator2D />
          </div>
        )}

        {/* Tab 2: Simulador Examen RUNT */}
        {practicaTab === 'examen_runt' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-transparent border-2 border-emerald-400/50 dark:border-emerald-500/30 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                  Prueba Oficial Centros de Enseñanza Automovilística (CEA)
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Simulador de Examen Teórico RUNT • Categorías A2, B1 y C1
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  30 preguntas aleatorias oficiales extraídas del banco del Ministerio de Transporte. Tienes 45 minutos para completar la prueba y necesitas al menos el 80% (24 respuestas correctas) para aprobar. Al finalizar recibes tu constancia simulada y desglose por artículos de la Ley 769.
                </p>
              </div>

              <button
                type="button"
                id="btn-iniciar-examen-runt"
                onClick={() => onNavigate('quiz')}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
              >
                <FileCheck2 size={18} />
                <span>INICIAR SIMULACRO DE EXAMEN</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm mb-1">
                  <Check size={16} />
                  <span>30 Preguntas Tipo RUNT</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preguntas de selección múltiple con retroalimentación inmediata legal.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400 font-black text-sm mb-1">
                  <Clock size={16} />
                  <span>45 Minutos de Tiempo</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cronómetro en tiempo real igual al de los exámenes de licencias.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm mb-1">
                  <Award size={16} />
                  <span>80% para Aprobar</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Emisión de constancia digital de aprobación con tu nombre.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== 7 MAIN SYSTEM APARTADOS ===================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-[#0f172a] dark:text-white">
              {t('dash_modules_title', 'Apartados de la Plataforma ViaNova')}
            </h2>
            <p className="text-xs text-[#64748b] dark:text-slate-400">
              {t('dash_modules_sub', 'Accede a las herramientas de educación, evaluación y reporte vial de Colombia.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Educación Vial */}
          <div 
            onClick={() => {
              document.getElementById('seccion-aprender-inicio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <BookOpen size={22} />
                </div>
                <span 
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                  style={{ 
                    backgroundColor: activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex,
                    borderColor: activeThemeConfig.borderLightHex 
                  }}
                >
                  {t('dash_badge_law', 'Fundamentos & Teoría')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-sky-500 transition-colors">
                Aprende: Teoría y Normas Viales
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Insumos teóricos indispensables antes de realizar las actividades y simuladores: Ley Julián Esteban (50/30 km/h), glorietas, cascos y ciclistas a 1.5m.
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>Aprender teoría y normas</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Señales de Tránsito */}
          <div 
            onClick={() => onNavigate('senales')}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <ShieldAlert size={24} />
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                  Apartado Oficial
                </span>
              </div>
              <h3 className="text-base font-black text-[#0f172a] dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors uppercase tracking-tight">
                SEÑALES DE TRÁNSITO
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Aprende las 3 categorías del Manual de Señalización Vial con sus dibujos oficiales: <strong className="text-red-600 dark:text-red-400">1. Reglamentarias</strong> (obligan), <strong className="text-amber-600 dark:text-amber-400">2. Preventivas</strong> (peligro) y <strong className="text-blue-600 dark:text-blue-400">3. Informativas</strong> (información).
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>Ir al Apartado de Señales</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Quiz */}
          <div 
            onClick={() => onNavigate('quiz')}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <HelpCircle size={22} />
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                  Quiz & Juegos Didácticos
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-amber-500 transition-colors">
                {t('nav_quiz', 'Quiz y Juegos Didácticos')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Todos los quizzes oficiales y juegos didácticos interactivos: Sopa de Letras Vial, Crucigrama de Normas, Emparejar Señales, Completar Frases y Reto 10s.
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_take_quiz', 'Ir a Quiz y Juegos Didácticos')}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Simulador Examen y Práctica */}
          <div 
            onClick={() => {
              document.getElementById('seccion-practica-inicio')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <Car size={22} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  Simulador 2D
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-emerald-500 transition-colors">
                Práctica: Simulador de Conducción 2D
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Entrena tus habilidades en tiempo real con el simulador interactivo de rutas urbanas respetando semáforos, pasos peatonales y normas viales.
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>Ir al simulador de conducción</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Google Maps & Reportes en Vía */}
          <div 
            onClick={() => onNavigate('reportes')}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 flex items-center justify-center">
                  <MapPin size={22} />
                </div>
                <span className="text-[10px] font-bold text-[#0052cc] bg-blue-50 dark:bg-blue-950/60 dark:text-sky-300 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900">
                  Apartado Oficial
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-[#0052cc] transition-colors">
                Reportes en Vía y Mapa en Vivo
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Accede al mapa interactivo de Medellín con buscador de direcciones, capa de tráfico en tiempo real y reporte colaborativo de incidencias viales.
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0052cc] dark:text-sky-400"
            >
              <span>Ir a Reportes y Mapa</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Búsqueda y Recursos */}
          <div 
            onClick={() => onNavigate('busqueda')}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <Search size={22} />
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-900">
                  {t('dash_badge_global_search', 'Buscador Global')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-purple-500 transition-colors">
                {t('nav_search', 'Búsqueda & Recursos')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_search_desc', 'Encuentra al instante contenidos sobre educación vial, señales, campañas preventivas y descarga de manuales oficiales.')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_explore_search', 'Explorar buscador')}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 7. Mi Perfil */}
          <div 
            onClick={() => onNavigate('perfil')}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
                    color: activeThemeConfig.primaryHex 
                  }}
                >
                  <Car size={22} />
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-900">
                  {t('dash_badge_digital_credential', 'Credencial Digital')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-sky-500 transition-colors">
                {t('dash_my_profile', 'Mi Perfil & Credencial')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_profile_desc', 'Consulta tu credencial digital de conductor seguro, historial de certificados, exámenes aprobados e insignias.')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_manage_account', 'Ver mi credencial')}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Colombian Daily Road Safety Fact */}
      <div 
        className="rounded-3xl p-5 border flex items-start gap-4 transition-colors"
        style={{ 
          backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : activeThemeConfig.bgLightHex,
          borderColor: activeThemeConfig.borderLightHex 
        }}
      >
        <div 
          className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs"
          style={{ backgroundColor: activeThemeConfig.primaryHex }}
        >
          <Sparkles size={20} />
        </div>
        <div>
          <h4 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: activeThemeConfig.primaryHex }}
          >
            {t('dash_safety_tip_title', 'Consejo de Seguridad Vial en Colombia (Ley 2251 de 2022)')}
          </h4>
          <p className="text-xs sm:text-sm text-[#1e293b] dark:text-slate-200 mt-1 leading-relaxed">
            {t('dash_safety_tip_content', 'Recuerda que en Colombia la velocidad máxima en zonas urbanas es de 50 km/h y en zonas escolares es de 30 km/h. Reducir la velocidad en solo 10 km/h duplica la posibilidad de salvar la vida de un peatón o ciclista ante una colisión.')}
          </p>
        </div>
      </div>
    </div>
  );
};
