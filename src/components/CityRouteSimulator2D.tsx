import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Car, 
  Bike, 
  Bus, 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  ShieldAlert, 
  Sparkles,
  Zap
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

type VehicleType = 'car' | 'bike' | 'bus';
type TrafficLight = 'green' | 'yellow' | 'red';

export const CityRouteSimulator2D: React.FC = () => {
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [isPlaying, setIsPlaying] = useState(true);
  const [trafficLight, setTrafficLight] = useState<TrafficLight>('green');
  const [progress, setProgress] = useState(15); // percentage along the road
  const [speed, setSpeed] = useState(50); // km/h
  const [modeTheme, setModeTheme] = useState<'neon' | 'cyberpunk'>('neon');

  // Realistic city animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Red light stopping zone near crosswalk (at 45% - 52%)
        if (trafficLight === 'red' && prev >= 40 && prev <= 46) {
          setSpeed(0);
          return prev;
        }

        let targetSpeed = 50;
        if (trafficLight === 'yellow') targetSpeed = 25;
        if (trafficLight === 'red') targetSpeed = 10;
        if (trafficLight === 'green') targetSpeed = vehicle === 'bike' ? 55 : vehicle === 'bus' ? 42 : 60;

        setSpeed(targetSpeed);
        const step = (targetSpeed / 60) * 0.45;
        const next = prev + step;
        return next > 100 ? 0 : next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, trafficLight, vehicle]);

  const handleTrafficLightCycle = () => {
    const next: Record<TrafficLight, TrafficLight> = {
      green: 'yellow',
      yellow: 'red',
      red: 'green'
    };
    const newLight = next[trafficLight];
    setTrafficLight(newLight);
    soundEngine.playTrafficBeep(newLight);
  };

  const handleAccelerateBoost = () => {
    soundEngine.playVehicleAccelerate();
    setSpeed((s) => Math.min(80, s + 20));
    setProgress((p) => Math.min(99, p + 5));
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0A1931] dark:via-[#071326] dark:to-[#050B14] border-2 border-slate-200 dark:border-[#00AFFF]/40 shadow-xl dark:shadow-[0_0_35px_rgba(0,175,255,0.2)] p-4 sm:p-7 relative text-slate-900 dark:text-white transition-colors">
      {/* Top Header & HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AFFF]/15 dark:bg-[#00AFFF]/20 border border-[#00AFFF]/30 dark:border-[#00AFFF]/40 text-[#0052cc] dark:text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-2">
            <Zap size={13} className="text-[#059669] dark:text-[#00FF88] animate-bounce" />
            <span>SENA 250201026 • SECUENCIA ANIMADA 2D</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Ruta Inteligente <span className="text-[#0052cc] dark:text-[#00AFFF]">ViaNova 2D</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Simulador de tráfico urbano, semaforización adaptativa y respeto al paso peatonal.
          </p>
        </div>

        {/* Telemetry HUD */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Gauge size={16} className="text-[#0052cc] dark:text-[#00AFFF]" />
            <span>Velocidad:</span>
            <span className="font-mono text-base font-black text-emerald-600 dark:text-[#00FF88]">{speed}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">km/h</span>
          </div>
        </div>
      </div>

      {/* 2D Animated Canvas / Stage */}
      <div className="my-5 relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-[#020617] via-[#091833] to-[#0A1931] border border-slate-700/70 select-none">
        
        {/* Sky / Skyline Cityscape in background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
            {/* City Silhouette */}
            <path
              d="M0 160 L40 160 L40 110 L90 110 L90 150 L140 150 L140 90 L200 90 L200 160 L260 160 L260 70 L330 70 L330 160 L400 160 L400 120 L450 120 L450 160 L520 160 L520 60 L600 60 L600 160 L680 160 L680 100 L760 100 L760 160 L850 160 L850 80 L920 80 L920 160 L1000 160 L1000 300 L0 300 Z"
              fill="#061226"
            />
            {/* Glowing Neon Windows in Skyscrapers */}
            <rect x="55" y="125" width="6" height="6" fill="#00AFFF" opacity="0.6" />
            <rect x="70" y="135" width="6" height="6" fill="#00FF88" opacity="0.6" />
            <rect x="155" y="105" width="7" height="7" fill="#00AFFF" opacity="0.8" />
            <rect x="175" y="120" width="7" height="7" fill="#FF6B00" opacity="0.5" />
            <rect x="280" y="85" width="8" height="8" fill="#00AFFF" opacity="0.7" />
            <rect x="300" y="110" width="8" height="8" fill="#00FF88" opacity="0.7" />
            <rect x="545" y="80" width="8" height="8" fill="#00AFFF" opacity="0.9" />
            <rect x="570" y="105" width="8" height="8" fill="#FF6B00" opacity="0.6" />
            <rect x="870" y="100" width="7" height="7" fill="#00FF88" opacity="0.8" />
          </svg>
        </div>

        {/* Stars / Floating Energy Specks */}
        <div className="absolute top-4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#00AFFF] animate-ping" />
        <div className="absolute top-7 right-1/3 w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />

        {/* Speed Radar Sign at 25% */}
        <div className="absolute top-8 left-[22%] z-10 flex flex-col items-center">
          <div className="p-1 px-2 rounded bg-slate-900/90 border border-[#00AFFF] text-[10px] font-black text-[#00AFFF] shadow-[0_0_10px_#00AFFF]">
            RADAR 50 km/h
          </div>
          <div className="w-0.5 h-16 bg-slate-600 mt-1" />
        </div>

        {/* Intelligent Traffic Light at 46% */}
        <div 
          onClick={handleTrafficLightCycle}
          className="absolute top-6 left-[46%] z-20 flex flex-col items-center cursor-pointer group"
          title="Haz clic para cambiar la luz del semáforo"
        >
          <div className="px-2 py-2.5 bg-slate-950 rounded-xl border-2 border-slate-700 shadow-xl flex flex-col gap-1.5 items-center group-hover:border-[#00AFFF] transition-colors">
            {/* Red Light */}
            <span 
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                trafficLight === 'red'
                  ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                  : 'bg-rose-950 opacity-40'
              }`}
            />
            {/* Yellow Light */}
            <span 
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                trafficLight === 'yellow'
                  ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
                  : 'bg-amber-950 opacity-40'
              }`}
            />
            {/* Green Light */}
            <span 
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                trafficLight === 'green'
                  ? 'bg-[#00FF88] shadow-[0_0_12px_#00FF88]'
                  : 'bg-emerald-950 opacity-40'
              }`}
            />
          </div>
          <div className="w-1 h-20 bg-slate-700 mt-1 rounded-full" />
          <span className="text-[9px] font-bold text-slate-400 group-hover:text-[#00AFFF] transition-colors mt-0.5">
            Toca p/ cambiar
          </span>
        </div>

        {/* Pedestrian Crossing / Cebra at 44% - 50% */}
        <div className="absolute bottom-6 left-[43%] w-16 h-28 flex flex-col justify-around z-10 opacity-75">
          <span className="w-full h-2.5 bg-white/90 rounded shadow-xs" />
          <span className="w-full h-2.5 bg-white/90 rounded shadow-xs" />
          <span className="w-full h-2.5 bg-white/90 rounded shadow-xs" />
          <span className="w-full h-2.5 bg-white/90 rounded shadow-xs" />
          <span className="w-full h-2.5 bg-white/90 rounded shadow-xs" />
        </div>

        {/* The 2D Asphalt Road */}
        <div className="absolute bottom-4 left-0 right-0 h-28 bg-[#0d1b2a] border-t-2 border-b-2 border-slate-700 shadow-inner">
          {/* Animated Lane Center Dashes */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 flex gap-6 overflow-hidden">
            {Array.from({ length: 28 }).map((_, i) => (
              <span 
                key={i} 
                className="w-8 h-1 shrink-0 bg-[#00AFFF]/80 shadow-[0_0_6px_#00AFFF] rounded" 
              />
            ))}
          </div>

          {/* Road Borders Neon Glow */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00AFFF] via-[#00FF88] to-[#00AFFF] shadow-[0_0_8px_#00AFFF]" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00AFFF] via-[#FF6B00] to-[#00AFFF] shadow-[0_0_8px_#FF6B00]" />

          {/* Animated Vehicle Sprite */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 z-30"
            style={{ left: `calc(${progress}% - 30px)` }}
          >
            <div className="relative group">
              {/* Exhaust Particle Trail */}
              {speed > 0 && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-1.5 bg-[#00FF88] rounded-full blur-[2px] animate-ping opacity-80" />
              )}

              {/* Vehicle Body by Type */}
              {vehicle === 'car' && (
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#0052cc] to-[#00AFFF] text-white shadow-[0_0_20px_#00AFFF] border border-cyan-200 flex items-center justify-center">
                  <Car size={26} className="text-white" />
                </div>
              )}

              {vehicle === 'bike' && (
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#059669] to-[#00FF88] text-slate-950 shadow-[0_0_20px_#00FF88] border border-emerald-200 flex items-center justify-center">
                  <Bike size={26} className="text-slate-950 stroke-[2.5]" />
                </div>
              )}

              {vehicle === 'bus' && (
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#FF6B00] text-white shadow-[0_0_20px_#FF6B00] border border-amber-200 flex items-center justify-center">
                  <Bus size={28} className="text-white" />
                </div>
              )}

              {/* Headlight beam shining forward */}
              <div 
                className="absolute left-full top-1/2 -translate-y-1/2 w-28 h-10 pointer-events-none opacity-30"
                style={{
                  background: 'linear-gradient(to right, rgba(0, 175, 255, 0.7), transparent)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Safety Warning Pop-up if Speed > 65 */}
        {speed > 60 && (
          <div className="absolute top-3 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 text-slate-950 font-black text-xs shadow-lg animate-bounce">
            <ShieldAlert size={15} />
            <span>¡Alerta! Exceso de velocidad en zona urbana</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Vehicle Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setVehicle('car');
              soundEngine.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              vehicle === 'car'
                ? 'bg-[#0052cc] dark:bg-[#00AFFF] text-white dark:text-slate-950 font-black shadow-md dark:shadow-[0_0_12px_#00AFFF]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Car size={15} />
            <span>Automóvil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVehicle('bike');
              soundEngine.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              vehicle === 'bike'
                ? 'bg-emerald-600 dark:bg-[#00FF88] text-white dark:text-slate-950 font-black shadow-md dark:shadow-[0_0_12px_#00FF88]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Bike size={15} />
            <span>Moto</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setVehicle('bus');
              soundEngine.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              vehicle === 'bus'
                ? 'bg-[#FF6B00] text-white font-black shadow-md dark:shadow-[0_0_12px_#FF6B00]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Bus size={15} />
            <span>Transporte</span>
          </button>
        </div>

        {/* Action Controls: Play/Pause, Accelerate, Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
          </button>

          <button
            type="button"
            onClick={handleAccelerateBoost}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0052cc] to-emerald-600 dark:from-[#00FF88] dark:to-[#00AFFF] text-white dark:text-slate-950 font-black text-xs transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Acelerar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProgress(0);
              soundEngine.playClick();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Reiniciar ruta"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
