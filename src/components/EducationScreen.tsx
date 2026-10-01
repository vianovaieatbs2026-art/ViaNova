import React, { useState } from 'react';
import { 
  Scale, 
  HelpCircle, 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Car,
  Bike,
  Heart,
  Volume2,
  Sliders,
  Check,
  AlertTriangle,
  Lightbulb,
  Video,
  Info,
  Navigation
} from 'lucide-react';
import { UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getActiveUserSession } from '../utils/authStorage';
import { getUserCompletedModules, toggleUserCompletedModule } from '../utils/userProgress';
import { soundEngine } from '../utils/soundEffects';
import { TrafficSignGraphic } from './TrafficSignGraphic';

interface EducationScreenProps {
  user?: UserProfile | null;
  onNavigateToQuiz: () => void;
  onNavigateToSimulator: () => void;
}

type EduTabId = 'velocidad' | 'glorietas' | 'senales_practica' | 'motociclistas' | 'vulnerables' | 'recursos_oficiales';

export const EducationScreen: React.FC<EducationScreenProps> = ({
  user,
  onNavigateToQuiz,
  onNavigateToSimulator
}) => {
  const activeUser = user || getActiveUserSession();
  const { t } = useThemeLanguage();

  const [activeTab, setActiveTab] = useState<EduTabId>('velocidad');
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    return activeUser?.email ? getUserCompletedModules(activeUser.email) : [];
  });

  // ================= 1. SIMULADOR DE VELOCIDAD & FRENADO =================
  const [simSpeed, setSimSpeed] = useState<number>(50); // 30, 50, 80, 100
  const [isWetRoad, setIsWetRoad] = useState<boolean>(false);

  // Cálculos físicos reales según normativa ANSV Colombia
  // Reacción (tiempo promedio 1 segundo): distancia = (V * 1000) / 3600
  const reactionDist = Math.round((simSpeed * 10) / 36);
  // Frenado: en seco a = 7 m/s2, en mojado a = 4 m/s2
  const decel = isWetRoad ? 3.8 : 7.2;
  const brakingDist = Math.round(Math.pow((simSpeed * 10) / 36, 2) / (2 * decel));
  const totalStoppingDist = reactionDist + brakingDist;

  // Probabilidad de supervivencia de peatón o ciclista impactado
  const survivalRate = simSpeed <= 30 ? 90 : simSpeed <= 50 ? 80 : simSpeed <= 70 ? 35 : 10;

  // Mini reto velocidad
  const [speedQuizAnswer, setSpeedQuizAnswer] = useState<number | null>(null);

  // ================= 2. GLORIETAS Y PRELACIÓN =================
  const [selectedExit, setSelectedExit] = useState<'primera' | 'segunda' | 'tercera'>('primera');
  const [glorietaQuizAnswer, setGlorietaQuizAnswer] = useState<string | null>(null);

  // ================= 3. SEÑALES INTERACTIVAS =================
  const [signIndex, setSignIndex] = useState(0);
  const [selectedSignCategory, setSelectedSignCategory] = useState<string | null>(null);
  const [signIsCorrect, setSignIsCorrect] = useState<boolean | null>(null);

  const interactiveSigns = [
    {
      code: 'SR-01',
      name: 'Señal de PARE',
      category: 'reglamentaria',
      meaning: 'Detención total obligatoria a 0 km/h antes de la línea de parada.',
      explanation: 'Las señales rojas circulares u octagonales son de acatamiento estricto. Omitir el PARE acarrea inmovilización y comparendo Cod. C.02.'
    },
    {
      code: 'SP-33',
      name: 'Curva Peligrosa a la Izquierda',
      category: 'preventiva',
      meaning: 'Advierte la proximidad de una curva pronunciada.',
      explanation: 'Las señales amarillas con forma de rombo son preventivas. Alertan sobre riesgos en la geometría de la vía para reducir la velocidad a tiempo.'
    },
    {
      code: 'SI-01',
      name: 'Puesto de Primeros Auxilios',
      category: 'informativa',
      meaning: 'Informa la ubicación de un centro o puesto de atención médica.',
      explanation: 'Las señales azules rectangulares son informativas. Guían y proporcionan servicios esenciales en carretera sin imponer órdenes.'
    },
    {
      code: 'ST-01',
      name: 'Trabajos en la Vía',
      category: 'transitoria',
      meaning: 'Advierte presencia de obreros o maquinaria sobre la calzada.',
      explanation: 'Las señales naranjas son transitorias de obra. Tienen prelación temporal sobre las señales permanentes por seguridad en zona de trabajo.'
    }
  ];

  const currentSign = interactiveSigns[signIndex % interactiveSigns.length];

  const handleSignAnswer = (category: string) => {
    soundEngine.playClick();
    setSelectedSignCategory(category);
    const correct = category === currentSign.category;
    setSignIsCorrect(correct);
    if (correct) soundEngine.playSuccess();
  };

  const handleNextSign = () => {
    soundEngine.playClick();
    setSelectedSignCategory(null);
    setSignIsCorrect(null);
    setSignIndex(prev => prev + 1);
  };

  // ================= 4. MOTOCICLISTAS & ELEMENTOS DE PROTECCIÓN =================
  const [activeHelmetCheck, setActiveHelmetCheck] = useState<number>(0);
  const helmetChecks = [
    {
      title: '1. Certificación Estándar',
      desc: 'El casco debe portar la etiqueta visible DOT (FMVSS 218), ECE 22.05 / 22.06 o NTC 4533. Cascos de juguete o ciclismo no están autorizados en moto.'
    },
    {
      title: '2. Sistema de Retención',
      desc: 'La correa y broche deben asegurarse firmemente bajo el mentón, sin holguras. Un casco sin abrochar sale expulsado en el primer impacto.'
    },
    {
      title: '3. Mentonera Asegurada',
      desc: 'Si utilizas casco abatible o modular, la mentonera debe permanecer fija y bloqueada hacia abajo durante la conducción.'
    },
    {
      title: '4. Visor Transparente Nocturno',
      desc: 'El visor debe estar limpio y libre de rayas. En horario nocturno está prohibido el uso de visores oscuros o espejados.'
    }
  ];

  // ================= 5. ACTORES VULNERABLES & PIRÁMIDE =================
  const [activePyramidLevel, setActivePyramidLevel] = useState<number>(0);
  const pyramidLevels = [
    {
      level: '1. Peatones y Movilidad Reducida',
      tag: 'MÁXIMA PRIORIDAD',
      desc: 'Tienen prelación en todas las intersecciones y cebras peatonales. En caso de duda, el conductor debe detenerse siempre.',
      color: 'bg-emerald-500'
    },
    {
      level: '2. Ciclistas',
      tag: 'DISTANCIA 1.5 METROS',
      desc: 'Por Ley 1811 de 2016, todo vehículo debe dejar al menos 1.5 metros de separación al sobrepasarlos. Tocar la bocina está prohibido.',
      color: 'bg-teal-500'
    },
    {
      level: '3. Transporte Público Masivo',
      tag: 'EFICIENCIA URBANA',
      desc: 'Buses del SITP, TransMilenio, Metroplús y rutas colectivas mueven al mayor número de ciudadanos y tienen carriles preferenciales.',
      color: 'bg-blue-500'
    },
    {
      level: '4. Transporte de Carga',
      tag: 'LOGÍSTICA Y ABASTECIMIENTO',
      desc: 'Camiones y tractomulas requieren mayor distancia de frenado y tienen 4 puntos ciegos amplios.',
      color: 'bg-amber-500'
    },
    {
      level: '5. Vehículos Particulares y Motos',
      tag: 'MAYOR RESPONSABILIDAD',
      desc: 'Ocupan la base de la pirámide: deben acatar los límites y proteger a todos los usuarios que están por encima.',
      color: 'bg-slate-500'
    }
  ];

  const toggleComplete = (tabKey: string) => {
    soundEngine.playClick();
    if (activeUser?.email) {
      const updated = toggleUserCompletedModule(activeUser.email, tabKey);
      setCompletedModules(updated);
    } else {
      if (completedModules.includes(tabKey)) {
        setCompletedModules(completedModules.filter(m => m !== tabKey));
      } else {
        setCompletedModules([...completedModules, tabKey]);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in font-sans">
      
      {/* ===================== HEADER INSTITUCIONAL ===================== */}
      <div className="bg-white dark:bg-[#0A1931]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 text-xs font-black uppercase tracking-wider border border-blue-100 dark:border-blue-900/50">
              <Scale size={14} />
              <span>Marco Legal Colombia • Ley 769 de 2002 & Ley Julián Esteban 2251 de 2022</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Aprende y Prepárate: <span className="text-[#0052cc] dark:text-sky-400">Guía de Movilidad Vial</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Aquí encontrarás la información esencial y las actividades interactivas que necesitas dominar antes de presentar tu simulacro de examen oficial CEA / RUNT. Sin muros de texto: aprende experimentando con situaciones reales.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HelpCircle size={15} className="text-[#0052cc] dark:text-sky-400" />
              <span>Hacer Quiz Rápido</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToSimulator}
              className="px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileCheck2 size={15} />
              <span>Simulador Oficial CEA</span>
            </button>
          </div>
        </div>

        {/* Learning Stage Navigation Bar */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'velocidad', label: '1. Límites y Frenado', icon: '⚡' },
            { id: 'glorietas', label: '2. Glorietas y Prelación', icon: '🔄' },
            { id: 'senales_practica', label: '3. Señales en Práctica', icon: '🛑' },
            { id: 'motociclistas', label: '4. Casco y Motos', icon: '🛡️' },
            { id: 'vulnerables', label: '5. Peatón y Bici (1.5m)', icon: '🚲' },
            { id: 'recursos_oficiales', label: '6. Recursos y Videos', icon: '📺' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id as EduTabId);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== CONTENIDO SEGÚN PESTAÑA ===================== */}

      {/* ================= PESTAÑA 1: VELOCIDAD Y DISTANCIA DE FRENADO ================= */}
      {activeTab === 'velocidad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* Interactive Simulation Sandbox (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                  Experiencia Interactiva • Ley 2251 de 2022
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Simulador de Distancia de Frenado y Supervivencia
                </h2>
              </div>

              {/* Wet / Dry Road Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsWetRoad(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isWetRoad 
                      ? 'bg-amber-500 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ☀️ Piso Seco
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsWetRoad(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isWetRoad 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🌧️ Piso Mojado
                </button>
              </div>
            </div>

            {/* Speed Slider Control */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Selecciona la velocidad de circulación:</span>
                <span className="text-xl font-black text-[#0052cc] dark:text-sky-400 font-mono">
                  {simSpeed} km/h
                </span>
              </div>

              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={simSpeed}
                onChange={(e) => setSimSpeed(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0052cc]"
              />

              {/* Speed Preset Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] pt-1">
                {[
                  { speed: 30, label: '30 km/h (Colegios / Hospitales)' },
                  { speed: 50, label: '50 km/h (Urbano General)' },
                  { speed: 80, label: '80 km/h (Vía Periférica)' },
                  { speed: 100, label: '100 km/h (Autopista)' }
                ].map((item) => (
                  <button
                    key={item.speed}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSimSpeed(item.speed);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      simSpeed === item.speed
                        ? 'bg-[#0052cc] text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Results Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-center">
                <p className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider">
                  Distancia Reacción (1s)
                </p>
                <p className="text-2xl font-black text-[#0052cc] dark:text-sky-400 font-mono mt-1">
                  {reactionDist} m
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Metros recorridos antes de pisar el freno
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center">
                <p className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                  Distancia Frenado
                </p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                  {brakingDist} m
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {isWetRoad ? 'Duplicado por lluvia y fricción' : 'Frenado mecánico en seco'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-center">
                <p className="text-[10px] font-black uppercase text-rose-800 dark:text-rose-300 tracking-wider">
                  Detención Total
                </p>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                  {totalStoppingDist} m
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Metros totales hasta detener el auto
                </p>
              </div>
            </div>

            {/* Visual Survival Rate Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-500 fill-rose-500" />
                  <span>Supervivencia de un peatón ante atropello a {simSpeed} km/h:</span>
                </span>
                <span className={`text-sm font-black ${
                  survivalRate >= 80 ? 'text-emerald-500' : survivalRate >= 35 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {survivalRate}% de probabilidad
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    survivalRate >= 80 ? 'bg-emerald-500' : survivalRate >= 35 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${survivalRate}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                💡 <strong>Por qué la Ley Julián Esteban fijó 30 km/h:</strong> Un impacto a 30 km/h equivale a una caída desde un segundo piso (90% de los peatones sobreviven). A 50 km/h la energía cinética se triplica, y por encima de 60 km/h el impacto es casi siempre mortal.
              </p>
            </div>
          </div>

          {/* Quick Interactive Knowledge Challenge (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Lightbulb size={16} />
              <span>Desafío Rápido de Velocidad</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              ¿Cuál es la velocidad máxima permitida frente a colegios, hospitales y zonas residenciales en Colombia?
            </h3>

            <div className="space-y-2">
              {[
                { opt: 1, text: '30 km/h (Fijado por la Ley Julián Esteban 2251)', isCorrect: true },
                { opt: 2, text: '50 km/h si no hay estudiantes cruzando', isCorrect: false },
                { opt: 3, text: '60 km/h con luces estacionarias encendidas', isCorrect: false }
              ].map((item) => (
                <button
                  key={item.opt}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSpeedQuizAnswer(item.opt);
                    if (item.isCorrect) soundEngine.playSuccess();
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    speedQuizAnswer === item.opt
                      ? item.isCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.text}</span>
                </button>
              ))}
            </div>

            {speedQuizAnswer !== null && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-100 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Explicación Oficial:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  El artículo 106 del Código Nacional de Tránsito (modificado por la Ley 2251 de 2022) establece sin excepción el límite de 30 km/h en zonas escolares y residenciales de todo el territorio colombiano.
                </p>
              </div>
            )}

            {/* Official Source Badge */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Fuente: Agencia Nacional de Seguridad Vial (ANSV)</span>
              <a 
                href="https://ansv.gov.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-0.5"
              >
                <span>ansv.gov.co</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 2: GLORIETAS Y PRELACIÓN ================= */}
      {activeTab === 'glorietas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* Interactive Roundabout Explorer (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                Artículo 70 • Ley 769 de 2002
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Cómo Circular y Tomar las Salidas en una Glorieta
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                La regla de oro: Quien ya se encuentra dentro de la glorieta tiene prelación sobre los vehículos que van a ingresar.
              </p>
            </div>

            {/* Maniobra selector */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Selecciona la maniobra que vas a realizar:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedExit('primera');
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    selectedExit === 'primera'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-sky-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-sm">↗️ Salida 1 (Derecha)</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    Girar a la derecha inmediatamente
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedExit('segunda');
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    selectedExit === 'segunda'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-sky-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-sm">⬆️ Salida 2 (Frente)</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    Continuar derecho por el anillo
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedExit('tercera');
                  }}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    selectedExit === 'tercera'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-sky-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-sm">↩️ Salida 3 o Retorno</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                    Girar a la izquierda o dar la vuelta
                  </p>
                </button>
              </div>
            </div>

            {/* Instruction Card for Selected Maniobra */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              {selectedExit === 'primera' && (
                <>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>Paso a paso para girar a la derecha (Salida 1):</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5 leading-relaxed font-medium">
                    <li>Acércate a la glorieta por el <strong>carril derecho exterior</strong>.</li>
                    <li>Activa la luz direccional derecha con al menos 30 metros de anticipación.</li>
                    <li>Cede el paso al vehículo que ya está circulando en el anillo. Cuando haya espacio, ingresa directo a la salida.</li>
                  </ul>
                </>
              )}

              {selectedExit === 'segunda' && (
                <>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>Paso a paso para seguir de frente (Salida 2):</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5 leading-relaxed font-medium">
                    <li>Ingresa por el <strong>carril medio o central</strong> sin señalizar a los lados.</li>
                    <li>Mantén tu carril dentro de la glorieta sin cruzarte frente a otros vehículos.</li>
                    <li>Al superar la salida anterior, activa la direccional derecha para avisar tu egreso seguro.</li>
                  </ul>
                </>
              )}

              {selectedExit === 'tercera' && (
                <>
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>Paso a paso para girar a la izquierda o retornar (Salida 3):</span>
                  </div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-5 leading-relaxed font-medium">
                    <li>Ingresa por el <strong>carril izquierdo interior</strong> con direccional izquierda encendida.</li>
                    <li>Circula por el anillo interior mientras rodeas la glorieta.</li>
                    <li>Con antelación a tu salida, señaliza a la derecha y pásate progresivamente al carril exterior para salir. Nunca salgas directamente desde el carril más interno.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Side Challenge: Cruce sin semáforo (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0052cc] dark:text-sky-400">
              <Navigation size={16} />
              <span>Intersección en Cruz</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              Dos vehículos llegan al mismo tiempo a una intersección sin semáforos ni señales de PARE. ¿Quién pasa primero?
            </h3>

            <div className="space-y-2">
              {[
                { opt: 'derecha', text: 'El vehículo que se aproxima por la DERECHA', isCorrect: true },
                { opt: 'grande', text: 'El vehículo más grande o pesado', isCorrect: false },
                { opt: 'rapido', text: 'El vehículo que vaya a mayor velocidad', isCorrect: false }
              ].map((item) => (
                <button
                  key={item.opt}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setGlorietaQuizAnswer(item.opt);
                    if (item.isCorrect) soundEngine.playSuccess();
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                    glorietaQuizAnswer === item.opt
                      ? item.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.text}</span>
                </button>
              ))}
            </div>

            {glorietaQuizAnswer !== null && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-100 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Artículo 66 del Código de Tránsito:</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  En intersecciones no señalizadas, tiene prelación quien se aproxima por la derecha. Esta regla internacional evita colisiones perpendiculares.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 3: SEÑALES EN PRÁCTICA ================= */}
      {activeTab === 'senales_practica' && (
        <div className="bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                Tarjeta Interactiva de Reconocimiento
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ¿Qué tipo de señal estás viendo?
              </h2>
            </div>

            <button
              type="button"
              onClick={handleNextSign}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <span>Siguiente Señal ({signIndex + 1}/{interactiveSigns.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Central Sign Viewer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Graphic Container (5 Cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-36 h-36 flex items-center justify-center">
                <TrafficSignGraphic signCode={currentSign.code} size="lg" showCodeBadge={true} />
              </div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-4">
                Código Oficial: {currentSign.code}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentSign.name}
              </p>
            </div>

            {/* Question & Options (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Selecciona la familia a la que pertenece esta señal:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'reglamentaria', label: '🛑 Reglamentaria', desc: 'Borde rojo. Mandato y orden estricta.' },
                  { id: 'preventiva', label: '⚠️ Preventiva', desc: 'Fondo amarillo. Advierte peligro en vía.' },
                  { id: 'informativa', label: 'ℹ️ Informativa', desc: 'Fondo azul. Guía y servicios al conductor.' },
                  { id: 'transitoria', label: '🚧 Transitoria de Obra', desc: 'Fondo naranja. Modificación temporal.' }
                ].map((cat) => {
                  const isSelected = selectedSignCategory === cat.id;
                  const isCorrect = cat.id === currentSign.category;

                  let style = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50';
                  if (selectedSignCategory !== null) {
                    if (isCorrect) {
                      style = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                    } else if (isSelected) {
                      style = 'bg-rose-500 text-white border-rose-600 font-bold';
                    } else {
                      style = 'opacity-40 border-slate-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={selectedSignCategory !== null}
                      onClick={() => handleSignAnswer(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer disabled:cursor-default ${style}`}
                    >
                      <p className="text-xs font-bold leading-snug">{cat.label}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>

              {selectedSignCategory !== null && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-in ${
                  signIsCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-100'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-100'
                }`}>
                  <p className="font-extrabold text-xs">
                    {signIsCorrect ? '¡Excelente! Respuesta correcta.' : '¡Ten cuidado! Vamos a repasar esta señal:'}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {currentSign.explanation}
                  </p>
                  <p className="text-[11px] font-semibold pt-1">
                    👉 <strong>Qué debes hacer en la vía:</strong> {currentSign.meaning}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 4: MOTOCICLISTAS Y CASCO CERTIFICADO ================= */}
      {activeTab === 'motociclistas' && (
        <div className="bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
              Resolución 23385 de 2020 • Ministerio de Transporte
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Inspección de Casco Reglamentario y Elementos de Protección
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              En Colombia es obligatorio el uso de casco certificado y prendas reflectivas de 18:00 a 06:00 horas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* 4 Interactive Checks */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Toca cada punto de control para ver las exigencias de la ley:
              </p>
              {helmetChecks.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveHelmetCheck(idx);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    activeHelmetCheck === idx
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-sky-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">{item.title}</span>
                  <ArrowRight size={14} className={activeHelmetCheck === idx ? 'text-[#0052cc] dark:text-sky-400' : 'text-slate-400'} />
                </button>
              ))}
            </div>

            {/* Explanation Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-blue-200 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-[#0052cc] dark:text-sky-400 flex items-center gap-1.5">
                <ShieldAlert size={16} />
                <span>{helmetChecks[activeHelmetCheck].title}</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {helmetChecks[activeHelmetCheck].desc}
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200">
                ⚠️ <strong>Sanción aplicable:</strong> No abrochar el casco o portar uno no certificado da lugar a comparendo equivalente a 15 SMDLV e inmovilización de la motocicleta.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 5: ACTORES VULNERABLES Y 1.5 METROS ================= */}
      {activeTab === 'vulnerables' && (
        <div className="bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
              Ley 1811 de 2016 • Pirámide de la Movilidad
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Pirámide de la Movilidad y Protección a Peatones y Ciclistas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              La jerarquía vial ubica en la cumbre a los más vulnerables. La velocidad y la masa del vehículo determinan la responsabilidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Pyramid Interactive Stack (7 Cols) */}
            <div className="md:col-span-7 space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Toca cada escalón de la pirámide de movilidad:
              </p>
              {pyramidLevels.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    soundEngine.playClick();
                    setActivePyramidLevel(idx);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    activePyramidLevel === idx
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-sky-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs font-bold">{item.level}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Pyramid Detail Panel (5 Cols) */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {pyramidLevels[activePyramidLevel].level}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {pyramidLevels[activePyramidLevel].desc}
              </p>
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-[11px] text-teal-900 dark:text-teal-200">
                🚲 <strong>Regla de los 1.5 metros:</strong> Al sobrepasar un ciclista, es obligatorio apartarse lateralmente al menos un metro y medio. El viento o la cercanía pueden desbalancearlo de forma letal.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 6: RECURSOS OFICIALES Y VIDEOS DIDÁCTICOS ================= */}
      {activeTab === 'recursos_oficiales' && (
        <div className="bg-white dark:bg-[#0A1931]/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
              Recursos Verificados de Internet • Entidades Gubernamentales
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Material Didáctico y Fuentes Oficiales de Seguridad Vial
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Todos los recursos han sido consultados directamente en los organismos de tránsito de Colombia: Agencia Nacional de Seguridad Vial (ANSV), Ministerio de Transporte y RUNT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Resource 1: ANSV Colombia */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-400 flex items-center justify-center font-bold">
                  <Video size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Campaña: Velocidad y Ley Julián Esteban
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Material pedagógico oficial sobre el impacto de la reducción de velocidad urbana a 50 km/h y 30 km/h en zonas escolares.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">FUENTE OFICIAL</span>
                <a
                  href="https://ansv.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>Agencia Nacional de Seguridad Vial (ANSV)</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Resource 2: Cascos Ministerio de Transporte */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <ShieldAlert size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Manual de Elementos de Protección en Motos
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Guía técnica de la Resolución 23385 de 2020 con estándares certificados DOT, ECE y NTC para la protección de motociclistas.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">FUENTE OFICIAL</span>
                <a
                  href="https://mintransporte.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>Ministerio de Transporte de Colombia</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Resource 3: RUNT y Licencias */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <FileCheck2 size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Banco Oficial de Examen Teórico RUNT
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Estructura curricular de 30 preguntas que deben aprobar los aspirantes a licencias A2, B1, B2 y C1 en los Centros de Enseñanza Automovilística (CEA).
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">FUENTE OFICIAL</span>
                <a
                  href="https://www.runt.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>RUNT Colombia</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FOOTER CON CTA DIRECTO A LA EVALUACIÓN ===================== */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-black">
            ¿Listo para poner a prueba lo que aprendiste?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Presenta el simulador oficial de 30 preguntas o entrena con los quizzes interactivos.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onNavigateToQuiz}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Hacer un Quiz
          </button>
          <button
            type="button"
            onClick={onNavigateToSimulator}
            className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simulador CEA / RUNT</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
