import React from 'react';
import { 
  ShieldCheck, 
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
  Building2
} from 'lucide-react';
import { UserProfile, ScreenId, SearchResultItem } from '../types';
import { ViaNovaLogo } from './ViaNovaLogo';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { searchViaNovaItems } from '../data/searchIndex';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getUserDashboardProgress } from '../utils/userProgress';
import { CityRouteSimulator2D } from './CityRouteSimulator2D';
import { AnimatedServicesGrid } from './AnimatedServicesGrid';
import { InteractiveStoryboard } from './InteractiveStoryboard';
import { MultimediaVideoSection } from './MultimediaVideoSection';
import { InteractiveWireframeSection } from './InteractiveWireframeSection';

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
  { id: 'co-monserrate', name: 'Cerro de Monserrate', detail: 'Bogotá D.C., Colombia', query: 'Monserrate, Bogotá, Colombia', zoom: 15, country: 'Colombia', category: 'monument' },
  { id: 'co-cartagena', name: 'Ciudad Amurallada', detail: 'Cartagena de Indias, Bolívar', query: 'Ciudad Amurallada, Cartagena, Colombia', zoom: 16, country: 'Colombia', category: 'city' },
  { id: 'co-cali', name: 'San Antonio y Cristo Rey', detail: 'Cali, Valle del Cauca', query: 'Barrio San Antonio, Cali, Colombia', zoom: 15, country: 'Colombia', category: 'city' },
  { id: 'co-oriente', name: 'Túnel de Oriente', detail: 'Conexión Valle de Aburrá - Aeropuerto JMC', query: 'Túnel de Oriente, Medellín, Colombia', zoom: 14, country: 'Colombia', category: 'corridor' }
];

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

  const progress = getUserDashboardProgress(user);

  const quickAccessChips = [
    {
      id: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
      action: () => {
        onNavigate('quiz');
      },
    },
    {
      id: 'simuladores',
      label: 'Simuladores',
      icon: FileCheck2,
      action: () => {
        onNavigate('simulador');
      },
    },
    {
      id: 'catalogo',
      label: 'Catálogo',
      icon: SlidersHorizontal,
      action: () => {
        onNavigate('senales');
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

  // Google Maps interactive state and worldwide locator
  const [mapQuery, setMapQuery] = React.useState('Medellín, Antioquia, Colombia');
  const [mapSearchInput, setMapSearchInput] = React.useState('');
  const [mapZoom, setMapZoom] = React.useState(13);
  const [mapLayer, setMapLayer] = React.useState<'m' | 'k' | 'p'>('m'); // m: mapa/tráfico, k: satélite, p: relieve
  const [activeCorridorId, setActiveCorridorId] = React.useState<string | null>(null);
  const [mapDisplayName, setMapDisplayName] = React.useState('Medellín (Vista General)');
  const [isMapSuggestionsOpen, setIsMapSuggestionsOpen] = React.useState(false);
  const [worldSearchResults, setWorldSearchResults] = React.useState<WorldLocationItem[]>([]);
  const [isSearchingWorld, setIsSearchingWorld] = React.useState(false);
  const [defaultSuggestionsTab, setDefaultSuggestionsTab] = React.useState<'mundo' | 'colombia'>('mundo');
  const [isForegroundActive, setIsForegroundActive] = React.useState(false);
  const [foregroundNotice, setForegroundNotice] = React.useState<string | null>(null);
  const mapSearchContainerRef = React.useRef<HTMLDivElement>(null);

  // Close map suggestions on outside click
  React.useEffect(() => {
    const handleMapClickOutside = (event: MouseEvent) => {
      if (mapSearchContainerRef.current && !mapSearchContainerRef.current.contains(event.target as Node)) {
        setIsMapSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMapClickOutside);
    return () => document.removeEventListener('mousedown', handleMapClickOutside);
  }, []);

  // Live worldwide location autocomplete (Photon OpenStreetMap API + local cache)
  React.useEffect(() => {
    const trimmed = mapSearchInput.trim();
    if (trimmed.length < 2) {
      setWorldSearchResults([]);
      setIsSearchingWorld(false);
      return;
    }

    setIsSearchingWorld(true);
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=8`,
          { signal: controller.signal }
        );

        if (response.ok) {
          const data = await response.json();
          const features = data.features || [];
          const mapped: WorldLocationItem[] = features.map((f: any, idx: number) => {
            const p = f.properties || {};
            const coords = f.geometry?.coordinates; // [lon, lat]
            const name = p.name || p.street || p.city || trimmed;
            const parts = [
              p.housenumber ? `${p.street || ''} #${p.housenumber}` : p.street,
              p.district,
              p.city,
              p.state,
              p.country
            ].filter(Boolean);
            const detail = parts.length > 0 ? parts.join(', ') : (p.country || 'Ubicación mundial');
            const zoom = p.type === 'country' ? 6 : (p.type === 'city' || p.type === 'state' ? 12 : 16);
            const query = (coords && coords.length === 2)
              ? `${coords[1]},${coords[0]}`
              : `${name}, ${p.country || ''}`.trim();

            let category: WorldLocationItem['category'] = 'place';
            if (p.type === 'city' || p.type === 'state' || p.type === 'country') category = 'city';
            else if (p.osm_key === 'tourism' || p.osm_key === 'historic' || p.osm_value === 'monument') category = 'monument';
            else if (p.street || p.osm_key === 'highway') category = 'street';

            return {
              id: `photon-${p.osm_id || idx}-${idx}`,
              name,
              detail,
              query,
              zoom,
              country: p.country,
              category
            };
          });

          // Also check if any famous local/world items match
          const localMatches = [...WORLD_FAMOUS_LOCATIONS, ...COLOMBIA_HIGHLIGHTS].filter(item =>
            item.name.toLowerCase().includes(trimmed.toLowerCase()) ||
            item.detail.toLowerCase().includes(trimmed.toLowerCase())
          );

          const existingNames = new Set(mapped.map(m => m.name.toLowerCase()));
          const combined = [...mapped];
          for (const loc of localMatches) {
            if (!existingNames.has(loc.name.toLowerCase()) && combined.length < 9) {
              combined.push(loc);
              existingNames.add(loc.name.toLowerCase());
            }
          }

          setWorldSearchResults(combined);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          const fallbackMatches = [...WORLD_FAMOUS_LOCATIONS, ...COLOMBIA_HIGHLIGHTS].filter(item =>
            item.name.toLowerCase().includes(trimmed.toLowerCase()) ||
            item.detail.toLowerCase().includes(trimmed.toLowerCase())
          );
          setWorldSearchResults(fallbackMatches);
        }
      } finally {
        setIsSearchingWorld(false);
      }
    }, 220);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mapSearchInput]);

  const handleSelectCorridor = (corridor: CorridorItem) => {
    if (activeCorridorId === corridor.id) {
      // Si ya está activo, restablecer a vista panorámica de Medellín
      setActiveCorridorId(null);
      setMapQuery('Medellín, Antioquia, Colombia');
      setMapZoom(13);
      setMapDisplayName('Medellín (Vista General)');
      setMapSearchInput('');
      setIsForegroundActive(false);
      setForegroundNotice(null);
    } else {
      setActiveCorridorId(corridor.id);
      setMapQuery(corridor.query);
      setMapZoom(Math.max(corridor.zoom, 16));
      setMapDisplayName(corridor.name);
      setMapSearchInput(corridor.name);
      setIsForegroundActive(true);
      setForegroundNotice(`Corredor en primer plano: ${corridor.name}`);

      const mapSection = document.getElementById('mapa-en-vivo-medellin');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      setTimeout(() => {
        setForegroundNotice(null);
      }, 4000);
    }
  };

  const handleSelectWorldLocation = (location: WorldLocationItem) => {
    setMapQuery(location.query);
    const displayName = location.name + (location.country ? ` (${location.country})` : '');
    setMapDisplayName(displayName);
    setMapSearchInput(location.name);
    setMapZoom(location.zoom ? Math.max(location.zoom, 16) : 17);
    const matchCorridor = MEDELLIN_CORRIDORS.find(c => c.name.toLowerCase() === location.name.toLowerCase());
    setActiveCorridorId(matchCorridor ? matchCorridor.id : null);
    setIsMapSuggestionsOpen(false);
    setIsForegroundActive(true);
    setForegroundNotice(`Ubicado en primer plano: ${displayName}`);

    const mapSection = document.getElementById('mapa-en-vivo-medellin');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setForegroundNotice(null);
    }, 4500);
  };

  const handleMapSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = mapSearchInput.trim();
    if (!query) return;

    setIsMapSuggestionsOpen(false);

    // Centrar mapa inmediatamente en primer plano visual de la pantalla
    const mapSection = document.getElementById('mapa-en-vivo-medellin');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let finalQuery = query;
    let finalDisplayName = query;
    let finalZoom = 17; // Zoom de primer plano detallado a nivel de calle/lugar

    // 1. Verificar si coincide con algún resultado ya encontrado
    const matchingWorld = worldSearchResults.find(
      loc => loc.name.toLowerCase() === query.toLowerCase() ||
             loc.detail.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingWorld) {
      finalQuery = matchingWorld.query;
      finalDisplayName = `${matchingWorld.name}${matchingWorld.country ? ` (${matchingWorld.country})` : ''}`;
      finalZoom = matchingWorld.zoom ? Math.max(matchingWorld.zoom, 16) : 17;
    } else {
      // 2. Verificar corredores o lugares colombianos destacados
      const localMatches = [...MEDELLIN_CORRIDORS, ...COLOMBIA_HIGHLIGHTS, ...WORLD_FAMOUS_LOCATIONS];
      const matchLocal = localMatches.find(l => 
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        ('detail' in l && (l as any).detail.toLowerCase().includes(query.toLowerCase()))
      );

      if (matchLocal) {
        finalQuery = matchLocal.query;
        finalDisplayName = matchLocal.name;
        finalZoom = matchLocal.zoom ? Math.max(matchLocal.zoom, 16) : 17;
      } else {
        // 3. Geocodificación instantánea para obtener coordenadas exactas en primer plano
        try {
          const resp = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`);
          if (resp.ok) {
            const data = await resp.json();
            const feat = data.features?.[0];
            if (feat && feat.geometry?.coordinates) {
              const [lon, lat] = feat.geometry.coordinates;
              const p = feat.properties || {};
              const name = p.name || p.street || p.city || query;
              const country = p.country ? `, ${p.country}` : '';
              finalQuery = `${lat},${lon}`;
              finalDisplayName = `${name}${country}`;
              finalZoom = p.type === 'country' ? 8 : (p.type === 'city' ? 14 : 17);
            }
          }
        } catch (_) {
          finalQuery = query;
        }
      }
    }

    setMapQuery(finalQuery);
    setMapDisplayName(finalDisplayName);
    setMapZoom(finalZoom);
    setActiveCorridorId(null);
    setIsForegroundActive(true);
    setForegroundNotice(`Ubicado en primer plano: ${finalDisplayName}`);

    setTimeout(() => {
      setForegroundNotice(null);
    }, 4500);
  };

  const handleResetMap = () => {
    setActiveCorridorId(null);
    setMapQuery('Medellín, Antioquia, Colombia');
    setMapZoom(13);
    setMapDisplayName('Medellín (Vista General)');
    setMapSearchInput('');
    setIsMapSuggestionsOpen(false);
    setIsForegroundActive(false);
    setForegroundNotice(null);

    const mapSection = document.getElementById('mapa-en-vivo-medellin');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
                  onClick={() => onNavigate('simulador')}
                  className="w-full py-3 px-4 bg-white/95 hover:bg-white text-[#0052cc] font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{t('dash_start_sim_btn', 'Iniciar Simulación')}</span>
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
              <span>TRÁFICO EN TIEMPO REAL • GOOGLE MAPS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2.5">
              <MapPin className="text-rose-500 shrink-0" size={28} />
              <span>mapa en vivo - Medellín</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 max-w-2xl">
              Monitoreo del tráfico y estado de vías en tiempo real para Medellín y el Valle de Aburrá (Av. Regional, Autopista Sur, Las Vegas, Av. Oriental, Av. 80 y San Juan).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.google.com/maps/@6.25184,-75.5898,13z/data=!5m1!1e1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Abrir en Google Maps</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={() => onNavigate('reportes')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0047b3] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <AlertTriangle size={13} />
              <span>Reportes de Incidencias</span>
            </button>
          </div>
        </div>

        {/* Quick Corridor Buttons for Medellín (Now fully interactive) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-[#0052cc] dark:text-sky-400" />
            Corredores viales:
          </span>
          {MEDELLIN_CORRIDORS.map((corridor) => {
            const isActive = activeCorridorId === corridor.id;
            return (
              <button
                key={corridor.id}
                type="button"
                onClick={() => handleSelectCorridor(corridor)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0052cc] text-white font-bold shadow-md ring-2 ring-blue-400/40 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`${corridor.name}: ${corridor.highlight}. Clic para centrar mapa`}
              >
                <MapPin size={12} className={isActive ? 'text-amber-300' : 'text-slate-400'} />
                <span>{corridor.name}</span>
                {isActive && <CheckCircle2 size={12} className="text-emerald-300 ml-0.5" />}
              </button>
            );
          })}

          {(activeCorridorId || mapQuery !== 'Medellín, Antioquia, Colombia') && (
            <button
              type="button"
              onClick={handleResetMap}
              className="px-2.5 py-1.5 rounded-xl bg-slate-200/90 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
              title="Restablecer vista a Medellín"
            >
              <RotateCcw size={12} />
              <span>Ver todo Medellín</span>
            </button>
          )}
        </div>

        {/* Google Maps Medellín Container with Authentic Floating Search Bar & Controls */}
        <div 
          id="google-maps-viewport-box"
          className="relative w-full h-[520px] sm:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-md transition-all duration-300"
        >
          {/* Foreground Location Indicator Banner */}
          {foregroundNotice && (
            <div className="absolute top-16 left-3 sm:left-4 z-30 bg-[#0052cc] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xl border border-blue-400/60 flex items-center gap-2 animate-bounce">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
              </span>
              <span className="truncate max-w-[260px] sm:max-w-md">{foregroundNotice}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider shrink-0">
                Primer Plano ({mapZoom}x)
              </span>
            </div>
          )}

          {/* Floating Google Maps Search Bar (Top Left) */}
          <div 
            ref={mapSearchContainerRef} 
            className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-[calc(100%-24px)] sm:w-[460px] max-w-full"
          >
            <form 
              onSubmit={handleMapSearchSubmit}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/80 p-1.5 flex items-center gap-1.5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0052cc] dark:text-sky-400 shrink-0">
                <Globe size={16} />
              </div>

              <input
                type="text"
                value={mapSearchInput}
                onChange={(e) => {
                  setMapSearchInput(e.target.value);
                  setIsMapSuggestionsOpen(true);
                }}
                onFocus={() => setIsMapSuggestionsOpen(true)}
                placeholder="Buscar cualquier ubicación del mundo (ciudades, vías, monumentos)..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none px-1"
              />

              {mapSearchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setMapSearchInput('');
                    setIsMapSuggestionsOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                  title="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              <button
                type="submit"
                id="btn-buscar-mapa-dashboard"
                className="p-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 text-xs font-bold px-3.5"
                title="Buscar y ubicar en el mapa en primer plano"
              >
                <Search size={14} />
                <span>Buscar</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-500 hover:text-[#0052cc] dark:text-slate-400 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Abrir en Google Maps externo"
              >
                <ExternalLink size={14} />
              </a>
            </form>

            {/* Suggestions / Worldwide Locations Dropdown */}
            {isMapSuggestionsOpen && (
              <div className="mt-1.5 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden max-h-80 overflow-y-auto animate-fade-in text-xs">
                {/* Mode 1: Live Worldwide Results when user types >= 2 characters */}
                {mapSearchInput.trim().length >= 2 ? (
                  <>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-[11px] text-slate-500 dark:text-slate-400 px-3">
                      <div className="flex items-center gap-1.5 truncate mr-2">
                        <Globe size={13} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
                        <span className="truncate">Resultados para «{mapSearchInput}»</span>
                      </div>
                      {isSearchingWorld ? (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                          <Loader2 size={11} className="animate-spin text-[#0052cc]" />
                          <span>Buscando...</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#0052cc] dark:text-sky-400 font-semibold shrink-0">
                          Mundial • Clic para ubicar
                        </span>
                      )}
                    </div>

                    <div className="p-1 space-y-0.5">
                      {worldSearchResults.length > 0 ? (
                        worldSearchResults.map((loc) => {
                          const IconComp = loc.category === 'city' 
                            ? Building2 
                            : loc.category === 'monument' 
                            ? Landmark 
                            : loc.category === 'street' || loc.category === 'corridor' 
                            ? Compass 
                            : MapPin;

                          return (
                            <button
                              key={loc.id}
                              type="button"
                              onClick={() => handleSelectWorldLocation(loc)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/80 flex items-center justify-center shrink-0 transition-colors">
                                  <IconComp size={14} className="text-slate-600 dark:text-slate-300 group-hover:text-[#0052cc] dark:group-hover:text-sky-400" />
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0052cc] dark:group-hover:text-sky-400 truncate">
                                    {loc.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                    {loc.detail}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {loc.country && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-200/60 dark:group-hover:bg-blue-900/60 group-hover:text-[#0052cc] dark:group-hover:text-sky-300">
                                    {loc.country}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 group-hover:text-[#0052cc] font-medium hidden sm:inline">
                                  Ubicar →
                                </span>
                              </div>
                            </button>
                          );
                        })
                      ) : !isSearchingWorld ? (
                        <div className="p-4 text-center">
                          <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">
                            Presiona Buscar para ver «{mapSearchInput}» en Google Maps
                          </p>
                          <button
                            type="button"
                            onClick={(e) => handleMapSearchSubmit(e)}
                            className="w-full py-2 px-3 rounded-xl bg-[#0052cc] text-white font-bold hover:bg-[#0047b3] transition-colors cursor-pointer text-xs"
                          >
                            Centrar mapa en «{mapSearchInput}»
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  /* Mode 2: Category Tabs when input is empty */
                  <>
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDefaultSuggestionsTab('mundo')}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          defaultSuggestionsTab === 'mundo'
                            ? 'bg-white dark:bg-slate-700 text-[#0052cc] dark:text-sky-300 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <Globe size={12} />
                        <span>Destinos Mundiales</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDefaultSuggestionsTab('colombia')}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          defaultSuggestionsTab === 'colombia'
                            ? 'bg-white dark:bg-slate-700 text-[#0052cc] dark:text-sky-300 shadow-xs'
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <MapPin size={12} />
                        <span>Medellín & Colombia</span>
                      </button>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {(defaultSuggestionsTab === 'mundo' ? WORLD_FAMOUS_LOCATIONS : COLOMBIA_HIGHLIGHTS).map((loc) => {
                        const IconComp = loc.category === 'city' 
                          ? Building2 
                          : loc.category === 'monument' 
                          ? Landmark 
                          : loc.category === 'street' || loc.category === 'corridor' 
                          ? Compass 
                          : MapPin;

                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => handleSelectWorldLocation(loc)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/80 flex items-center justify-center shrink-0 transition-colors">
                                <IconComp size={14} className="text-slate-600 dark:text-slate-300 group-hover:text-[#0052cc] dark:group-hover:text-sky-400" />
                              </div>
                              <div className="truncate">
                                <p className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0052cc] dark:group-hover:text-sky-400 truncate">
                                  {loc.name}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                  {loc.detail}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {loc.country && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-200/60 dark:group-hover:bg-blue-900/60 group-hover:text-[#0052cc] dark:group-hover:text-sky-300">
                                  {loc.country}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 group-hover:text-[#0052cc] font-medium hidden sm:inline">
                                Ubicar →
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Floating Google Maps Layer Selector (Top Right) */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200/90 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setMapLayer('m')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapLayer === 'm'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Capa Mapa y Tráfico"
            >
              Mapa
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('k')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapLayer === 'k'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Capa Satélite"
            >
              Satélite
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('p')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                mapLayer === 'p'
                  ? 'bg-[#0052cc] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Capa Relieve"
            >
              Relieve
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />
            <button
              type="button"
              onClick={handleResetMap}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Centrar Medellín completo"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Floating Live Location & Traffic Status Pill (Bottom) */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2 px-3 shadow-lg border border-slate-200/90 dark:border-slate-700/80 flex items-center gap-2 max-w-[calc(100%-24px)] text-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200 truncate">
              {mapDisplayName}
            </span>
            {isForegroundActive && (
              <span className="text-[10px] font-black text-white bg-[#0052cc] dark:bg-sky-500 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 shadow-xs animate-pulse">
                <MapPin size={10} />
                <span>En primer plano ({mapZoom}x)</span>
              </span>
            )}
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline shrink-0">
              • Google Maps en Vivo
            </span>
            {activeCorridorId && (
              <span className="text-[10px] font-bold text-[#0052cc] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full shrink-0">
                Punto fijado
              </span>
            )}
          </div>

          {/* Embedded Google Maps with Dynamic Query & Layer */}
          <iframe
            key={`${mapQuery}-${mapLayer}-${mapZoom}`}
            title="Google Maps Mundial con Tráfico y Ubicaciones en Vivo"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=${mapLayer}&z=${mapZoom}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
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
            onClick={() => onNavigate('educacion_vial')}
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
                  {t('dash_badge_law', 'Ley 769 & 2251')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-sky-500 transition-colors">
                {t('nav_education', 'Educación Vial')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_edu_desc', 'Módulos de formación con la Ley Julián Esteban (límites 50/30 km/h), prelación en glorietas, cascos en motos y protección a ciclistas.')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_study_modules', 'Estudiar módulos')}</span>
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
                  <SlidersHorizontal size={22} />
                </div>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-900">
                  {t('dash_badge_mintransporte', 'Manual Mintransporte')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-sky-500 transition-colors">
                {t('nav_signs', 'Señales de Tránsito')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_signs_desc', 'Catálogo oficial con códigos colombianos SR (Reglamentarias), SP (Preventivas), SI (Informativas) y ST (Obras). Incluye modo Flashcards.')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_view_signs', 'Ver señales y flashcards')}</span>
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
                  {t('dash_badge_self_eval', 'Autoevaluación')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-amber-500 transition-colors">
                {t('nav_quiz', 'Quiz de Conocimiento')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_quiz_desc', 'Pruebas rápidas por temas con retroalimentación inmediata, explicaciones legales y sistema de puntuación.')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_take_quiz', 'Hacer un quiz')}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Simulador Examen */}
          <div 
            onClick={() => onNavigate('simulador')}
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
                  <FileCheck2 size={22} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                  {t('dash_badge_official_runt', 'Examen Oficial RUNT')}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white group-hover:text-emerald-500 transition-colors">
                {t('nav_simulator', 'Simulador de Examen Teórico')}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1.5 leading-relaxed">
                {t('dash_mod_sim_desc', 'Simula el examen oficial de los Centros de Enseñanza Automovilística (CEA) para categorías A2 (Motos), B1 (Carros) y C1 (Público).')}
              </p>
            </div>
            <div 
              className="mt-5 pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between text-xs font-bold"
              style={{ color: activeThemeConfig.primaryHex }}
            >
              <span>{t('dash_start_simulation', 'Iniciar simulación')}</span>
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
                {t('dash_mod_profile_desc', 'Consulta tu credencial digital de conductor seguro con código QR, historial de certificados, exámenes aprobados e insignias.')}
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

      {/* ===================== RUTA 2D INTERACTIVA CON VEHÍCULO EN MOVIMIENTO ===================== */}
      <div id="simulacion-2d" className="pt-6">
        <CityRouteSimulator2D />
      </div>

      {/* ===================== TARJETAS DE SERVICIOS 3D CON PRINCIPIOS DE ANIMACIÓN ===================== */}
      <div id="servicios" className="pt-6">
        <AnimatedServicesGrid 
          onNavigate={onNavigate}
          onActionClick={(id) => {
            if (id === 'simulador') onNavigate('simulador');
            else if (id === 'senales') onNavigate('senales');
            else if (id === 'educacion') onNavigate('educacion_vial');
            else if (id === 'reportes') onNavigate('reportes');
          }}
        />
      </div>

      {/* ===================== STORYBOARD INTERACTIVO "CÓMO FUNCIONA VIANOVA" EN 4 PASOS ===================== */}
      <div id="storyboard" className="pt-6">
        <InteractiveStoryboard />
      </div>

      {/* ===================== CÁPSULAS MULTIMEDIA DE VIDEO Y AUDIO ===================== */}
      <div id="multimedia" className="pt-6">
        <MultimediaVideoSection />
      </div>

      {/* ===================== GUÍA DE NAVEGACIÓN Y ATENCIÓN CIUDADANA ===================== */}
      <div id="contacto" className="pt-6">
        <InteractiveWireframeSection />
      </div>
    </div>
  );
};
