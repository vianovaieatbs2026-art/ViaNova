import React, { useState, useEffect } from 'react';
import { OwlAvatar3D, OwlAnimationState } from './OwlAvatar3D';
import { ScreenId } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface OwlAssistantWidgetProps {
  onNavigate?: (screen: ScreenId) => void;
  currentScreen?: ScreenId;
}

export const OwlAssistantWidget: React.FC<OwlAssistantWidgetProps> = ({ 
  currentScreen = 'inicio'
}) => {
  const [owlAnimation, setOwlAnimation] = useState<OwlAnimationState>('idle');
  const [clickCount, setClickCount] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // Friendly greeting animation when changing screens
  useEffect(() => {
    setIsBubbleVisible(true);
    setOwlAnimation('wave');
    const timer = setTimeout(() => {
      setOwlAnimation('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentScreen]);

  // Direct interaction on the 3D owl avatar without opening any dialogs or panels
  const handleAvatarClick = () => {
    soundEngine.playClick();
    const nextAnimations: OwlAnimationState[] = ['celebrate', 'wave', 'talk'];
    const selectedAnim = nextAnimations[clickCount % nextAnimations.length];
    setClickCount((prev) => prev + 1);
    setOwlAnimation(selectedAnim);
    setTimeout(() => {
      setOwlAnimation('idle');
    }, 2500);
  };

  return (
    <aside 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none font-sans"
      aria-label="Mascota animada ViaNova"
    >
      <div className="relative flex items-end flex-col">
        {/* Animated Friendly Speech Bubble (dismissable, no modal) */}
        {isBubbleVisible && (
          <div 
            onClick={() => {
              handleAvatarClick();
              setIsBubbleVisible(false);
            }}
            className="mb-2 mr-1 bg-white dark:bg-[#0a192f] text-slate-800 dark:text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-sky-300 dark:border-sky-500/40 text-xs font-bold flex items-center gap-2.5 cursor-pointer hover:scale-102 transition-all max-w-[270px]"
            title="Haz clic en la mascota"
          >
            <span className="text-xl shrink-0">🦉</span>
            <div className="leading-tight">
              <p className="font-extrabold text-[#0052cc] dark:text-sky-400 text-xs flex items-center gap-1">
                <span>Búho ViaNova</span>
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
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-sm font-bold leading-none p-1"
              title="Cerrar saludo"
              aria-label="Cerrar saludo"
            >
              ×
            </button>
          </div>
        )}

        {/* 3D Owl Round Floating Avatar (Only the avatar remains) */}
        <button
          type="button"
          id="vianova-owl-mascot-btn"
          onClick={handleAvatarClick}
          onMouseEnter={() => setOwlAnimation('wave')}
          onMouseLeave={() => setOwlAnimation('idle')}
          className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#0052cc] via-[#00AFFF] to-[#facc15] shadow-[0_8px_25px_rgba(0,82,204,0.4)] hover:shadow-[0_10px_35px_rgba(0,175,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-visible"
          aria-label="Búho ViaNova"
          title="Búho ViaNova • Mascota de Seguridad Vial"
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
    </aside>
  );
};
