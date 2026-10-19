import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Film,
  CheckCircle,
  Volume2,
  VolumeX,
  Mic,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface LessonVideo {
  id: string;
  title: string;
  titleEn?: string;
  duration: string;
  badge: string;
  badgeEn?: string;
  color: string;
  summary: string;
  summaryEn?: string;
  keyRule: string;
  keyRuleEn?: string;
  narration: string;
  narrationEn: string;
  sceneTheme: 'interseccion' | 'puntos_ciegos' | 'frenado' | 'rotonda' | 'seguridad';
}

export const MultimediaVideoSection: React.FC = () => {
  const { language } = useThemeLanguage();
  const isEn = language === 'en';

  const [activeLessonId, setActiveLessonId] = useState<string>('decalogo');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const lessons: LessonVideo[] = [
    {
      id: 'decalogo',
      title: 'Decálogo Vial y Ley Julián Esteban (Ley 2251)',
      titleEn: 'Road Safety Decalogue & Julián Esteban Law (Law 2251)',
      duration: '03:45 min',
      badge: 'NORMATIVA COLOMBIA',
      badgeEn: 'COLOMBIAN REGULATIONS',
      color: '#00AFFF',
      summary: 'Límites de velocidad actualizados en Colombia: 50 km/h en zonas urbanas y 30 km/h en zonas escolares y residenciales.',
      summaryEn: 'Updated speed limits in Colombia: 50 km/h in urban areas and 30 km/h in school and residential zones.',
      keyRule: 'Respeto prioritario al actor más vulnerable: peatones y ciclistas.',
      keyRuleEn: 'Priority respect for the most vulnerable road users: pedestrians and cyclists.',
      narration: 'Cápsula de Educación Vial. Hoy aprenderemos sobre el Decálogo del Conductor Seguro y la Ley Julián Esteban, Ley 2251 de 2022. En Colombia, el límite de velocidad en zonas urbanas es de cincuenta kilómetros por hora, y en zonas escolares y residenciales se reduce a treinta kilómetros por hora. Recuerda la regla de oro: los peatones y ciclistas tienen prioridad absoluta en la vía. Conduce con precaución y protege la vida.',
      narrationEn: 'Road Safety Capsule. Today we will learn about the Safe Driver Decalogue and the Julián Esteban Law, Law 2251 of 2022. In Colombia, the speed limit in urban areas is 50 kilometers per hour, and 30 kilometers per hour in school and residential zones. Always remember: pedestrians and cyclists have absolute priority on the road. Drive with caution and protect life.',
      sceneTheme: 'interseccion'
    },
    {
      id: 'puntos_ciegos',
      title: 'Puntos Ciegos en Tractocamiones y Motos',
      titleEn: 'Blind Spots in Heavy Trucks and Motorcycles',
      duration: '02:30 min',
      badge: 'FÍSICA & ESPACIAL',
      badgeEn: 'PHYSICS & SPATIAL',
      color: '#FF6B00',
      summary: 'Identificación visual de las 4 zonas ciegas críticas en vehículos de carga pesada y cómo los motociclistas deben posicionarse.',
      summaryEn: 'Visual identification of the 4 critical blind zones in heavy freight vehicles and proper motorcycle positioning.',
      keyRule: 'Si tú no ves los espejos del conductor de carga, él no puede verte.',
      keyRuleEn: 'If you cannot see the truck driver mirrors, they cannot see you.',
      narration: 'Cápsula de Educación Vial. En esta sesión analizaremos los puntos ciegos en vehículos de carga pesada y motocicletas. Los tractocamiones y autobuses tienen cuatro zonas ciegas críticas: directamente al frente de la cabina, detrás del remolque, y en ambos laterales, siendo el costado derecho el más peligroso. La regla fundamental es: si tú no puedes ver los espejos del conductor, él tampoco puede verte a ti. Nunca adelantes por la derecha ni permanezcas en sus ángulos muertos.',
      narrationEn: 'Road Safety Capsule. In this session we analyze blind spots in heavy freight vehicles and motorcycles. Tractor-trailers and buses have four critical blind zones: directly in front of the cabin, behind the trailer, and along both flanks, with the right side being the most dangerous. The fundamental rule is: if you cannot see the driver mirrors, they cannot see you. Never pass on the right or linger in blind angles.',
      sceneTheme: 'puntos_ciegos'
    },
    {
      id: 'frenado',
      title: 'Técnicas de Frenado Seguro y Aquaplaning',
      titleEn: 'Safe Braking Techniques & Aquaplaning Prevention',
      duration: '04:10 min',
      badge: 'PREVENCIÓN ACTIVA',
      badgeEn: 'ACTIVE PREVENTION',
      color: '#00FF88',
      summary: 'Distancia de reacción y distancia de frenado en piso seco vs. piso mojado. Regla de los 3 segundos de distancia.',
      summaryEn: 'Reaction distance and braking distance on dry vs wet pavement. 3-second distance rule.',
      keyRule: 'En piso mojado, duplica la distancia de seguimiento a 6 segundos.',
      keyRuleEn: 'On wet pavement, double your following distance to 6 seconds.',
      narration: 'Cápsula de Educación Vial. Hoy aprenderemos sobre técnicas de frenado seguro y prevención de aquaplaning o hidroplaneo. En condiciones de lluvia, la película de agua acumulada en el asfalto reduce drásticamente el agarre de los neumáticos. En calzada seca aplica la regla de los tres segundos de distancia; pero si el pavimento está mojado, duplica esa distancia a seis segundos. Si experimentas hidroplaneo, no frenes de golpe ni gires bruscamente el volante; suelta suavemente el acelerador y mantén la trayectoria firme.',
      narrationEn: 'Road Safety Capsule. Today we will learn about safe braking techniques and preventing aquaplaning or hydroplaning. In rainy conditions, water on the pavement drastically reduces tire traction. On dry roads apply the three-second rule; on wet pavement, double that distance to six seconds. If you experience hydroplaning, do not brake abruptly or turn the steering wheel violently; gently release the gas pedal and hold your direction steady.',
      sceneTheme: 'frenado'
    },
    {
      id: 'rotondas',
      title: 'Prioridad y Giros en Glorietas / Rotondas',
      titleEn: 'Roundabout Priority & Lane Discipline',
      duration: '03:15 min',
      badge: 'INTERSECCIÓN CRÍTICA',
      badgeEn: 'CRITICAL INTERSECTION',
      color: '#A855F7',
      summary: 'Reglas de prelación en glorietas según el Código Nacional de Tránsito y uso obligatorio de luces direccionales.',
      summaryEn: 'Right-of-way rules in roundabouts according to Colombian Traffic Code and mandatory turn signal usage.',
      keyRule: 'El vehículo que ya circula dentro de la glorieta tiene siempre prelación de paso.',
      keyRuleEn: 'Vehicles already circulating inside the roundabout always have the right of way.',
      narration: 'Cápsula de Educación Vial. En esta cápsula explicamos la circulación segura en glorietas o rotondas. Según el Código Nacional de Tránsito de Colombia, el vehículo que ya se encuentra circulando dentro de la glorieta tiene prelación absoluta sobre los vehículos que van a ingresar. Utiliza siempre la direccional izquierda para mantenerte en el carril interior y la direccional derecha con anticipación para tomar tu salida de forma segura.',
      narrationEn: 'Road Safety Capsule. In this capsule we explain safe circulation in roundabouts. According to the Colombian National Traffic Code, vehicles already circulating inside the roundabout have absolute priority over entering traffic. Always use your left indicator to stay in the inner ring and your right indicator in advance to exit safely.',
      sceneTheme: 'rotonda'
    },
    {
      id: 'alcohol_celular',
      title: 'Cero Alcohol y Cero Celular al Volante',
      titleEn: 'Zero Alcohol and Zero Mobile Phones Behind the Wheel',
      duration: '03:30 min',
      badge: 'SEGURIDAD VITAL',
      badgeEn: 'VITAL SAFETY',
      color: '#EF4444',
      summary: 'Ley de Cero Tolerancia al alcohol y los riesgos mortales de la distracción por dispositivos móviles mientras conduces.',
      summaryEn: 'Zero Tolerance alcohol law and the fatal hazards of mobile device distraction while driving.',
      keyRule: 'Consultar el celular por 4 segundos equivale a conducir más de 50 metros a ciegas.',
      keyRuleEn: 'Checking your phone for 4 seconds is equivalent to driving 50+ meters blind.',
      narration: 'Cápsula de Educación Vial. Hoy revisamos dos factores de alto riesgo: el consumo de alcohol y el uso del teléfono celular. En Colombia existe cero tolerancia al alcohol al conducir; cualquier grado detectado acarrea multas severas e inmovilización de la licencia. Además, desviar la mirada al celular por tan solo cuatro segundos a cincuenta kilómetros por hora equivale a avanzar cincuenta y cinco metros completamente a ciegas. Concéntrate al cien por ciento en el camino.',
      narrationEn: 'Road Safety Capsule. Today we review two major hazard factors: alcohol consumption and mobile phone usage. In Colombia there is zero tolerance for alcohol when driving; any detected level brings severe penalties and license suspension. Additionally, glancing at a phone for just four seconds at 50 kilometers per hour means traveling 55 meters completely blind. Keep your focus 100 percent on the road.',
      sceneTheme: 'seguridad'
    }
  ];

  const current = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  // Speech Synthesis Narration Helper
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      setIsSpeaking(false);
    }
  }, []);

  // Pre-load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakCurrentLesson = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch {}
    if (!voiceEnabled) return;

    const fullScript = isEn ? current.narrationEn : current.narration;
    const utterance = new SpeechSynthesisUtterance(fullScript);

    // Dynamic voice selection
    const voices = window.speechSynthesis.getVoices();
    if (isEn) {
      const enVoice = voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    } else {
      const esVoice =
        voices.find((v) => v.lang === 'es-CO') ||
        voices.find((v) => v.lang === 'es-419') ||
        voices.find((v) => v.lang.startsWith('es-') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Sabina') || v.name.includes('Paulina') || v.name.includes('Helena') || v.name.includes('Jorge') || v.name.includes('Alvaro') || v.name.includes('Elvira'))) ||
        voices.find((v) => v.lang.startsWith('es-')) ||
        voices.find((v) => v.lang.startsWith('es'));
      if (esVoice) utterance.voice = esVoice;
      utterance.lang = 'es-CO';
    }

    utterance.rate = 0.94; // Didactic and clear cadence
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis notice:', e);
      }
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);

    // Keep voice alive in long texts (resolves Chrome speech pause bug)
    const resumeLoop = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      } else {
        clearInterval(resumeLoop);
      }
    }, 4000);
  }, [voiceEnabled, isEn, current]);

  // Video progress loop
  useEffect(() => {
    if (!isPlaying) {
      stopSpeaking();
      return;
    }

    // Start speaking when playing begins
    speakCurrentLesson();

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsPlaying(false);
          stopSpeaking();
          soundEngine.playSuccess();
          return 0;
        }
        return p + 0.45;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, speakCurrentLesson, stopSpeaking]);

  // Stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const togglePlay = () => {
    soundEngine.playClick();
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeaking();
    } else {
      setIsPlaying(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.resume();
        } catch {}
      }
    }
  };

  const handleLessonChange = (id: string) => {
    soundEngine.playClick();
    stopSpeaking();
    setActiveLessonId(id);
    setProgress(0);
    setIsPlaying(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }
  };

  const toggleVoice = () => {
    soundEngine.playClick();
    if (voiceEnabled) {
      setVoiceEnabled(false);
      stopSpeaking();
    } else {
      setVoiceEnabled(true);
      if (isPlaying) {
        setTimeout(() => speakCurrentLesson(), 100);
      }
    }
  };

  const handleReplayVoice = () => {
    soundEngine.playClick();
    if (!voiceEnabled) setVoiceEnabled(true);
    speakCurrentLesson();
  };

  const currentDisplayTitle = isEn && current.titleEn ? current.titleEn : current.title;
  const currentDisplaySummary = isEn && current.summaryEn ? current.summaryEn : current.summary;
  const currentDisplayBadge = isEn && current.badgeEn ? current.badgeEn : current.badge;
  const currentNarrationText = isEn ? current.narrationEn : current.narration;

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0A1931] dark:via-[#071326] dark:to-[#050B14] border-2 border-slate-200 dark:border-[#00AFFF]/30 shadow-xl dark:shadow-[0_0_40px_rgba(0,175,255,0.15)] p-5 sm:p-8 text-slate-900 dark:text-white transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AFFF]/15 border border-[#00AFFF]/30 text-[#0052cc] dark:text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-2">
            <Film size={13} className="text-[#059669] dark:text-[#00FF88]" />
            <span>{isEn ? 'AUDIOVISUAL CAPSULES • VOICE NARRATION' : 'CÁPSULAS AUDIOVISUALES • CON VOZ NARRADORA'}</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Cápsulas Multimedia de <span className="text-[#0052cc] dark:text-[#00AFFF]">Educación Vial</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
            {isEn 
              ? 'Interactive road safety animations with synchronized didactic voice narration reading each lesson aloud.'
              : 'Producción audiovisual interactiva con animaciones de normas viales y voz explicativa que lee cada lección en voz alta.'}
          </p>
        </div>

        {/* Global Voice Status Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              voiceEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
            title={voiceEnabled ? 'Voz activada (clic para silenciar)' : 'Voz desactivada (clic para activar)'}
          >
            {voiceEnabled ? (
              <Volume2 size={15} className={isSpeaking ? 'text-emerald-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'} />
            ) : (
              <VolumeX size={15} />
            )}
            <span>{voiceEnabled ? 'Voz Narrador: Activada' : 'Voz Narrador: Silenciada'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Screen & Lesson Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        
        {/* The Interactive Video Canvas Player (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl overflow-hidden bg-black border-2 border-slate-700 relative shadow-2xl">
          
          {/* Animated Visual Canvas Area */}
          <div className="relative w-full h-72 sm:h-96 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#050B14] via-[#0A1931] to-[#020617] select-none">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00AFFF_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Dynamic Animated Scene Graphic */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg">
              <motion.div
                animate={isPlaying ? { scale: [1, 1.08, 1], rotate: [0, 1, -1, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-3 shadow-2xl border-2"
                style={{
                  backgroundColor: `${current.color}20`,
                  borderColor: current.color,
                  boxShadow: `0 0 25px ${current.color}60`
                }}
              >
                <Film size={34} style={{ color: current.color }} />
              </motion.div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {isPlaying ? 'REPRODUCIENDO CÁPSULA FORMATIVA' : 'CÁPSULA EN PAUSA'}
                </span>
                {isSpeaking && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#00FF88] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
                    <Mic size={10} />
                    <span>Leyendo con voz</span>
                  </span>
                )}
              </div>

              <h4 className="text-lg sm:text-2xl font-black text-white mt-1">
                {currentDisplayTitle}
              </h4>
              <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed max-w-md">
                {currentDisplaySummary}
              </p>

              {/* Sound Waveform Visualizer (Active during play) */}
              {isPlaying && (
                <div className="flex items-center gap-1.5 mt-3">
                  {[18, 36, 24, 48, 30, 42, 20, 38, 26, 44, 22, 34].map((h, idx) => (
                    <motion.span
                      key={idx}
                      animate={isSpeaking ? { height: [8, h, 8] } : { height: 10 }}
                      transition={{
                        duration: 0.5 + (idx % 3) * 0.15,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="w-1.5 rounded-full transition-all"
                      style={{ backgroundColor: isSpeaking ? '#00FF88' : current.color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Center Play Overlay Trigger when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#00AFFF]/90 hover:bg-[#00AFFF] text-slate-950 flex items-center justify-center shadow-[0_0_30px_#00AFFF] hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                title="Reproducir video y escuchar narración"
              >
                <Play size={28} className="ml-1 fill-current" />
              </button>
            )}

            {/* Live Subtitles / Captions Box showing what the voice is saying */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-20 bg-black/85 backdrop-blur-md rounded-2xl p-2.5 px-3.5 border border-slate-700/80 shadow-xl flex items-center gap-3 text-xs text-white">
              <div className="w-7 h-7 rounded-xl bg-[#00AFFF]/20 flex items-center justify-center shrink-0 border border-[#00AFFF]/30">
                {voiceEnabled ? (
                  <Volume2 size={15} className={isSpeaking ? 'text-[#00FF88] animate-pulse' : 'text-[#00AFFF]'} />
                ) : (
                  <VolumeX size={15} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  <span className="text-[#00AFFF]">VOZ DEL NARRADOR</span>
                  {isSpeaking && (
                    <span className="inline-flex items-center gap-1 text-[#00FF88] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                      Leyendo ahora
                    </span>
                  )}
                  {!voiceEnabled && (
                    <span className="text-amber-400">(Voz silenciada en el reproductor)</span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 mt-0.5 leading-snug font-medium italic">
                  "{currentNarrationText}"
                </p>
              </div>
            </div>

            {/* Time Stamp Overlay */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300">
              {Math.floor((progress / 100) * 225)}s / 225s
            </div>
          </div>

          {/* Interactive Player Controls Toolbar */}
          <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
            {/* Progress Scrub Bar */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, newPct)));
                if (isPlaying) {
                  speakCurrentLesson();
                }
              }}
              className="w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group"
            >
              <div 
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, #00AFFF, ${current.color})`
                }}
              />
            </div>

            {/* Bottom Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 px-3 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} className="fill-current" />}
                  <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProgress(0);
                    soundEngine.playClick();
                    if (isPlaying) {
                      speakCurrentLesson();
                    }
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar video desde el inicio"
                >
                  <RotateCcw size={15} />
                </button>

                {/* Direct Voice Re-read Button */}
                <button
                  type="button"
                  onClick={handleReplayVoice}
                  className="p-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700"
                  title="Releer la lección en voz alta"
                >
                  <Volume2 size={14} className="text-[#00AFFF]" />
                  <span className="hidden sm:inline">Leer en voz alta</span>
                </button>

                {/* Voice Toggle Mute Button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                    voiceEnabled
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={voiceEnabled ? 'Silenciar voz' : 'Activar voz'}
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  <span>{voiceEnabled ? 'Voz ON' : 'Voz OFF'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#00FF88] flex items-center gap-1">
                  <CheckCircle size={13} />
                  <span>Audio & Video HD • 60 FPS</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Playlist Selector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              SELECCIONA LECCIÓN MULTIMEDIA
            </span>
            <span className="text-[11px] font-bold text-[#0052cc] dark:text-[#00AFFF]">
              {lessons.length} Lecciones con voz
            </span>
          </div>

          {lessons.map((lesson) => {
            const isSelected = lesson.id === activeLessonId;
            const itemTitle = isEn && lesson.titleEn ? lesson.titleEn : lesson.title;
            const itemBadge = isEn && lesson.badgeEn ? lesson.badgeEn : lesson.badge;
            const itemRule = isEn && lesson.keyRuleEn ? lesson.keyRuleEn : lesson.keyRule;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleLessonChange(lesson.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900/95 border-[#00AFFF] shadow-[0_0_18px_rgba(0,175,255,0.25)] scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${lesson.color}20`, color: lesson.color }}>
                    {itemBadge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Volume2 size={12} className={isSelected && isSpeaking ? 'text-[#00FF88] animate-pulse' : 'text-slate-400'} />
                    <span className="text-xs font-mono text-slate-400">
                      {lesson.duration}
                    </span>
                  </div>
                </div>

                <h5 className="text-sm font-bold text-white leading-snug">
                  {itemTitle}
                </h5>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {itemRule}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
