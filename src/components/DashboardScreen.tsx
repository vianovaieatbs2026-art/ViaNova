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
  ChevronDown,
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
import { TrafficSignsSections } from './TrafficSignsSections';
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
  const [isTrafficSignsOpen, setIsTrafficSignsOpen] = React.useState(false);
  const [speakingTipId, setSpeakingTipId] = React.useState<number | null>(null);
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

  // Audio speech narration for the 3 road safety tips
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

  // Quick navigation chips
  const quickAccessChips = [
    {
      id: 'senales',
      label: 'Señales de Tránsito',
      icon: ShieldAlert,
      action: () => {
        setIsTrafficSignsOpen(true);
        setTimeout(() => {
          document.getElementById('btn-senales-de-transito')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      },
    },
    {
      id: 'consejos',
      label: '3 Consejos Viales (Ley 2251)',
      icon: Lightbulb,
      action: () => {
        document.getElementById('seccion-consejos-ley2251')?.scrollIntoView({ behavior: 'smooth' });
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
      targetScreen: 'quiz',
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
      targetScreen: 'inicio',
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
      if (item.targetScreen === 'senales') {
        setIsTrafficSignsOpen(true);
      }
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

        {/* Results dropdown */}
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

      {/* ===================== 3 CONSEJOS CLAVE DE SEGURIDAD VIAL EN COLOMBIA (LEY 2251 DE 2022) ===================== */}
      {/* Trasladados desde la sección de educación normativa al lugar del consejo Ley 2251 */}
      <section id="seccion-consejos-ley2251" className="scroll-mt-24 space-y-5 animate-fade-in">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-amber-500/15 via-blue-500/10 to-emerald-500/15 border-2 border-amber-300 dark:border-amber-400/40 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl shrink-0 font-black shadow-xs">
                🇨🇴
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    3 Consejos Clave de Seguridad Vial en Colombia (Ley 2251 de 2022)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-2xs">
                    Hábitos Salvavidas
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl">
                  Pautas prioritarias basadas en la realidad vial de Colombia, la <strong>Ley Julián Esteban (Ley 2251 de 2022)</strong>, la <strong>Ley 1811 de 2016</strong> y el <strong>Código Nacional de Tránsito (Ley 769)</strong>.
                </p>
              </div>
            </div>

            {/* General Speed Reminder Badge according to Ley 2251 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-2xs self-start sm:self-center shrink-0">
              <Sparkles size={16} className="text-amber-500 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-black text-slate-900 dark:text-white block">Límites Ley 2251</span>
                <span className="text-slate-500 dark:text-slate-400">50 km/h ciudad • 30 km/h escolar</span>
              </div>
            </div>
          </div>

          {/* Quick Context / Safety Fact Box */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
            <span className="text-lg shrink-0">⏱️</span>
            <p className="leading-relaxed">
              {t('dash_safety_tip_content', 'Recuerda que en Colombia la velocidad máxima en zonas urbanas es de 50 km/h y en zonas escolares es de 30 km/h. Reducir la velocidad en solo 10 km/h duplica la posibilidad de salvar la vida de un peatón o ciclista ante una colisión.')}
            </p>
          </div>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Consejo 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Consejo 1 • Clima & Montaña
                </span>
                <span className="text-2xl">🌧️</span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Regla de los 3 Segundos y Distancia en Vía Húmeda
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                En carreteras secas cuenta mentalmente tres segundos con el vehículo que te antecede (<strong>"1001, 1002, 1003"</strong>). En lluvia, niebla o descenso de montaña, <strong>duplica a 6 segundos</strong> para compensar la pérdida de fricción y evitar el hidroplaneo.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1">
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
                title="Escuchar locución del consejo"
              >
                {speakingTipId === 1 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{speakingTipId === 1 ? 'Detener Voz' : 'Escuchar Voz'}</span>
              </button>
            </div>
          </div>

          {/* Consejo 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Consejo 2 • Actores Vulnerables
                </span>
                <span className="text-2xl">🚲</span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                El Margen Sagrado de 1.50 m al Adelantar Ciclistas
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Por mandato legal de la <strong>Ley 1811 de 2016</strong> y la <strong>Ley 2251</strong>, al rebasar a un ciclista debes reducir la velocidad y dejar un margen lateral libre de al menos <strong>1.50 metros</strong>. Nunca uses la bocina pegado a ellos.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
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
                title="Escuchar locución del consejo"
              >
                {speakingTipId === 2 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{speakingTipId === 2 ? 'Detener Voz' : 'Escuchar Voz'}</span>
              </button>
            </div>
          </div>

          {/* Consejo 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-200 dark:border-amber-800/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Consejo 3 • Intersecciones & Foco
                </span>
                <span className="text-2xl">🔄</span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Prelación en Glorietas y Desconexión del Celular
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                En rotondas tiene <strong>prelación absoluta</strong> el vehículo que ya circula dentro de la calzada circular (Art. 70 CNT). Además, queda estrictamente prohibido manipular el celular al volante; desviar la mirada 4 segundos equivale a avanzar <strong>70 metros a ciegas</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Cero siniestros en glorietas</span>
              </span>
              <button
                type="button"
                onClick={() => handleSpeakTip(3, 'Consejo número 3 de seguridad vial en Colombia: Prelación en glorietas y desconexión total del celular al volante. En todas las rotondas del país, el vehículo que ya circula por el anillo interno tiene prelación absoluta sobre el que va a entrar. Además, queda prohibido manipular el teléfono celular al conducir; responder un mensaje equivale a avanzar setenta metros a ciegas. Pon siempre tu atención al cien por ciento en el camino.')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  speakingTipId === 3
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-200'
                }`}
                title="Escuchar locución del consejo"
              >
                {speakingTipId === 3 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{speakingTipId === 3 ? 'Detener Voz' : 'Escuchar Voz'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BOTÓN OFICIAL: SEÑALES DE TRÁNSITO ===================== */}
      <div className="w-full space-y-4">
        {/* Banner with the official button: "SEÑALES DE TRÁNSITO" */}
        <div className="bg-gradient-to-r from-[#003d99] via-[#0052cc] to-[#0284c7] text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-extrabold uppercase tracking-wide">
              <Scale size={13} />
              <span>Manual Oficial de Señalización Vial de Colombia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              SEÑALES DE TRÁNSITO
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Descubre las 3 categorías oficiales: <strong>1. Reglamentarias</strong> (obligan), <strong>2. Preventivas</strong> (peligro) y <strong>3. Informativas</strong> (información) con sus dibujos oficiales y descripciones normativas.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
            <button
              type="button"
              id="btn-senales-de-transito"
              onClick={() => setIsTrafficSignsOpen(prev => !prev)}
              className="px-6 py-3.5 rounded-2xl bg-white text-[#0052cc] hover:bg-blue-50 active:scale-98 font-black text-sm transition-all shadow-md flex items-center gap-2.5 cursor-pointer"
            >
              <TrafficSignGraphic signType="sr-01 pare" size="xs" showCodeBadge={false} />
              <span>{isTrafficSignsOpen ? 'Ocultar Señales' : 'SEÑALES DE TRÁNSITO'}</span>
              <ChevronDown className={`transition-transform duration-300 ${isTrafficSignsOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('senales')}
              className="px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-98 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Abrir en pantalla completa"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Ver Completo</span>
            </button>
          </div>

          {/* Decorative background cues */}
          <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none select-none flex items-center gap-4">
            <div className="w-28 h-28 rounded-full border-8 border-white flex items-center justify-center font-black text-3xl">
              PARE
            </div>
          </div>
        </div>

        {/* When clicked, opens the 3 sections right here on the dashboard */}
        {isTrafficSignsOpen && (
          <div className="animate-fade-in pt-2">
            <TrafficSignsSections initialSectionId="todas" showFlashcardToggle={true} />
          </div>
        )}
      </div>
    </div>
  );
};
