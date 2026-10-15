import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  AlertTriangle,
  Car,
  Bike,
  Bus,
  Gauge,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { soundEngine } from '../utils/soundEffects';

type VehicleType = 'car' | 'bike' | 'bus';

export const CityRouteSimulator2D: React.FC = () => {
  const { t, language } = useThemeLanguage();
  const isEn = language === 'en';

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(38); // km/h
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [carProgress, setCarProgress] = useState<number>(0); // 0 to 100
  const [trafficLight, setTrafficLight] = useState<'green' | 'yellow' | 'red'>('green');
  const [pedestrianCrossing, setPedestrianCrossing] = useState<boolean>(false);
  const [safetyScore, setSafetyScore] = useState<number>(98);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Traffic light cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      setTrafficLight((prev) => {
        if (prev === 'green') return 'yellow';
        if (prev === 'yellow') {
          setPedestrianCrossing(true);
          return 'red';
        }
        setPedestrianCrossing(false);
        return 'green';
      });
    }, 6000);

    return () => clearInterval(cycle);
  }, []);

  // Animation frame loop
  useEffect(() => {
    const animate = (time: number) => {
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isRunning) {
        // Red light or pedestrian crossing stops car if near intersection (progress 45-55)
        const isNearIntersection = carProgress >= 40 && carProgress <= 52;
        const mustStop = isNearIntersection && (trafficLight === 'red' || trafficLight === 'yellow');

        if (!mustStop) {
          const moveDelta = (speed / 3.6) * dt * 2.2; // scaling factor
          setCarProgress((prev) => {
            const next = prev + moveDelta;
            return next > 100 ? 0 : next;
          });
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, speed, trafficLight, carProgress]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (newSpeed > 50) {
      setSafetyScore((prev) => Math.max(60, prev - 2));
    } else {
      setSafetyScore((prev) => Math.min(100, prev + 1));
    }
  };

  const handleTogglePlay = () => {
    soundEngine.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setCarProgress(0);
    setSpeed(35);
    setIsRunning(true);
  };

  const isSpeedExceeded = speed > 50;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#0052cc] dark:text-sky-400 text-xs font-bold tracking-wide mb-2">
            <Zap size={13} className="text-amber-500" />
            <span>{t('sim2d_badge', 'SIMULADOR DINÁMICO DE TRÁFICO URBANO • LEY 2251')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            <span>{t('sim2d_title', 'Ruta Inteligente')}</span>
            <span className="text-[#0052cc] dark:text-sky-400">
              {t('sim2d_title_accent', 'ViaNova 2D')}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 max-w-2xl mt-1">
            {t(
              'sim2d_sub',
              'Simulador de tráfico urbano, semaforización adaptativa y respeto al paso peatonal.'
            )}
          </p>
        </div>

        {/* Safety Score Badge */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isEn ? 'Safety Score' : 'Puntaje de Seguridad'}
            </div>
            <div className="text-lg font-black text-slate-800 dark:text-white">
              {safetyScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* 2D Canvas Road Track */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between p-4">
        {/* Sky / Urban Backdrop */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-bold text-slate-400">
            <Navigation size={13} className="text-blue-400" />
            {isEn ? 'Carrera 70 • Urban Zone (Limit 50 km/h)' : 'Carrera 70 • Zona Urbana (Límite 50 km/h)'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {isEn ? 'Pedestrian Crossing: ' : 'Paso Peatonal: '}
              <strong className={pedestrianCrossing ? 'text-emerald-400' : 'text-slate-500'}>
                {pedestrianCrossing ? (isEn ? 'ACTIVE' : 'ACTIVO') : (isEn ? 'Clear' : 'Libre')}
              </strong>
            </span>
          </div>
        </div>

        {/* Road Track */}
        <div className="relative w-full h-24 bg-slate-800/90 rounded-xl border-y-4 border-slate-700 flex items-center overflow-hidden">
          {/* Dashed White Road Centerlines */}
          <div className="absolute inset-x-0 h-1 border-b-2 border-dashed border-amber-400/80 pointer-events-none" />

          {/* Pedestrian Zebra Crosswalk at 46% */}
          <div className="absolute left-[44%] top-0 bottom-0 w-12 flex justify-between px-1 bg-slate-800/60 border-x border-slate-600 z-10">
            <div className="w-1.5 bg-white h-full" />
            <div className="w-1.5 bg-white h-full" />
            <div className="w-1.5 bg-white h-full" />
            <div className="w-1.5 bg-white h-full" />
          </div>

          {/* Animated Pedestrian Figure */}
          {pedestrianCrossing && (
            <div className="absolute left-[47%] bottom-2 z-20 text-xs animate-bounce pointer-events-none">
              🚶‍♂️
            </div>
          )}

          {/* Moving Vehicle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-75"
            style={{ left: `calc(${carProgress}% - 24px)` }}
          >
            <div
              className={`p-2 rounded-xl flex items-center justify-center shadow-lg transition-transform ${
                isSpeedExceeded
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#0052cc] text-white'
              }`}
            >
              {vehicle === 'car' && <Car size={22} />}
              {vehicle === 'bike' && <Bike size={22} />}
              {vehicle === 'bus' && <Bus size={22} />}
            </div>
          </div>
        </div>

        {/* Traffic Light Display */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {isEn ? 'Traffic Signal:' : 'Semáforo:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  trafficLight === 'red'
                    ? 'bg-rose-500 shadow-md shadow-rose-500/50'
                    : 'bg-rose-950/60'
                }`}
              />
              <span
                className={`w-3 h-3 rounded-full ${
                  trafficLight === 'yellow'
                    ? 'bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'bg-amber-950/60'
                }`}
              />
              <span
                className={`w-3 h-3 rounded-full ${
                  trafficLight === 'green'
                    ? 'bg-emerald-500 shadow-md shadow-emerald-500/50'
                    : 'bg-emerald-950/60'
                }`}
              />
            </div>
          </div>

          {/* Speed Warning Banner */}
          {isSpeedExceeded && (
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs bg-rose-950/80 border border-rose-800/80 px-3 py-1 rounded-xl animate-fade-in">
              <AlertTriangle size={13} />
              <span>{t('sim2d_urban_speed_warning', '¡Alerta! Exceso de velocidad en zona urbana')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Controls & Speedometer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* 1. Vehicle Selector */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {isEn ? 'Select Vehicle:' : 'Tipo de Vehículo:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setVehicle('car');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                vehicle === 'car'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Car size={16} />
              <span>{t('sim2d_car', 'Automóvil')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setVehicle('bike');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                vehicle === 'bike'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bike size={16} />
              <span>{t('sim2d_bike', 'Moto')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setVehicle('bus');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                vehicle === 'bus'
                  ? 'bg-[#0052cc] text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Bus size={16} />
              <span>{t('sim2d_bus', 'Transporte')}</span>
            </button>
          </div>
        </div>

        {/* 2. Speed Slider */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Gauge size={14} className="text-[#0052cc] dark:text-sky-400" />
              {t('sim2d_speed', 'Velocidad:')}
            </span>
            <span
              className={`font-black font-mono text-sm ${
                isSpeedExceeded ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-white'
              }`}
            >
              {speed} km/h
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="80"
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            className="w-full accent-[#0052cc] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 km/h</span>
            <span className="text-amber-500 font-bold">50 km/h (Ley 2251)</span>
            <span>80 km/h</span>
          </div>
        </div>

        {/* 3. Play / Pause / Reset Controls */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-around gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#0052cc] hover:bg-[#0047b3] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause size={14} />
                <span>{t('sim2d_pause', 'Pausar')}</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>{t('sim2d_resume', 'Reanudar')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-3 px-4 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            title={t('sim2d_reset', 'Reiniciar ruta')}
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">{t('sim2d_reset', 'Reiniciar')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
