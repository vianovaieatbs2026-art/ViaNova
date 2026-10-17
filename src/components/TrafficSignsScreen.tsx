import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  HardHat, 
  Sparkles, 
  Eye, 
  EyeOff,
  Scale,
  Compass,
  Volume2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { getTrafficSigns } from '../data/mockData';
import { TrafficSign } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { TrafficSignGraphic } from './TrafficSignGraphic';

interface TrafficSignsScreenProps {
  onBackToDashboard: () => void;
}

export const TrafficSignsScreen: React.FC<TrafficSignsScreenProps> = ({ onBackToDashboard }) => {
  const { language, t } = useThemeLanguage();
  const allSigns = getTrafficSigns(language);

  // Active section tab: 'todas' | 'reglamentaria' | 'preventiva' | 'informativa' | 'transitoria'
  const [selectedSection, setSelectedSection] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [revealedCards, setRevealedCards] = useState<{ [id: string]: boolean }>({});

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Section meta definitions strictly based on Colombian Road Sign Manual (Manual de Señalización Vial)
  const sectionsConfig = [
    {
      id: 'reglamentaria',
      number: '1',
      title: t('signs_sec1_title', '1. Reglamentarias'),
      subtitle: t('signs_sec1_subtitle', 'Circulares, fondo blanco y borde rojo'),
      role: t('signs_sec1_role', 'Son las que obligan'),
      description: t('signs_sec1_desc', 'Tienen por objeto indicar a los usuarios las limitaciones, prohibiciones o restricciones sobre el uso de la vía. Su cumplimiento es de carácter legal estricto y su inobservancia genera comparendo según el Código Nacional de Tránsito (Ley 769 de 2002). Formas circulares, fondo blanco y orla roja (con excepciones normativas oficiales como PARE octagonal y CEDA EL PASO triangular invertido).'),
      badgeColor: 'bg-red-500 text-white',
      cardBg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60',
      tagColor: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/70 border-red-300 dark:border-red-800',
      icon: ShieldAlert,
      count: allSigns.filter(s => s.category === 'reglamentaria').length
    },
    {
      id: 'preventiva',
      number: '2',
      title: t('signs_sec2_title', '2. Preventivas'),
      subtitle: t('signs_sec2_subtitle', 'Diamante amarillo'),
      role: t('signs_sec2_role', 'Avisan peligro'),
      description: t('signs_sec2_desc', 'Tienen por objeto advertir al usuario de la vía la existencia de un peligro o condición de riesgo imprevisto y la naturaleza de este. Su forma geométrica es de rombo o diamante con esquinas redondeadas, fondo amarillo reflectivo de alta visibilidad, orla y símbolos en negro mate.'),
      badgeColor: 'bg-amber-500 text-slate-950',
      cardBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
      tagColor: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800',
      icon: AlertTriangle,
      count: allSigns.filter(s => s.category === 'preventiva').length
    },
    {
      id: 'informativa',
      number: '3',
      title: t('signs_sec3_title', '3. Informativas'),
      subtitle: t('signs_sec3_subtitle', 'Cuadradas azules o verdes'),
      role: t('signs_sec3_role', 'Dan información'),
      description: t('signs_sec3_desc', 'Tienen por objeto guiar e informar al usuario de la vía sobre la identificación de rutas, destinos, direcciones, distancias, servicios hospitalarios, auxilios mecánicos y sitios turísticos o de interés público. Su forma es cuadrada o rectangular con fondo azul o verde y símbolos en blanco.'),
      badgeColor: 'bg-blue-600 text-white',
      cardBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60',
      tagColor: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800',
      icon: Info,
      count: allSigns.filter(s => s.category === 'informativa').length
    }
  ];

  // Optional 4th section for works / transitorias
  const transitoriaCount = allSigns.filter(s => s.category === 'transitoria').length;

  // Filter signs based on search query and selected section
  const filteredSigns = useMemo(() => {
    return allSigns.filter(sign => {
      const matchesSection = selectedSection === 'todas' || sign.category === selectedSection;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesSection;

      const matchesQuery = 
        sign.name.toLowerCase().includes(q) ||
        sign.code.toLowerCase().includes(q) ||
        sign.description.toLowerCase().includes(q) ||
        (sign.meaning && sign.meaning.toLowerCase().includes(q));

      return matchesSection && matchesQuery;
    });
  }, [allSigns, selectedSection, searchQuery]);

  // Speech helper to listen to the sign description aloud
  const handleSpeak = (sign: TrafficSign) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${sign.code}, ${sign.name}. ${sign.description}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'en' ? 'en-US' : 'es-CO';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors mb-2.5 cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>{t('sim_back_to_dashboard', 'Volver al Inicio')}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052cc] dark:text-sky-300 text-[11px] font-extrabold mb-2 border border-blue-200 dark:border-blue-900">
            <Scale size={13} className="shrink-0" />
            <span>Manual de Señalización Vial de Colombia (Mintransporte & INVÍAS)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-3">
            <span>SEÑALES DE TRÁNSITO</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
            Catálogo normativo oficial clasificado en las 3 secciones fundamentales: <strong className="text-red-600 dark:text-red-400">1. Reglamentarias</strong> (que obligan), <strong className="text-amber-600 dark:text-amber-400">2. Preventivas</strong> (avisan peligro) y <strong className="text-blue-600 dark:text-blue-400">3. Informativas</strong> (dan información). Cada señal incluye su dibujo oficial y su descripción en 1 línea.
          </p>
        </div>

        {/* Action Controls: Flashcard Mode Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsFlashcardMode(!isFlashcardMode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isFlashcardMode
                ? 'bg-[#0052cc] text-white shadow-md ring-2 ring-blue-400/40'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles size={16} className={isFlashcardMode ? 'text-amber-300' : 'text-[#0052cc] dark:text-sky-400'} />
            <span>{isFlashcardMode ? 'Modo Normal (Ver todo)' : 'Modo Flashcards (Ocultar y adivinar)'}</span>
          </button>
        </div>
      </div>

      {/* 3 Main Sections Navigation Buttons / Segmented Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers size={14} />
            <span>Selecciona una Sección de Señales:</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            Total disponibles: {allSigns.length} señales
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Button: Todas */}
          <button
            type="button"
            onClick={() => setSelectedSection('todas')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedSection === 'todas'
                ? 'bg-slate-900 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-white shadow-md scale-[1.01]'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                selectedSection === 'todas' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                COMPLETO
              </span>
              <span className="text-xs font-black">{allSigns.length}</span>
            </div>
            <div className="font-black text-sm">Todas las 3 Secciones</div>
            <div className={`text-[11px] mt-1 ${selectedSection === 'todas' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
              Ver catálogo consolidado continuo
            </div>
          </button>

          {/* Buttons for each of the 3 requested sections */}
          {sectionsConfig.map(sec => {
            const isSelected = selectedSection === sec.id;
            const Icon = sec.icon;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSection(sec.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${sec.cardBg} border-current shadow-md scale-[1.01]`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${sec.badgeColor}`}>
                    {sec.role}
                  </span>
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300">{sec.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon size={18} className="shrink-0 text-[#0052cc] dark:text-sky-400" />
                  <span className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                    {sec.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-tight">
                  {sec.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código (SR-01, SP-33, SI-01) o palabra clave (PARE, Límite 30, Deslizamiento, Paradero, Ruta)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-1 cursor-pointer shrink-0"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Render Sections (either specific section or all 3 sections) */}
      <div className="space-y-12">
        {sectionsConfig
          .filter(sec => selectedSection === 'todas' || selectedSection === sec.id)
          .map(sec => {
            const sectionSigns = filteredSigns.filter(s => s.category === sec.id);
            if (sectionSigns.length === 0 && searchQuery) return null;

            const Icon = sec.icon;

            return (
              <section key={sec.id} className="space-y-5">
                {/* Section Header Card */}
                <div className={`p-5 sm:p-6 rounded-3xl border ${sec.cardBg} shadow-xs`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${sec.badgeColor}`}>
                        <Icon size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {sec.title}
                          </h2>
                          <span className={`text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider ${sec.badgeColor}`}>
                            {sec.role}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                          Forma y color oficial: {sec.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 self-start md:self-auto">
                      {sectionSigns.length} señales en esta sección
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-black/5 dark:border-white/5 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                {/* Grid of Signs */}
                {sectionSigns.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                    <p className="text-xs font-bold text-slate-500">No hay señales que coincidan con la búsqueda en esta sección.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sectionSigns.map(sign => {
                      const isRevealed = revealedCards[sign.id];

                      return (
                        <div
                          key={sign.id}
                          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#0052cc]/40 dark:hover:border-sky-500/40"
                        >
                          <div>
                            {/* Card Top: Code badge + Flashcard/Audio Controls */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${sec.tagColor}`}>
                                {sign.code}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {/* Pronounce aloud button */}
                                <button
                                  type="button"
                                  onClick={() => handleSpeak(sign)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Escuchar pronunciación y descripción en voz alta"
                                  aria-label="Escuchar señal"
                                >
                                  <Volume2 size={16} />
                                </button>

                                {/* Flashcard reveal toggle */}
                                {isFlashcardMode && (
                                  <button
                                    type="button"
                                    onClick={() => toggleReveal(sign.id)}
                                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                                    title={isRevealed ? 'Ocultar respuesta' : 'Revelar respuesta'}
                                  >
                                    {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                                    <span>{isRevealed ? 'Ocultar' : 'Ver'}</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Sign Graphic Drawing (El dibujito oficial) */}
                            <div className="py-4 px-2 flex justify-center items-center bg-radial from-slate-50/80 to-transparent dark:from-slate-800/40 rounded-2xl min-h-[120px]">
                              <TrafficSignGraphic
                                signCode={sign.code}
                                signType={sign.name}
                                size="md"
                                className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                              />
                            </div>

                            {/* Sign Information Content */}
                            {(!isFlashcardMode || isRevealed) ? (
                              <div className="mt-4 space-y-2.5 animate-fade-in">
                                {/* Official Name */}
                                <h3 className="font-black text-[#0f172a] dark:text-white text-base leading-snug tracking-tight">
                                  {sign.name}
                                </h3>

                                {/* Exactly 1 line of clear, official description */}
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-0.5">
                                    Descripción oficial (1 línea):
                                  </span>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                    {sign.description}
                                  </p>
                                </div>

                                {/* Normative meaning */}
                                {sign.meaning && (
                                  <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl text-xs text-[#0052cc] dark:text-sky-300 border border-blue-100 dark:border-blue-900/50">
                                    <strong className="block text-[11px] font-black mb-0.5">
                                      ¿Qué exige en la vía?
                                    </strong>
                                    <span className="leading-relaxed block text-[11px]">
                                      {sign.meaning}
                                    </span>
                                  </div>
                                )}

                                {/* Legal article / Fine if applicable */}
                                <div className="pt-2 flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                                  {sign.colombianNorm && (
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                                      ⚖️ {sign.colombianNorm}
                                    </span>
                                  )}
                                  {sign.finePenalty && (
                                    <span className="text-red-600 dark:text-red-400 font-black">
                                      ⚠️ {sign.finePenalty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Flashcard Hidden State */
                              <div className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                                  ¿Conoces el nombre y significado de esta señal?
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleReveal(sign.id)}
                                  className="px-4 py-2 bg-[#0052cc] text-white text-xs font-black rounded-xl hover:bg-[#0043a8] transition-colors cursor-pointer shadow-xs"
                                >
                                  Revelar Respuesta
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

        {/* Section 4: Transitorias / Obras if selected or visible in 'todas' when queried */}
        {(selectedSection === 'todas' || selectedSection === 'transitoria') && transitoriaCount > 0 && (
          <section className="space-y-5 pt-4">
            <div className="p-5 sm:p-6 rounded-3xl border bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <HardHat size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Transitorias y Obras (ST)
                      </h2>
                      <span className="text-[11px] font-black px-3 py-0.5 rounded-full uppercase bg-orange-500 text-white">
                        Zona de Obras
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                      Diamante naranja • Alertan sobre trabajos y maquinaria en la vía
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSigns.filter(s => s.category === 'transitoria').map(sign => (
                <div
                  key={sign.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-black px-3 py-1 rounded-full uppercase bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                        {sign.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(sign)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 cursor-pointer"
                        title="Escuchar señal"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="py-4 flex justify-center items-center bg-orange-50/40 dark:bg-orange-950/20 rounded-2xl min-h-[120px]">
                      <TrafficSignGraphic signCode={sign.code} signType={sign.name} size="md" />
                    </div>

                    <div className="mt-4 space-y-2">
                      <h3 className="font-black text-slate-900 dark:text-white text-base">
                        {sign.name}
                      </h3>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                          Descripción oficial:
                        </span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {sign.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Empty State */}
      {filteredSigns.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <AlertTriangle size={42} className="mx-auto text-amber-500 mb-3" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            No se encontraron señales para "{searchQuery}"
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Prueba buscando con términos como PARE, Ceda, Límite 30, Curva, Escolar, Deslizamiento, Primeros auxilios, Ruta, Paradero o códigos como SR-01, SP-01, SI-01.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSection('todas');
            }}
            className="mt-4 px-4 py-2 bg-[#0052cc] text-white text-xs font-bold rounded-xl hover:bg-[#0043a8] transition-colors cursor-pointer"
          >
            Ver todas las señales
          </button>
        </div>
      )}
    </div>
  );
};
