import React from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  Bike, 
  MapPin, 
  Navigation2, 
  Settings2,
  Cpu,
  Compass
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const FloatingDecorations: React.FC = () => {
  const { t } = useThemeLanguage();
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Neon Glowing Orbs (Atmospheric Depth) */}
      <div 
        className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-[#00AFFF]/15 blur-[100px]"
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/3 right-[-100px] w-96 h-96 rounded-full bg-[#00FF88]/12 blur-[110px]" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-[#FF6B00]/10 blur-[120px]" 
        aria-hidden="true" 
      />

      {/* 2. Rotating Tech Gears (Engranajes Giratorios SVG) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-[8%] opacity-25 dark:opacity-30 text-[#00AFFF]"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 35c-8.28 0-15 6.72-15 15s6.72 15 15 15 15-6.72 15-15-6.72-15-15-15zm38.16 11.23l-5.83-.97c-.45-1.74-1.1-3.41-1.92-4.98l3.66-4.63c1.23-1.55 1.07-3.79-.37-5.14l-5.4-5.06c-1.44-1.35-3.68-1.35-5.05-.01l-4.14 4.05c-1.47-.94-3.05-1.7-4.72-2.27l-1.31-5.69c-.43-1.89-2.12-3.26-4.06-3.26h-7.62c-1.94 0-3.63 1.37-4.06 3.26l-1.31 5.69c-1.67.57-3.25 1.33-4.72 2.27l-4.14-4.05c-1.37-1.34-3.61-1.34-5.05.01l-5.4 5.06c-1.44 1.35-1.6 3.59-.37 5.14l3.66 4.63c-.82 1.57-1.47 3.24-1.92 4.98l-5.83.97c-1.93.32-3.37 1.95-3.37 3.91v7.16c0 1.96 1.44 3.59 3.37 3.91l5.83.97c.45 1.74 1.1 3.41 1.92 4.98l-3.66 4.63c-1.23 1.55-1.07 3.79.37 5.14l5.4 5.06c1.44 1.35 3.68 1.35 5.05.01l4.14-4.05c1.47.94 3.05 1.7 4.72 2.27l1.31 5.69c.43 1.89 2.12 3.26 4.06 3.26h7.62c1.94 0 3.63-1.37 4.06-3.26l1.31-5.69c1.67-.57 3.25-1.33 4.72-2.27l4.14 4.05c1.37 1.34 3.61 1.34 5.05-.01l5.4-5.06c1.44-1.35 1.6-3.59.37-5.14l-3.66-4.63c.82-1.57 1.47-3.24 1.92-4.98l5.83-.97c1.93-.32 3.37-1.95 3.37-3.91v-7.16c0-1.96-1.44-3.59-3.37-3.91z"/>
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute top-36 right-[17%] opacity-20 text-[#00FF88]"
      >
        <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 38c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12-5.37-12-12-12zm30 12c0-1.5-.15-2.95-.42-4.37l5.45-3.8-4.24-7.35-6.38 2.05c-2.12-2.18-4.71-3.91-7.62-5.03l-1.42-6.5h-8.48l-1.42 6.5c-2.91 1.12-5.5 2.85-7.62 5.03l-6.38-2.05-4.24 7.35 5.45 3.8c-.27 1.42-.42 2.87-.42 4.37s.15 2.95.42 4.37l-5.45 3.8 4.24 7.35 6.38-2.05c2.12 2.18 4.71 3.91 7.62 5.03l1.42 6.5h8.48l1.42-6.5c2.91-1.12 5.5-2.85 7.62-5.03l6.38 2.05 4.24-7.35-5.45-3.8c.27-1.42.42-2.87.42-4.37z"/>
        </svg>
      </motion.div>

      {/* 3. Floating Mobility Badge: Carro con telemetría */}
      <motion.div
        animate={{
          y: [-12, 14, -12],
          x: [-6, 8, -6],
          rotate: [-2, 3, -2]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex items-center gap-2.5 absolute top-28 left-[4%] lg:left-[6%] p-3 rounded-2xl bg-white/95 dark:bg-[#0c1b33]/95 backdrop-blur-md border-2 border-sky-400/60 dark:border-[#00AFFF]/50 shadow-lg dark:shadow-[0_0_20px_rgba(0,175,255,0.25)] text-[#0052cc] dark:text-[#00AFFF]"
      >
        <div className="p-2 rounded-xl bg-sky-100 dark:bg-[#00AFFF]/15">
          <Car size={22} className="text-[#0052cc] dark:text-[#00AFFF]" />
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0052cc] dark:text-sky-300 block leading-tight">
            {t('float_telemetry', 'Telemetría')}
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {t('float_traffic_flow', 'Tránsito Fluido')}
          </span>
        </div>
      </motion.div>

      {/* 4. Floating Mobility Badge: Motocicleta */}
      <motion.div
        animate={{
          y: [14, -10, 14],
          x: [5, -7, 5],
          rotate: [2, -2, 2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="hidden sm:flex items-center gap-2.5 absolute bottom-36 right-[4%] lg:right-[7%] p-3 rounded-2xl bg-white/95 dark:bg-[#0c1b33]/95 backdrop-blur-md border-2 border-emerald-400/60 dark:border-[#00FF88]/50 shadow-lg dark:shadow-[0_0_20px_rgba(0,255,136,0.22)] text-emerald-600 dark:text-[#00FF88]"
      >
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-[#00FF88]/15">
          <Bike size={22} className="text-emerald-600 dark:text-[#00FF88]" />
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block leading-tight">
            {t('float_two_wheels', 'Movilidad 2 Ruedas')}
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {t('float_helmet_law', 'Casco Reglamentario')}
          </span>
        </div>
      </motion.div>

      {/* 5. Floating Mobility Badge: Semáforo Inteligente */}
      <motion.div
        animate={{
          y: [-8, 10, -8],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="hidden sm:flex items-center gap-2.5 absolute top-72 left-[4%] lg:left-[8%] p-3 rounded-2xl bg-white/95 dark:bg-[#0c1b33]/95 backdrop-blur-md border-2 border-amber-400/60 dark:border-[#FF6B00]/50 shadow-lg dark:shadow-[0_0_20px_rgba(255,107,0,0.2)]"
      >
        <div className="flex flex-col gap-1 p-1.5 bg-slate-900 rounded-lg border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/40"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-pulse"></span>
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-[#FF6B00] block leading-tight">
            {t('float_traffic_light', 'Semáforo IoT')}
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            {t('float_safe_crossing', 'Paso Seguro: 18s')}
          </span>
        </div>
      </motion.div>

      {/* 6. Animated Circuit Route Lines (Líneas de Ruta Vial tipo GPS) */}
      <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="routeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00AFFF" />
            <stop offset="50%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
        <path
          d="M 50 150 Q 300 80, 550 220 T 1100 180 T 1600 350"
          fill="none"
          stroke="url(#routeLineGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 8"
          className="animate-[dash_25s_linear_infinite]"
        />
        <path
          d="M 100 650 Q 400 450, 800 600 T 1400 520"
          fill="none"
          stroke="#00AFFF"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};
