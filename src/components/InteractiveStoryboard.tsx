import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause,
  Award,
  Sparkles,
  CheckCircle2,
  Film
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

interface StoryboardStep {
  id: number;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  color: string;
  badgeColor: string;
  description: string;
  keyFeature: string;
  visualScene: {
    illustration: string;
    subElements: string[];
  };
}

export const InteractiveStoryboard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps: StoryboardStep[] = [
    {
      id: 1,
      title: 'Paso 1: Diagnóstico y Registro',
      tagline: 'PERFIL Y CATEGORÍA DE LICENCIA',
      icon: <UserCheck size={26} />,
      color: '#00AFFF',
      badgeColor: 'bg-[#00AFFF]/15 text-[#00AFFF] border-[#00AFFF]/40',
      description: 'El usuario se registra y selecciona su categoría (A1, A2, B1, B2, C1). El sistema realiza una evaluación diagnóstica de conocimientos previos sobre normas colombianas.',
      keyFeature: 'Diagnóstico adaptativo en menos de 2 minutos',
      visualScene: {
        illustration: 'REGISTRO_BIOMETRICO',
        subElements: ['Formulario Rápido', 'Selección de Vehículo', 'Score Inicial de Seguridad']
      }
    },
    {
      id: 2,
      title: 'Paso 2: Escuela Digital Interactiva',
      tagline: 'CONTENIDO MULTIMEDIA SENA 524704',
      icon: <BookOpen size={26} />,
      color: '#00FF88',
      badgeColor: 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/40',
      description: 'Acceso a módulos con infografías interactivas, casos de estudio en video, señales reglamentarias 3D y reglas de prelación en glorietas e intersecciones.',
      keyFeature: 'Microlearning con retroalimentación instantánea',
      visualScene: {
        illustration: 'MODULOS_INTERACTIVOS',
        subElements: ['Animación de Glorietas', 'Puntos Ciegos 3D', 'Casos Ley Julián Esteban']
      }
    },
    {
      id: 3,
      title: 'Paso 3: Simulador Oficial CEA / RUNT',
      tagline: 'BANCO OFICIAL DE 30 PREGUNTAS',
      icon: <GraduationCap size={26} />,
      color: '#FF6B00',
      badgeColor: 'bg-[#FF6B00]/15 text-[#FF6B00] border-[#FF6B00]/40',
      description: 'Entrenamiento bajo condiciones reales de examen teórico: cronómetro regresivo, preguntas aleatorias categorizadas y revisión técnica de cada respuesta errada.',
      keyFeature: 'Tasa de aprobación superior al 94%',
      visualScene: {
        illustration: 'SIMULADOR_CRONOMETRO',
        subElements: ['Cronómetro 40 min', 'Banco Aleatorio', 'Explicación Jurídica']
      }
    },
    {
      id: 4,
      title: 'Paso 4: Certificación y Reportes en Vivo',
      tagline: 'MOVILIDAD COLABORATIVA VIAL',
      icon: <MapPin size={26} />,
      color: '#00AFFF',
      badgeColor: 'bg-[#00AFFF]/15 text-[#00AFFF] border-[#00AFFF]/40',
      description: 'Generación de la credencial digital de conductor seguro y participación activa en el mapa georreferenciado de incidentes, baches y puntos críticos en Colombia.',
      keyFeature: 'Impacto real en la reducción de siniestralidad',
      visualScene: {
        illustration: 'MAPA_COMUNITARIO',
        subElements: ['Credencial Digital', 'Reportes Waze-style', 'Comunidad Segura']
      }
    }
  ];

  // Autoplay progression
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, steps.length]);

  const goToStep = (index: number) => {
    soundEngine.playClick();
    setActiveStep(index);
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    soundEngine.playClick();
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    soundEngine.playClick();
    setActiveStep((prev) => (prev + 1) % steps.length);
    setIsAutoPlaying(false);
  };

  const current = steps[activeStep];

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0A1931] via-[#071326] to-[#050B14] border-2 border-[#00FF88]/40 shadow-[0_0_35px_rgba(0,255,136,0.15)] p-5 sm:p-8 text-white relative">
      {/* Top Tagline */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-black uppercase tracking-wider mb-2">
            <Film size={13} className="text-[#00FF88]" />
            <span>STORYBOARD INTERACTIVO • CÓMO FUNCIONA VIANOVA</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            El Viaje del Conductor <span className="text-[#00FF88]">en 4 Escenas</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Metodología pedagógica diseñada bajo competencias SENA para transformar la cultura vial.
          </p>
        </div>

        {/* Autoplay & Navigation Steppers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isAutoPlaying ? 'Auto' : 'Pausado'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Anterior escena"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Siguiente escena"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 4 Steps Timeline Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-6">
        {steps.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goToStep(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)] scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isSelected && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1 bg-[#00FF88] shadow-[0_0_8px_#00FF88]"
                />
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                  {`0${s.id}`}
                </span>
                <span className="text-xs font-black truncate text-slate-200">
                  {s.title.replace(`Paso ${s.id}: `, '')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {s.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Storyboard Stage Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-950/70 p-5 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden"
        >
          {/* Left Explanation Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: `${current.color}20`, color: current.color, borderColor: `${current.color}40`, borderWidth: 1 }}>
              {current.icon}
              <span>{current.tagline}</span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {current.title}
            </h4>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              {current.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <Sparkles size={18} style={{ color: current.color }} className="shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Ventaja Clave</span>
                <span className="text-xs sm:text-sm font-bold text-white">{current.keyFeature}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {current.visualScene.subElements.map((el, i) => (
                <span 
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
                >
                  <CheckCircle2 size={13} style={{ color: current.color }} />
                  <span>{el}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Visual Storyboard Vignette Illustration */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-br from-[#0A1931] to-[#020617] border-2 p-6 flex flex-col items-center justify-center relative overflow-hidden text-center shadow-inner" style={{ borderColor: `${current.color}50` }}>
              
              {/* Glowing Background Ring */}
              <div 
                className="w-44 h-44 rounded-full blur-[50px] absolute pointer-events-none opacity-30" 
                style={{ backgroundColor: current.color }} 
              />

              {/* Storyboard Card Icon & Art */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-xl border"
                style={{ 
                  backgroundColor: `${current.color}15`, 
                  borderColor: current.color,
                  color: current.color,
                  boxShadow: `0 0 25px ${current.color}40`
                }}
              >
                {current.icon}
              </motion.div>

              <span className="text-xs font-black tracking-widest uppercase text-slate-400">
                ESCENA {current.id} / 04
              </span>
              <h5 className="text-lg font-black text-white mt-1">
                {current.title}
              </h5>

              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Interacción digital con retroalimentación en tiempo real para máxima retención pedagógica.
              </p>

              {/* Cinematic Corner Accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: current.color }} />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: current.color }} />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: current.color }} />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: current.color }} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
