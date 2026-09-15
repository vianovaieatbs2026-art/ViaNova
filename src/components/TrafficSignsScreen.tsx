import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Layers, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  HardHat, 
  Sparkles, 
  Eye, 
  EyeOff,
  Scale
} from 'lucide-react';
import { getTrafficSigns } from '../data/mockData';
import { TrafficSign } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface TrafficSignsScreenProps {
  onBackToDashboard: () => void;
}

export const TrafficSignsScreen: React.FC<TrafficSignsScreenProps> = ({ onBackToDashboard }) => {
  const { language, t } = useThemeLanguage();
  const signs = getTrafficSigns(language);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [revealedCards, setRevealedCards] = useState<{ [id: string]: boolean }>({});

  const categories = [
    { id: 'todas', label: t('signs_cat_all', 'Todas las Señales'), count: signs.length },
    { id: 'reglamentaria', label: t('signs_cat_regulatory', 'Reglamentarias (SR)'), count: signs.filter(s => s.category === 'reglamentaria').length },
    { id: 'preventiva', label: t('signs_cat_preventive', 'Preventivas (SP)'), count: signs.filter(s => s.category === 'preventiva').length },
    { id: 'informativa', label: t('signs_cat_informative', 'Informativas (SI)'), count: signs.filter(s => s.category === 'informativa').length },
    { id: 'transitoria', label: t('signs_cat_temporary', 'Transitorias / Obras (ST)'), count: signs.filter(s => s.category === 'transitoria').length },
  ];

  const filteredSigns = signs.filter((sign) => {
    const matchesCategory = selectedCategory === 'todas' || sign.category === selectedCategory;
    const matchesQuery = sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderColombianSignGraphic = (sign: TrafficSign) => {
    // SR-01 PARE (Octagon red with white letters)
    if (sign.code.startsWith('SR-01')) {
      return (
        <div className="w-20 h-20 bg-[#ba1a1a] rounded-lg rotate-45 flex items-center justify-center border-2 border-white shadow-md shrink-0">
          <div className="-rotate-45 text-white font-black text-sm tracking-wider uppercase text-center px-1">
            PARE
          </div>
        </div>
      );
    }

    // SR-02 CEDA EL PASO (Inverted triangle)
    if (sign.code.startsWith('SR-02')) {
      return (
        <div className="w-20 h-20 flex items-center justify-center shrink-0">
          <div className="w-0 h-0 border-l-[36px] border-l-transparent border-r-[36px] border-r-transparent border-t-[64px] border-t-[#ba1a1a] relative flex items-center justify-center">
            <div className="w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-t-[48px] border-t-white absolute -bottom-[60px] -left-[26px] flex items-center justify-center">
              <span className="text-[#ba1a1a] font-black text-[7.5px] absolute -top-8 -left-4 w-8 text-center leading-none">
                CEDA
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Circular Signs (SR)
    if (sign.shape === 'circle') {
      const isBlue = sign.bgHex === '#0052cc';
      return (
        <div className={`w-20 h-20 rounded-full border-4 ${isBlue ? 'border-white bg-[#0052cc]' : 'border-[#ba1a1a] bg-white'} flex flex-col items-center justify-center shadow-md shrink-0 p-1`}>
          {sign.code.includes('50') ? (
            <div className="text-center leading-none">
              <span className="font-black text-xl text-[#0f172a] block">50</span>
              <span className="text-[7px] font-bold text-[#64748b]">KM/H</span>
            </div>
          ) : sign.code.includes('30') ? (
            <div className="text-center leading-none">
              <span className="font-black text-xl text-[#ba1a1a] block">30</span>
              <span className="text-[7px] font-bold text-[#64748b]">KM/H</span>
            </div>
          ) : sign.code === 'SR-26' ? (
            <div className="relative flex items-center justify-center">
              <span className="text-2xl font-black text-[#0f172a]">P</span>
              <div className="w-12 h-1 bg-[#ba1a1a] rotate-45 absolute"></div>
            </div>
          ) : (
            <span className={`text-[10px] font-black ${isBlue ? 'text-white' : 'text-[#ba1a1a]'} text-center`}>
              {sign.code}
            </span>
          )}
        </div>
      );
    }

    // Diamond Signs (SP Yellow / ST Orange)
    if (sign.shape === 'diamond') {
      const isOrange = sign.category === 'transitoria';
      return (
        <div className={`w-18 h-18 ${isOrange ? 'bg-[#f77f00]' : 'bg-[#ffb703]'} rotate-45 flex items-center justify-center border-2 border-[#0f172a] shadow-md shrink-0`}>
          <div className="-rotate-45 text-[#0f172a] font-black text-xs text-center px-1">
            {sign.code}
          </div>
        </div>
      );
    }

    // Rectangle Signs (SI Blue / Direction)
    return (
      <div className="w-20 h-16 bg-[#0052cc] rounded-lg border-2 border-white flex flex-col items-center justify-center text-white shadow-md shrink-0">
        <span className="font-black text-xs">{sign.code}</span>
        <span className="text-[8px] uppercase tracking-wider font-bold">INFO</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{t('sim_back_to_dashboard', 'Volver al Inicio')}</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eff6ff] dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 text-[11px] font-bold mb-1 border border-blue-100 dark:border-blue-900/50">
            <Scale size={12} />
            <span>{t('signs_manual_badge', 'Manual de Señalización Vial - Ministerio de Transporte de Colombia & INVÍAS')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white">
            {t('nav_signs', 'Señales de Tránsito (Colombia)')}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 mt-1">
            {t('signs_hero_desc', 'Aprende los códigos oficiales (SR, SP, SI, ST), significados normativos y tipos de infracción aplicables en el territorio colombiano.')}
          </p>
        </div>

        {/* Flashcard Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsFlashcardMode(!isFlashcardMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isFlashcardMode
              ? 'bg-[#0052cc] text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-[#0052cc] dark:text-sky-400 hover:bg-[#eff6ff] dark:hover:bg-slate-700'
          }`}
        >
          <Sparkles size={15} />
          <span>{isFlashcardMode ? t('signs_normal_mode', 'Modo Normal') : t('signs_flashcard_mode', 'Modo Flashcards (Entrenamiento)')}</span>
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder={t('signs_search_placeholder', 'Buscar por código (Ej: SR-01, SP-33, SI-01) o palabra clave (Pare, Velocidad, Ciclistas)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#cbd5e1] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 hover:bg-[#e2e8f0] dark:hover:bg-slate-700 hover:text-[#0f172a]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-700 text-[#475569] dark:text-slate-300'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSigns.map((sign) => {
          const isRevealed = revealedCards[sign.id];

          return (
            <div
              key={sign.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Sign badge header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    sign.category === 'reglamentaria'
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
                      : sign.category === 'preventiva'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      : sign.category === 'transitoria'
                      ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                  }`}>
                    {sign.code} • {sign.category.toUpperCase()}
                  </span>

                  {isFlashcardMode && (
                    <button
                      type="button"
                      onClick={() => toggleReveal(sign.id)}
                      className="text-xs text-[#0052cc] dark:text-sky-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isRevealed ? t('signs_hide', 'Ocultar') : t('signs_reveal', 'Revelar')}</span>
                    </button>
                  )}
                </div>

                {/* Sign Icon Center Visual */}
                <div className="py-3 flex justify-center items-center">
                  {renderColombianSignGraphic(sign)}
                </div>

                {/* Content */}
                {(!isFlashcardMode || isRevealed) ? (
                  <div className="mt-4 space-y-2 animate-fade-in">
                    <h3 className="font-black text-[#0f172a] dark:text-white text-sm sm:text-base">{sign.name}</h3>
                    <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">{sign.description}</p>
                    
                    <div className="p-2.5 bg-[#eff6ff] dark:bg-blue-950/50 rounded-xl text-xs text-[#0052cc] dark:text-sky-300">
                      <strong className="block mb-0.5 font-bold">{t('signs_meaning_co', 'Significado en Colombia:')}</strong>
                      {sign.meaning}
                    </div>

                    {sign.colombianNorm && (
                      <p className="text-[10px] text-[#64748b] dark:text-slate-400 font-medium">
                        {t('quiz_legal_norm', 'Norma')}: {sign.colombianNorm}
                      </p>
                    )}

                    {sign.finePenalty && (
                      <p className="text-[11px] text-[#dc2626] dark:text-red-400 font-bold">
                        ⚠️ {sign.finePenalty}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-[#f8fafc] dark:bg-slate-800/70 rounded-xl text-center space-y-2 border border-[#e2e8f0] dark:border-slate-700">
                    <p className="text-xs text-[#64748b] dark:text-slate-300 font-semibold">
                      {t('signs_identify_prompt', '¿Identificas esta señal colombiana?')}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleReveal(sign.id)}
                      className="px-3 py-1.5 bg-[#0052cc] text-white text-xs font-bold rounded-lg hover:bg-[#0043a8] transition-colors cursor-pointer"
                    >
                      {t('signs_verify_answer', 'Verificar Respuesta')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSigns.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 p-6">
          <AlertTriangle size={36} className="mx-auto text-[#94a3b8] mb-2" />
          <h3 className="font-bold text-[#0f172a] dark:text-white">{t('signs_no_found', 'No se encontraron señales')}</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">{t('signs_try_other', 'Prueba con otros términos de búsqueda (Ej: SR-01, Curva, Pare, 50).')}</p>
        </div>
      )}
    </div>
  );
};
