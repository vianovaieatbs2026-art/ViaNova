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
  Check
} from 'lucide-react';
import { UserProfile, ScreenId, SearchResultItem } from '../types';
import { ViaNovaLogo } from './ViaNovaLogo';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { TrafficSignsScreen } from './TrafficSignsScreen';
import { searchViaNovaItems } from '../data/searchIndex';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getUserDashboardProgress } from '../utils/userProgress';
import { CityRouteSimulator2D } from './CityRouteSimulator2D';
import { GoogleMapsLive } from './GoogleMapsLive';
import { MultimediaVideoSection } from './MultimediaVideoSection';

interface CorridorItem {
  id: string;
  name: string;
  query: string;
  zoom: number;
  highlight: string;
}

export const MEDELLIN_CORRIDORS: CorridorItem[] = [
  {
    id: 'autopista-sur',
    name: 'Autopista Sur',
    query: 'Autopista Sur, Medellín, Antioquia, Colombia',
    zoom: 15,
    highlight: 'Acceso Sur, Envigado e Itagüí'
  },
  {
    id: 'av-regional',
    name: 'Av. Regional',
    query: 'Avenida Regional, Medellín, Antioquia, Colombia',
    zoom: 15,
    highlight: 'Eje del Río Medellín Norte-Sur'
  },
  {
    id: 'av-las-vegas',
    name: 'Av. Las Vegas',
    query: 'Avenida Las Vegas, Medellín, Antioquia, Colombia',
    zoom: 15,
    highlight: 'Poblado, Ciudad del Río y Envigado'
  },
  {
    id: 'av-el-poblado',
    name: 'Av. El Poblado',
    query: 'Avenida El Poblado, Medellín, Antioquia, Colombia',
    zoom: 15,
    highlight: 'Milla de Oro y Parque Lleras'
  },
  {
    id: 'av-oriental',
    name: 'Av. Oriental',
    query: 'Avenida Oriental, Medellín, Antioquia, Colombia',
    zoom: 16,
    highlight: 'Centro neurálgico de Medellín'
  },
  {
    id: 'av-80-san-juan',
    name: 'Av. 80 / San Juan',
    query: 'Avenida 80 con Calle San Juan, Medellín, Antioquia, Colombia',
    zoom: 16,
    highlight: 'Corredor Occidente Laureles-La América'
  }
];

export interface WorldLocationItem {
  id: string;
  name: string;
  detail: string;
  query: string;
  zoom: number;
  country?: string;
  category?: 'monument' | 'city' | 'street' | 'corridor' | 'place';
}

export const WORLD_FAMOUS_LOCATIONS: WorldLocationItem[] = [
  { id: 'w-eiffel', name: 'Torre Eiffel', detail: 'París, Francia', query: 'Tour Eiffel, Paris, France', zoom: 16, country: 'Francia', category: 'monument' },
  { id: 'w-times', name: 'Times Square', detail: 'Manhattan, Nueva York, EE. UU.', query: 'Times Square, New York, USA', zoom: 16, country: 'EE. UU.', category: 'monument' },
  { id: 'w-madrid', name: 'Gran Vía y Plaza Mayor', detail: 'Madrid, España', query: 'Gran Vía, Madrid, España', zoom: 15, country: 'España', category: 'city' },
  { id: 'w-tokyo', name: 'Cruce de Shibuya', detail: 'Tokio, Japón', query: 'Shibuya Crossing, Tokyo, Japan', zoom: 16, country: 'Japón', category: 'monument' },
  { id: 'w-roma', name: 'Coliseo Romano', detail: 'Roma, Italia', query: 'Colosseo, Roma, Italia', zoom: 16, country: 'Italia', category: 'monument' },
  { id: 'w-londres', name: 'Big Ben y Westminster', detail: 'Londres, Reino Unido', query: 'Big Ben, London, UK', zoom: 16, country: 'Reino Unido', category: 'monument' },
  { id: 'w-buenosaires', name: 'Obelisco de Buenos Aires', detail: 'Av. 9 de Julio, Buenos Aires, Argentina', query: 'Obelisco, Buenos Aires, Argentina', zoom: 16, country: 'Argentina', category: 'city' },
  { id: 'w-cdmx', name: 'Zócalo Capitalino', detail: 'Ciudad de México, México', query: 'Zócalo, Ciudad de México, México', zoom: 16, country: 'México', category: 'city' },
  { id: 'w-sydney', name: 'Ópera de Sídney', detail: 'Sídney, Australia', query: 'Sydney Opera House, Sydney, Australia', zoom: 16, country: 'Australia', category: 'monument' },
  { id: 'w-rio', name: 'Cristo Redentor', detail: 'Río de Janeiro, Brasil', query: 'Cristo Redentor, Rio de Janeiro, Brasil', zoom: 16, country: 'Brasil', category: 'monument' },
  { id: 'w-berlin', name: 'Puerta de Brandeburgo', detail: 'Berlín, Alemania', query: 'Brandenburger Tor, Berlin, Germany', zoom: 16, country: 'Alemania', category: 'monument' },
  { id: 'w-cairo', name: 'Pirámides de Guiza', detail: 'El Cairo, Egipto', query: 'Giza Necropolis, Cairo, Egypt', zoom: 15, country: 'Egipto', category: 'monument' }
];

export const COLOMBIA_HIGHLIGHTS: WorldLocationItem[] = [
  { id: 'co-botero', name: 'Plaza Botero / Centro', detail: 'Medellín, Antioquia', query: 'Plaza Botero, Medellín, Colombia', zoom: 17, country: 'Colombia', category: 'monument' },
  { id: 'co-poblado', name: 'Parque Lleras / El Poblado', detail: 'Medellín, Antioquia', query: 'Parque Lleras, Medellín, Colombia', zoom: 16, country: 'Colombia', category: 'corridor' },
  { id: 'co-sur', name: 'Autopista Sur (Itagüí - Medellín)', detail: 'Corredor vial metropolitano', query: 'Autopista Sur, Medellín, Colombia', zoom: 15, country: 'Colombia', category: 'corridor' },
  { id: 'co-regional', name: 'Avenida Regional (Eje del Río)', detail: 'Corredor Norte - Sur', query: 'Avenida Regional, Medellín, Colombia', zoom: 15, country: 'Colombia', category: 'corridor' },
  { id: 'co-nutibara', name: 'Cerro Nutibara / Pueblito Paisa', detail: 'Medellín, Antioquia', query: 'Cerro Nutibara, Medellín, Colombia', zoom: 16, country: 'Colombia', category: 'monument' },
  { id: 'co-cartagena', name: 'Ciudad Amurallada', detail: 'Cartagena de Indias, Bolívar', query: 'Ciudad Amurallada, Cartagena, Colombia', zoom: 16, country: 'Colombia', category: 'city' },
  { id: 'co-cali', name: 'San Antonio y Cristo Rey', detail: 'Cali, Valle del Cauca', query: 'Barrio San Antonio, Cali, Colombia', zoom: 15, country: 'Colombia', category: 'city' },
  { id: 'co-oriente', name: 'Túnel de Oriente', detail: 'Conexión Valle de Aburrá - Aeropuerto JMC', query: 'Túnel de Oriente, Medellín, Colombia', zoom: 14, country: 'Colombia', category: 'corridor' }
];

interface DashboardScreenProps {
  user: UserProfile | null;
  onNavigate: (screen: ScreenId) => void;
  initialShowSigns?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate, initialShowSigns }) => {
  const { 
    themeMode, 
    activeThemeConfig, 
    t,
    language
  } = useThemeLanguage();

  const [showSignsSection, setShowSignsSection] = React.useState<boolean>(initialShowSigns || false);
  const [aprenderTab, setAprenderTab] = React.useState<'teoria' | 'decalogo' | 'multimedia'>('teoria');
  const [practicaTab, setPracticaTab] = React.useState<'simulador_2d' | 'examen_runt'>('simulador_2d');

  React.useEffect(() => {
    if (initialShowSigns) {
      setShowSignsSection(true);
      setTimeout(() => {
        document.getElementById('seccion-senales-transito')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [initialShowSigns]);

  const progress = getUserDashboardProgress(user);

  const quickAccessChips = [
    {
      id: 'senales',
      label: 'Señales de Tránsito',
      icon: ShieldAlert,
      action: () => {
        setShowSignsSection(true);
        setTimeout(() => {
          document.getElementById('seccion-senales-transito')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
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
      id: 'mapa-en-vivo',
      label: 'Mapa en Vivo',
      icon: MapPin,
      isLive: true,
      action: () => {
        const target = document.getElementById('mapa-en-vivo-medellin');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
      title: 'mapa en vivo - Medellín',
      categoryType: 'reportes',
      categoryLabel: 'Tráfico en Vivo',
      subtitle: 'Monitoreo de corredores viales de Medellín en Google Maps',
      targetScreen: 'inicio',
      description: 'Mapa de tráfico en tiempo real Medellín',
      tags: ['mapa', 'medellin']
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
    if (item.id === 'quick-mapa') {
      const target = document.getElementById('mapa-en-vivo-medellin');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

          {/* Two Hero Cards in One Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Progreso General (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 transition-colors">
              <div>
                <h2 className="text-xl font-black text-[#0f172a] dark:text-white">
                  {t('dash_general_progress', 'Progreso General')}
                </h2>
                <p className="text-sm text-[#475569] dark:text-slate-400 mt-1">
                  {progress.hasProgress
                    ? t('dash_progress_sub', 'Estás a un paso de dominar la teoría de conducción. ¡Sigue así!')
                    : t('dash_progress_no_progress', '¡Bienvenido! Aún no has completado ningún módulo, empieza por el Módulo 1')
                  }
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600 dark:text-slate-300">
                    {t('dash_total_progress', 'Avance total')}
                  </span>
                  <span className="text-[#0052cc] dark:text-sky-400 text-lg font-black">
                    {progress.totalProgress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0052cc] dark:bg-sky-500 rounded-full transition-all duration-700" 
                    style={{ width: `${progress.totalProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <span className="text-2xl font-black text-[#0f172a] dark:text-white block">
                    {progress.completedModulesCount}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('dash_modules_completed', 'Módulos Completados')}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-[#0f172a] dark:text-white block">
                    {progress.quizAverage}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('dash_quizzes_avg', 'Promedio Quizzes')}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-[#0f172a] dark:text-white block">
                    {progress.badgesCount}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('dash_badges_earned', 'Insignias Obtenidas')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Simulador Vial (5 cols) */}
            <div className="lg:col-span-5 bg-[#0052cc] dark:bg-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
              {/* Background Globe Watermark */}
              <div className="absolute -right-6 -top-6 opacity-20 pointer-events-none text-white">
                <Globe size={220} />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold w-fit">
                  <Sparkles size={13} />
                  <span>{t('dash_recommended', 'Recomendado')}</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {t('dash_road_simulator', 'Simulador Vial')}
                </h2>
                <p className="text-sm text-blue-100 leading-relaxed max-w-sm">
                  {t('dash_simulator_pitch', 'Pon a prueba tus conocimientos en un entorno seguro antes del examen práctico.')}
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  type="button"
                  id="dashboard-start-simulation-btn"
                  onClick={() => {
                    document.getElementById('seccion-practica-inicio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-4 bg-white/95 hover:bg-white text-[#0052cc] font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{t('dash_start_sim_btn', 'Ir a Práctica y Simulador')}</span>
                  <ArrowRight size={16} />
                </button>
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
              <span className="text-2xl font-black text-[#0f172a] dark:text-white">{progress.completedModulesCount || user.completedHours || 0}</span>
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

      {/* ===================== MAPA EN VIVO - MEDELLÍN (ALWAYS VISIBLE GOOGLE MAPS) ===================== */}
      <section 
        id="mapa-en-vivo-medellin" 
        className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t('dash_traffic_badge', 'TRÁFICO EN TIEMPO REAL • GOOGLE MAPS')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2.5">
              <MapPin className="text-rose-500 shrink-0" size={28} />
              <span>{t('dash_map_title', 'Mapa en Vivo - Medellín')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 max-w-2xl">
              {t('dash_map_sub', 'Monitoreo del tráfico y estado de vías en tiempo real para Medellín y el Valle de Aburrá (Av. Regional, Autopista Sur, Las Vegas, Av. Oriental, Av. 80 y San Juan).')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={language === 'en' ? 'https://www.google.com/maps/@6.25184,-75.5898,13z/data=!5m1!1e1?hl=en' : 'https://www.google.com/maps/@6.25184,-75.5898,13z/data=!5m1!1e1?hl=es'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>{t('dash_open_gmaps', 'Abrir en Google Maps')}</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={() => onNavigate('reportes')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0047b3] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <AlertTriangle size={13} />
              <span>{t('dash_incident_reports_btn', 'Reportes de Incidencias')}</span>
            </button>
          </div>
        </div>


        {/* Official Google Maps Platform Live Component */}
        <GoogleMapsLive 
          initialCenter={{ lat: 6.2476, lng: -75.5658 }}
          initialZoom={14}
          heightClass="h-[520px] sm:h-[600px]"
          showSurroundingSelector={true}
          showSearchBar={true}
        />
      </section>

      {/* ===================== APARTADO DE SEÑALES DE TRÁNSITO (DENTRO DE INICIO) ===================== */}
      <section id="seccion-senales-transito" className="scroll-mt-24 space-y-4">
        {!showSignsSection ? (
          /* Botón grande y llamativo: SEÑALES DE TRÁNSITO */
          <div className="bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-red-500/15 border-2 border-amber-400 dark:border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:border-amber-500 hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-3xl shadow-md shrink-0">
                🚦
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    SEÑALES DE TRÁNSITO
                  </h2>
                  <span className="text-[11px] font-black uppercase px-3 py-0.5 rounded-full bg-red-600 text-white shadow-xs">
                    3 Secciones Oficiales
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold max-w-2xl leading-relaxed">
                  Haz clic en el botón para abrir las 3 secciones oficiales: <strong className="text-red-600 dark:text-red-400">1. Reglamentarias</strong> (circulares, fondo blanco y borde rojo • Son las que obligan), <strong className="text-amber-600 dark:text-amber-400">2. Preventivas</strong> (diamante amarillo • Avisan peligro) y <strong className="text-blue-600 dark:text-blue-400">3. Informativas</strong> (cuadradas azules o verdes • Dan información).
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-abrir-senales-transito"
              onClick={() => {
                setShowSignsSection(true);
                setTimeout(() => {
                  document.getElementById('seccion-senales-transito')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="w-full md:w-auto px-7 py-4 rounded-2xl bg-[#0052cc] hover:bg-[#0043a8] active:scale-95 text-white font-black text-sm shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
            >
              <span>SEÑALES DE TRÁNSITO</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Al darle clic: Abre las 3 secciones completas dentro del apartado inicio */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-200 dark:border-blue-900/60 p-4 sm:p-6 shadow-md space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚦</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    SEÑALES DE TRÁNSITO • DENTRO DE INICIO
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Manual de Señalización Vial • 1. Reglamentarias • 2. Preventivas • 3. Informativas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSignsSection(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <X size={15} />
                <span>Ocultar Señales</span>
              </button>
            </div>

            {/* Componente oficial de las 3 secciones */}
            <TrafficSignsScreen onBackToDashboard={() => setShowSignsSection(false)} />
          </div>
        )}
      </section>

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
            onClick={() => {
              setShowSignsSection(true);
              setTimeout(() => {
                document.getElementById('seccion-senales-transito')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
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
                  <ShieldAlert size={24} />
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
                  3 Secciones Oficiales
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
              <span>Abrir las 3 Secciones</span>
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
                  Google Maps
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-[#0052cc] transition-colors">
                Google Maps & Incidencias Viales
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                Visualiza el mapa interactivo con capa de tráfico en tiempo real, geolocaliza baches, semáforos y obras, o traza rutas seguras en Colombia.
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0052cc] dark:text-sky-400"
            >
              <span>Abrir Google Maps</span>
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
