import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Heart,
  Smile,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Car
} from 'lucide-react';
import { OwlAvatar3D, OwlAnimationState } from './OwlAvatar3D';
import { ScreenId } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { soundEngine } from '../utils/soundEffects';

interface OwlAssistantWidgetProps {
  onNavigate?: (screen: ScreenId) => void;
  currentScreen?: ScreenId;
}

export const OwlAssistantWidget: React.FC<OwlAssistantWidgetProps> = ({ 
  onNavigate,
  currentScreen = 'inicio'
}) => {
  const { t } = useThemeLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [owlAnimation, setOwlAnimation] = useState<OwlAnimationState>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // Friendly educational tips curated for safe road mobility in Colombia
  const roadSafetyTips = [
    {
      title: 'Ley Julián Esteban (Ley 2251)',
      text: 'En zonas escolares y residenciales de Colombia el límite estricto es 30 km/h, y en vías urbanas 50 km/h.',
      screen: 'educacion_vial',
      icon: '⚡'
    },
    {
      title: 'Distancia con Ciclistas',
      text: 'Al adelantar a un ciclista, conserva al menos 1.5 metros de distancia lateral para evitar siniestros.',
      screen: 'educacion_vial',
      icon: '🚲'
    },
    {
      title: 'Prelación en Glorietas (Art. 70)',
      text: 'El vehículo que ya circula dentro de la glorieta tiene prelación absoluta sobre los que van a ingresar.',
      screen: 'educacion_vial',
      icon: '🔄'
    },
    {
      title: 'Señales Reglamentarias',
      text: 'Las señales rojas (como el PARE SR-01) son órdenes estrictas. No acatarlas genera inmovilización o comparendo.',
      screen: 'senales',
      icon: '🛑'
    },
    {
      title: 'Simulador CEA / RUNT',
      text: 'Lee con atención cada enunciado. El examen oficial evalúa normas, señales y toma de decisiones preventivas.',
      screen: 'simulador',
      icon: '📝'
    },
    {
      title: 'Cero Alcohol al Conducir',
      text: 'En Colombia rige la Cero Tolerancia (Ley 1696). Si vas a conducir, entrega las llaves.',
      screen: 'inicio',
      icon: '🛡️'
    }
  ];

  // Pick contextual tip based on screen or rotation
  const activeTip = roadSafetyTips[currentTipIndex % roadSafetyTips.length];

  // Auto-dismiss bubble after 10s if closed, or show on screen change
  useEffect(() => {
    setIsBubbleVisible(true);
    setOwlAnimation('wave');
    const timer = setTimeout(() => {
      setOwlAnimation('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Voice speech synthesis helper (polite friendly speech)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  const handleOpenMascot = () => {
    soundEngine.playClick();
    setIsOpen(true);
    setIsBubbleVisible(false);
    setOwlAnimation('celebrate');
    setTimeout(() => setOwlAnimation('idle'), 2500);
  };

  const handleCloseMascot = () => {
    soundEngine.playClick();
    setIsOpen(false);
    setOwlAnimation('idle');
  };

  const triggerAnimation = (state: OwlAnimationState, speech?: string) => {
    soundEngine.playClick();
    setOwlAnimation(state);
    if (speech) speakText(speech);
    setTimeout(() => setOwlAnimation('idle'), 3000);
  };

  const nextTip = () => {
    soundEngine.playClick();
    const nextIdx = (currentTipIndex + 1) % roadSafetyTips.length;
    setCurrentTipIndex(nextIdx);
    setOwlAnimation('think');
    const tip = roadSafetyTips[nextIdx];
    speakText(`${tip.title}. ${tip.text}`);
    setTimeout(() => setOwlAnimation('idle'), 2000);
  };

  return (
    <aside 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none font-sans"
      aria-label="Mascota animada ViaNova"
    >
      {/* ================= 1. FLOATING COMPANION (MINIMIZED) ================= */}
      {!isOpen && (
        <div className="relative flex items-end flex-col">
          {/* Animated Friendly Speech Bubble */}
          {isBubbleVisible && (
            <div 
              onClick={handleOpenMascot}
              className="mb-2 mr-1 bg-white dark:bg-[#0a192f] text-slate-800 dark:text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-sky-300 dark:border-sky-500/40 text-xs font-bold flex items-center gap-2.5 cursor-pointer hover:scale-102 transition-all max-w-[270px]"
            >
              <span className="text-xl shrink-0">🦉</span>
              <div className="leading-tight">
                <p className="font-extrabold text-[#0052cc] dark:text-sky-400 text-xs flex items-center gap-1">
                  <span>Mascota ViaNova</span>
                  <span className="text-[10px] text-amber-500 font-bold">✨</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  ¡Hola! Te acompaño en tu aprendizaje vial.
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBubbleVisible(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-sm font-bold"
                title="Cerrar globo"
              >
                ×
              </button>
            </div>
          )}

          {/* 3D Owl Round Floating Button */}
          <button
            type="button"
            id="vianova-owl-mascot-btn"
            onClick={handleOpenMascot}
            onMouseEnter={() => setOwlAnimation('wave')}
            onMouseLeave={() => setOwlAnimation('idle')}
            className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#0052cc] via-[#00AFFF] to-[#facc15] shadow-[0_8px_25px_rgba(0,82,204,0.4)] hover:shadow-[0_10px_35px_rgba(0,175,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-visible"
            aria-label="Interactuar con la Mascota ViaNova"
            title="Búho ViaNova • Mascota de Movilidad y Seguridad Vial"
          >
            {/* Soft Ambient Glow */}
            <span className="absolute inset-0 rounded-full bg-[#00AFFF]/25 animate-ping pointer-events-none" />

            {/* Inner background container */}
            <div className="w-full h-full rounded-full bg-[#0a192f] flex items-center justify-center relative overflow-hidden border-2 border-white/20">
              <div className="absolute inset-0 bg-radial from-sky-500/20 via-transparent to-transparent pointer-events-none" />
              
              {/* 3D Owl Canvas */}
              <OwlAvatar3D 
                animationState={owlAnimation}
                size="sm"
                interactive={true}
                className="pointer-events-none"
              />

              {/* Online status dot */}
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a192f] shadow-xs" />
            </div>
          </button>
        </div>
      )}

      {/* ================= 2. MASCOT COMPANION PANEL (EXPANDED) ================= */}
      {isOpen && (
        <div 
          className="w-[92vw] sm:w-[360px] bg-white dark:bg-[#0b1626] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in transition-all duration-300"
          role="complementary"
          aria-labelledby="mascot-title"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0052cc] via-[#0a2540] to-[#0f172a] text-white flex items-center justify-between border-b border-white/10 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                <OwlAvatar3D animationState={owlAnimation} size="xs" interactive={true} />
              </div>
              <div>
                <h3 id="mascot-title" className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>Búho ViaNova</span>
                  <span className="text-amber-300 text-xs">🦉✨</span>
                </h3>
                <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">
                  Mascota de Seguridad Vial
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-200 hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? 'Silenciar voz' : 'Activar voz'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                type="button"
                onClick={handleCloseMascot}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Minimizar mascota"
              >
                <Minimize2 size={15} />
              </button>
            </div>
          </div>

          {/* Central 3D Interactive Stage */}
          <div className="p-4 flex flex-col items-center justify-center text-center bg-radial from-sky-50 via-white to-slate-50 dark:from-sky-950/20 dark:via-[#0b1626] dark:to-[#070e18]">
            <div 
              onClick={() => triggerAnimation('celebrate', '¡Vamos a ser los conductores más seguros de Colombia!')}
              className="w-32 h-32 rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner cursor-pointer hover:scale-103 transition-transform"
              title="Haz clic para que ViaNova celebre"
            >
              <OwlAvatar3D animationState={owlAnimation} size="md" interactive={true} />
            </div>

            <p className="font-extrabold text-xs text-slate-800 dark:text-white mt-2.5">
              Tu compañero en la vía
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px] mt-0.5">
              Te acompaño visualmente mientras aprendes normas, exploras señales y te preparas para tu licencia.
            </p>
          </div>

          {/* Interactive Animations Controls (Fun & Expressive) */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#070e18] border-t border-b border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 text-center">
              Reacciones de la Mascota
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => triggerAnimation('wave', '¡Hola! Qué gusto verte aprendiendo seguridad vial.')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>👋</span>
                <span>Saludar</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAnimation('celebrate', '¡Excelente trabajo! Cada norma aprendida salva vidas.')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>🎉</span>
                <span>Celebrar</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAnimation('think', 'Mmm... Analicemos bien la situación antes de actuar.')}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>🤔</span>
                <span>Pensar</span>
              </button>
            </div>
          </div>

          {/* Practical Road Safety Tip Card */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider flex items-center gap-1">
                <Lightbulb size={12} />
                <span>Tip Vial del Búho</span>
              </span>
              <button
                type="button"
                onClick={nextTip}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                title="Cambiar tip"
              >
                <span>Otro consejo</span>
                <RotateCcw size={11} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                <span>{activeTip.icon}</span>
                <span>{activeTip.title}</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeTip.text}
              </p>
            </div>

            {/* Quick Navigation recommendation */}
            {onNavigate && (
              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('educacion_vial');
                    setIsOpen(false);
                  }}
                  className="text-[11px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen size={12} />
                  <span>Ir a Aprende</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('senales');
                    setIsOpen(false);
                  }}
                  className="text-[11px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Car size={12} />
                  <span>Ver Señales</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
