import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';
import { OFFICIAL_TRAFFIC_SECTIONS, OfficialTrafficSign, TrafficSignSectionConfig } from '../data/officialSignsData';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface TrafficSignsSectionsProps {
  initialSectionId?: 'todas' | 'reglamentarias' | 'preventivas' | 'informativas';
  onNavigateToQuiz?: () => void;
  showFlashcardToggle?: boolean;
}

export const TrafficSignsSections: React.FC<TrafficSignsSectionsProps> = ({
  initialSectionId = 'todas',
  onNavigateToQuiz,
  showFlashcardToggle = true
}) => {
  const { t } = useThemeLanguage();
  const [activeFilter, setActiveFilter] = useState<'todas' | 'reglamentarias' | 'preventivas' | 'informativas'>(initialSectionId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [revealedCards, setRevealedCards] = useState<{ [id: string]: boolean }>({});

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter sections and signs based on active filter and search query
  const filteredSections = OFFICIAL_TRAFFIC_SECTIONS.map((sec) => {
    if (activeFilter !== 'todas' && sec.id !== activeFilter) {
      return null;
    }

    const filteredSigns = sec.signs.filter((sign) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        sign.name.toLowerCase().includes(q) ||
        sign.code.toLowerCase().includes(q) ||
        sign.description.toLowerCase().includes(q) ||
        sign.shapeHint.toLowerCase().includes(q)
      );
    });

    return {
      ...sec,
      signs: filteredSigns
    };
  }).filter(Boolean) as TrafficSignSectionConfig[];

  const totalVisibleSigns = filteredSections.reduce((acc, sec) => acc + sec.signs.length, 0);

  return (
    <div className="w-full space-y-6">
      {/* Control bar: Category Filter Pills + Search + Flashcards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3.5">
        
        {/* Top Filter Buttons for the 3 official sections */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('todas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'todas'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs ring-2 ring-slate-900/10'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Filter size={14} />
            <span>Todas las 3 Secciones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('reglamentarias')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'reglamentarias'
                ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/20'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/70 border border-red-200 dark:border-red-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>1. Reglamentarias (Obligan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('preventivas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'preventivas'
                ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/30'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/70 border border-amber-200 dark:border-amber-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>2. Preventivas (Peligro)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('informativas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'informativas'
                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>3. Informativas (Información)</span>
          </button>

          {showFlashcardToggle && (
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => setIsFlashcardMode(prev => !prev)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isFlashcardMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles size={14} />
                <span>{isFlashcardMode ? 'Modo Normal' : 'Modo Flashcards'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o código (Ej: PARE, Ceda, Límite 30, Curva, Deslizamiento, Hospital, Paradero)..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20"
          />
        </div>
      </div>

      {/* Render the 3 sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div 
            key={section.id} 
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden p-5 sm:p-6 space-y-5"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                    section.id === 'reglamentarias' ? 'bg-red-600 text-white' :
                    section.id === 'preventivas' ? 'bg-amber-500 text-slate-950' :
                    'bg-blue-600 text-white'
                  }`}>
                    {section.number}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {section.ruleTitle}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <span className="font-black text-slate-900 dark:text-white">{section.ruleSummary}</span>{' '}
                  {section.visualTag}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${section.badgeClass}`}>
                  {section.signs.length} señales
                </span>
              </div>
            </div>

            {/* Grid of signs for this section */}
            {section.signs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.signs.map((sign) => {
                  const isRevealed = revealedCards[sign.id];

                  return (
                    <div
                      key={sign.id}
                      className={`rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between bg-white dark:bg-slate-800/80 shadow-xs hover:shadow-md ${
                        section.id === 'reglamentarias' ? 'border-red-100 dark:border-red-950/60 hover:border-red-300' :
                        section.id === 'preventivas' ? 'border-amber-100 dark:border-amber-950/60 hover:border-amber-300' :
                        'border-blue-100 dark:border-blue-950/60 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Bar inside Card */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {sign.code}
                        </span>

                        {isFlashcardMode && (
                          <button
                            type="button"
                            onClick={() => toggleReveal(sign.id)}
                            className="text-xs text-[#0052cc] dark:text-sky-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{isRevealed ? 'Ocultar' : 'Ver respuesta'}</span>
                          </button>
                        )}
                      </div>

                      {/* Su Dibujito (Official SVG Graphic) */}
                      <div className="py-2 flex items-center justify-center min-h-[96px]">
                        <TrafficSignGraphic
                          signType={sign.visualKey}
                          signCode={sign.code}
                          size="md"
                          showCodeBadge={false}
                        />
                      </div>

                      {/* Content: Name + Exactly 1 line of official description */}
                      {(!isFlashcardMode || isRevealed) ? (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                          <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
                            {sign.name}
                          </h3>
                          {/* 1 line official description */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {sign.description}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-center">
                          <button
                            type="button"
                            onClick={() => toggleReveal(sign.id)}
                            className="w-full py-1.5 px-3 bg-[#0052cc] text-white text-xs font-bold rounded-xl hover:bg-[#0047b3] transition-colors cursor-pointer"
                          >
                            ¿Qué significa?
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No se encontraron señales coincidentes en esta sección.
              </p>
            )}
          </div>
        ))}

        {totalVisibleSigns === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
            <AlertTriangle size={32} className="mx-auto text-amber-500" />
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">No encontramos señales con "{searchQuery}"</h4>
            <p className="text-xs text-slate-500">Prueba buscando PARE, Ceda, Límite 30, Curva, Deslizamiento, Hospital o Paradero.</p>
          </div>
        )}
      </div>
    </div>
  );
};
