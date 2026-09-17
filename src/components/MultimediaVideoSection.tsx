import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Film,
  CheckCircle,
  Eye,
  Radio,
  Layers
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface LessonVideo {
  id: string;
  title: string;
  duration: string;
  badge: string;
  color: string;
  summary: string;
  keyRule: string;
  sceneTheme: 'interseccion' | 'puntos_ciegos' | 'frenado';
}

export const MultimediaVideoSection: React.FC = () => {
  const [activeLessonId, setActiveLessonId] = useState<string>('decalogo');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(18);

  const lessons: LessonVideo[] = [
    {
      id: 'decalogo',
      title: 'Decálogo Vial y Ley Julián Esteban (Ley 2251)',
      duration: '03:45 min',
      badge: 'NORMATIVA COLOMBIA',
      color: '#00AFFF',
      summary: 'Límites de velocidad actualizados en Colombia: 50 km/h en zonas urbanas y 30 km/h en zonas escolares y residenciales.',
      keyRule: 'Respeto prioritario al actor más vulnerable: peatones y ciclistas.',
      sceneTheme: 'interseccion'
    },
    {
      id: 'puntos_ciegos',
      title: 'Puntos Ciegos en Tractocamiones y Motos',
      duration: '02:30 min',
      badge: 'FÍSICA & ESPACIAL',
      color: '#FF6B00',
      summary: 'Identificación visual de las 4 zonas ciegas críticas en vehículos de carga pesada y cómo los motociclistas deben posicionarse.',
      keyRule: 'Si tú no ves los espejos del conductor de carga, él no puede verte.',
      sceneTheme: 'puntos_ciegos'
    },
    {
      id: 'frenado',
      title: 'Técnicas de Frenado Seguro y Aquaplaning',
      duration: '04:10 min',
      badge: 'PREVENCIÓN ACTIVA',
      color: '#00FF88',
      summary: 'Distancia de reacción y distancia de frenado en piso seco vs. piso mojado. Regla de los 3 segundos de distancia.',
      keyRule: 'En piso mojado, duplica la distancia de seguimiento a 6 segundos.',
      sceneTheme: 'frenado'
    }
  ];

  const current = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setIsPlaying(false);
          soundEngine.playSuccess();
          return 0;
        }
        return p + 0.6;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    soundEngine.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleLessonChange = (id: string) => {
    soundEngine.playClick();
    setActiveLessonId(id);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0A1931] dark:via-[#071326] dark:to-[#050B14] border-2 border-slate-200 dark:border-[#00AFFF]/30 shadow-xl dark:shadow-[0_0_40px_rgba(0,175,255,0.15)] p-5 sm:p-8 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AFFF]/15 border border-[#00AFFF]/30 text-[#0052cc] dark:text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-2">
            <Film size={13} className="text-[#059669] dark:text-[#00FF88]" />
            <span>SENA 220501102 • INTEGRAR ELEMENTOS MULTIMEDIA</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Cápsulas Multimedia de <span className="text-[#0052cc] dark:text-[#00AFFF]">Educación Vial</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
            Producción audiovisual interactiva con animaciones explicativas de las normas de tránsito.
          </p>
        </div>
      </div>

      {/* Main Video Screen & Lesson Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        
        {/* The Interactive Video Canvas Player (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl overflow-hidden bg-black border-2 border-slate-700 relative shadow-2xl">
          
          {/* Animated Visual Canvas Area */}
          <div className="relative w-full h-64 sm:h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#050B14] via-[#0A1931] to-[#020617] select-none">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00AFFF_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Dynamic Animated Scene Graphic */}
            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md">
              <motion.div
                animate={isPlaying ? { scale: [1, 1.06, 1], rotate: [0, 1, -1, 0] } : {}}
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

              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                REPRODUCIENDO CÁPSULA FORMATIVA
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                {current.title}
              </h4>
              <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                {current.summary}
              </p>

              {/* Sound Waveform Visualizer (Active during play) */}
              {isPlaying && (
                <div className="flex items-center gap-1.5 mt-4">
                  {[18, 36, 24, 48, 30, 42, 20, 38, 26, 44].map((h, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ height: [8, h, 8] }}
                      transition={{
                        duration: 0.6 + (idx % 3) * 0.2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="w-1.5 rounded-full"
                      style={{ backgroundColor: current.color }}
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
                title="Reproducir video"
              >
                <Play size={28} className="ml-1 fill-current" />
              </button>
            )}

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
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProgress(0);
                    soundEngine.playClick();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw size={15} />
                </button>

                <span className="text-xs font-bold text-slate-400">
                  {isPlaying ? 'Transmitiendo Video...' : 'En pausa'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#00FF88] flex items-center gap-1">
                  <CheckCircle size={13} />
                  <span>HD 1080p • 60 FPS</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Playlist Selector (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            SELECCIONA LECCIÓN MULTIMEDIA
          </span>

          {lessons.map((lesson) => {
            const isSelected = lesson.id === activeLessonId;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleLessonChange(lesson.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900/90 border-[#00AFFF] shadow-[0_0_18px_rgba(0,175,255,0.25)] scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${lesson.color}20`, color: lesson.color }}>
                    {lesson.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {lesson.duration}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-white leading-snug">
                  {lesson.title}
                </h5>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {lesson.keyRule}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
