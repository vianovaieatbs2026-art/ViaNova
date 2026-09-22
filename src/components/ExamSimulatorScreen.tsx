import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  ShieldAlert, 
  Scale,
  Flag,
  Pause,
  Play,
  Bookmark,
  Share2,
  Printer,
  ChevronRight,
  Sliders,
  Check,
  Sparkles,
  BarChart3,
  FileCheck2,
  Eye,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { getExamQuestions } from '../data/mockData';
import { ExamQuestion, UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getActiveUserSession } from '../utils/authStorage';
import { recordUserExamResult } from '../utils/userProgress';
import { TrafficSignGraphic } from './TrafficSignGraphic';

interface ExamSimulatorScreenProps {
  user?: UserProfile | null;
  onBackToDashboard: () => void;
  onExamCompleted?: (score: number) => void;
}

type SimulatorMode = 'oficial' | 'express' | 'motos' | 'autos' | 'publico';

export const ExamSimulatorScreen: React.FC<ExamSimulatorScreenProps> = ({ 
  user,
  onBackToDashboard,
  onExamCompleted
}) => {
  const { language, t } = useThemeLanguage();
  
  // Simulator configuration state
  const [selectedMode, setSelectedMode] = useState<SimulatorMode>('oficial');
  const [guidedStudyMode, setGuidedStudyMode] = useState(false); // Guided hints on/off
  const [hasStarted, setHasStarted] = useState(false);
  
  // Active exam state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [questionId: number]: boolean }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // default 30 mins
  const [showHint, setShowHint] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load question bank
  const allQuestions: ExamQuestion[] = useMemo(() => {
    return getExamQuestions(language);
  }, [language]);

  // Filter questions according to mode
  const examQuestions: ExamQuestion[] = useMemo(() => {
    let pool = [...allQuestions];
    switch (selectedMode) {
      case 'express':
        return pool.slice(0, 10);
      case 'motos':
        return pool.filter(q => q.licenseCategory === 'A2' || q.licenseCategory === 'todas' || q.category.toLowerCase().includes('moto'));
      case 'autos':
        return pool.filter(q => q.licenseCategory === 'B1' || q.licenseCategory === 'todas' || q.category.toLowerCase().includes('adelantamiento') || q.category.toLowerCase().includes('velocidad'));
      case 'publico':
        return pool.filter(q => q.licenseCategory === 'C1' || q.licenseCategory === 'todas' || q.category.toLowerCase().includes('pasajero') || q.category.toLowerCase().includes('emergencia'));
      case 'oficial':
      default:
        return pool; // Full 25 questions official bank
    }
  }, [allQuestions, selectedMode]);

  // Set initial timer when starting
  const handleStartExam = (mode: SimulatorMode) => {
    setSelectedMode(mode);
    let seconds = 1800; // 30 mins
    if (mode === 'express') seconds = 600; // 10 mins
    if (mode === 'motos' || mode === 'autos' || mode === 'publico') seconds = 1200; // 20 mins
    
    setTimeLeft(seconds);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setIsFinished(false);
    setIsPaused(false);
    setShowHint(false);
    setShowCertificate(false);
    setHasStarted(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || isFinished || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, isPaused]);

  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];
  const selectedOption = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const isFlagged = currentQuestion ? !!flaggedQuestions[currentQuestion.id] : false;

  const handleSelectOption = (index: number) => {
    if (isFinished || !currentQuestion) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHint(false);
    } else {
      finishExam();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowHint(false);
    }
  };

  const finishExam = () => {
    setIsFinished(true);
    let correctCount = 0;
    examQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / examQuestions.length) * 100);
    const activeUser = user || getActiveUserSession();
    if (activeUser?.email) {
      recordUserExamResult(activeUser.email, score >= 75);
    }
    if (onExamCompleted) {
      onExamCompleted(score);
    }
  };

  const restartExam = () => {
    setHasStarted(false);
    setIsFinished(false);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setShowHint(false);
    setShowCertificate(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate detailed competence analysis
  const results = useMemo(() => {
    if (!isFinished) return null;
    let correct = 0;
    let categoriesBreakdown: { [cat: string]: { total: number; correct: number } } = {};

    examQuestions.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (isCorrect) correct++;

      const catKey = q.category.split('(')[0].trim();
      if (!categoriesBreakdown[catKey]) {
        categoriesBreakdown[catKey] = { total: 0, correct: 0 };
      }
      categoriesBreakdown[catKey].total += 1;
      if (isCorrect) categoriesBreakdown[catKey].correct += 1;
    });

    const percentage = Math.round((correct / examQuestions.length) * 100);
    const isPassed = percentage >= 75;

    return {
      correct,
      total: examQuestions.length,
      percentage,
      isPassed,
      categoriesBreakdown
    };
  }, [isFinished, examQuestions, selectedAnswers]);

  // Answered count
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in">
      {/* ================= MODE SELECTION VIEW (Before starting) ================= */}
      {!hasStarted && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t('sim_back_to_dashboard', 'Volver al Inicio')}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Scale size={14} className="text-[#0052cc] dark:text-sky-400" />
              <span>Ministerio de Transporte • RUNT Colombia</span>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-[#0052cc] to-[#0a2540] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <FileCheck2 size={14} />
              <span>SIMULADOR OFICIAL DE SEGURIDAD VIAL</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Simulador Teórico de Conducción Colombia
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
              Evalúa tus conocimientos bajo los estándares de los Centros de Enseñanza Automovilística (CEA) y el examen oficial del RUNT. Preguntas interactivas con señales, leyes (2251, 769, 1811) y casos reales en vía.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl font-semibold">
                <Check size={14} className="text-emerald-400" /> Aprobación: Mínimo 75%
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl font-semibold">
                <Check size={14} className="text-emerald-400" /> Banco: 25 preguntas interactivas
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl font-semibold">
                <Check size={14} className="text-emerald-400" /> Certificado al aprobar
              </span>
            </div>
          </div>

          {/* Guided mode toggle */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#0f172a] dark:text-white">Modo de Aprendizaje Guiado con Pistas</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permite ver la norma legal y pista técnica de cada pregunta durante la prueba.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setGuidedStudyMode(!guidedStudyMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                guidedStudyMode
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{guidedStudyMode ? 'Activado (Con Pistas)' : 'Modo Examen Estricto'}</span>
            </button>
          </div>

          {/* Mode Selector Cards */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-[#0052cc] dark:text-sky-400" />
              <span>Selecciona tu modalidad de simulacro:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Option 1: Oficial Completo */}
              <div 
                onClick={() => handleStartExam('oficial')}
                className="bg-white dark:bg-slate-900 border-2 border-blue-500/80 hover:border-[#0052cc] dark:hover:border-sky-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#eff6ff] dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 px-2.5 py-0.5 rounded-full">
                      Recomendado RUNT
                    </span>
                    <span className="text-xs font-bold text-slate-400">30 min</span>
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Simulacro Oficial Completo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    25 preguntas completas con señales gráficas, cálculo de velocidades, glorietas, alcoholemia y protocolo PAS.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-[#0052cc] dark:text-sky-400">
                  <span>Iniciar Examen Oficial</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 2: Express 10 preguntas */}
              <div 
                onClick={() => handleStartExam('express')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                      Práctica Rápida
                    </span>
                    <span className="text-xs font-bold text-slate-400">10 min</span>
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Simulacro Express (10 Preguntas)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Prueba ágil para afianzar conceptos clave de la Ley Julián Esteban y normas de adelantamiento en 10 minutos.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0052cc]">
                  <span>Iniciar Express</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 3: Especialidad Motos A2 */}
              <div 
                onClick={() => handleStartExam('motos')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
                      Licencia A2
                    </span>
                    <span className="text-xs font-bold text-slate-400">20 min</span>
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Especializado Motocicletas
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Enfoque en Res. 23385 (casco reglamentario), frenada sobre lluvia, distancia con ciclistas y puntos ciegos.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0052cc]">
                  <span>Iniciar Módulo A2</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 4: Particular B1 */}
              <div 
                onClick={() => handleStartExam('autos')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Licencia B1
                    </span>
                    <span className="text-xs font-bold text-slate-400">20 min</span>
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Automóviles Particulares (B1)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Uso de ABS, menores de 10 años en asientos traseros, hidroplaneo, semáforos amarillos y prelaciones.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0052cc]">
                  <span>Iniciar Módulo B1</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option 5: Servicio Público C1 */}
              <div 
                onClick={() => handleStartExam('publico')}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
                      Licencia C1
                    </span>
                    <span className="text-xs font-bold text-slate-400">20 min</span>
                  </div>
                  <h4 className="font-black text-base text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Servicio Público & Transporte (C1)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Prelación de peatones en cebra, vehículos de emergencia, kit de carretera reglamentario y paradas de ascenso.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#0052cc]">
                  <span>Iniciar Módulo C1</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ACTIVE EXAM VIEW ================= */}
      {hasStarted && !isFinished && currentQuestion && (
        <div className="space-y-6">
          {/* Top Status Bar: Timer, Pause, Flag, Question Counter */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-xs font-bold text-slate-500 hover:text-[#0052cc] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Salir</span>
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Pregunta {currentIndex + 1} de {examQuestions.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                ({answeredCount} respondidas{flaggedCount > 0 ? `, ${flaggedCount} marcadas` : ''})
              </span>
            </div>

            {/* Timer & Pause */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title={isPaused ? 'Reanudar' : 'Pausar'}
              >
                {isPaused ? <Play size={14} className="text-emerald-500" /> : <Pause size={14} />}
              </button>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                timeLeft < 120 
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse border border-red-200 dark:border-red-900/50' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}>
                <Timer size={14} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Flag Question Button */}
              <button
                type="button"
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
                title="Marcar pregunta para revisar después"
              >
                <Flag size={13} className={isFlagged ? 'fill-amber-500 text-amber-500' : ''} />
                <span className="hidden sm:inline">{isFlagged ? 'Marcada' : 'Marcar'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Question Jump Matrix (Grid 1 to N) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
              <span>Matriz interactiva de preguntas (haz clic para saltar a cualquier pregunta):</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Respondida</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Marcada</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Actual</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {examQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAns = selectedAnswers[q.id] !== undefined;
                const isFlg = flaggedQuestions[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowHint(false);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0052cc] text-white ring-2 ring-[#0052cc]/30 shadow-xs'
                        : isFlg
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                        : isAns
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isFlg && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 relative">
            {/* Category and License chip */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0052cc] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                  {currentQuestion.category}
                </span>
                {currentQuestion.licenseCategory && currentQuestion.licenseCategory !== 'todas' && (
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-100">
                    Cat: {currentQuestion.licenseCategory}
                  </span>
                )}
              </div>

              {/* Hint button if guided mode */}
              {guidedStudyMode && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={14} />
                  <span>{showHint ? 'Ocultar Pista Legal' : 'Ver Pista Legal'}</span>
                </button>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-black text-[#0f172a] dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Interactive Traffic Sign Graphic if present */}
            {currentQuestion.signCode && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
                <div className="shrink-0">
                  <TrafficSignGraphic
                    signCode={currentQuestion.signCode}
                    size="md"
                    showCodeBadge={true}
                  />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white">Señal de Tránsito Oficial ({currentQuestion.signCode})</p>
                  <p className="mt-0.5">Observa las características de la señal reglamentaria o preventiva para responder.</p>
                </div>
              </div>
            )}

            {/* Guided Study Hint Box */}
            {guidedStudyMode && showHint && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-900 dark:text-amber-300 space-y-1 animate-fade-in">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14} /> Pista Técnica & Base Legal:
                </p>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
                {currentQuestion.legalReference && (
                  <p className="font-mono text-[11px] font-semibold mt-1">Normativa: {currentQuestion.legalReference}</p>
                )}
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#0052cc] dark:border-sky-500 bg-[#eff6ff] dark:bg-blue-950/50 text-[#0052cc] dark:text-sky-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-[#0052cc] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium leading-relaxed flex-1">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentIndex === 0
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Anterior</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex === examQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={finishExam}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Finalizar y Evaluar Examen</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EXAM RESULTS & CERTIFICATE ================= */}
      {isFinished && results && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Result Card */}
          <div className={`rounded-3xl border p-6 sm:p-10 shadow-lg text-center space-y-6 ${
            results.isPassed
              ? 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-rose-200 dark:border-rose-800/60'
          }`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto shadow-inner bg-white dark:bg-slate-800 border">
              {results.isPassed ? (
                <Award size={40} className="text-emerald-500" />
              ) : (
                <ShieldAlert size={40} className="text-rose-500" />
              )}
            </div>

            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                results.isPassed 
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-300' 
                  : 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-300'
              }`}>
                {results.isPassed ? 'Examen Teórico APROBADO' : 'Examen Teórico NO APROBADO'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white">
                {results.percentage}% de Acierto ({results.correct} de {results.total})
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                {results.isPassed
                  ? `¡Felicitaciones! Cumples satisfactoriamente con el estándar exigido por el Ministerio de Transporte y RUNT (mínimo 75%).`
                  : `Necesitas mínimo 75% para aprobar el examen teórico oficial. Repasa las explicaciones técnicas abajo y vuelve a intentar.`}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={restartExam}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Presentar Otro Simulacro</span>
              </button>

              {results.isPassed && (
                <button
                  type="button"
                  onClick={() => setShowCertificate(!showCertificate)}
                  className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <FileText size={15} />
                  <span>{showCertificate ? 'Ocultar Constancia' : 'Ver Constancia de Aprobación'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{t('sim_back_to_dashboard', 'Volver al Inicio')}</span>
              </button>
            </div>
          </div>

          {/* Official Certificate Box */}
          {results.isPassed && showCertificate && (
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Award size={200} />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    VN
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#0f172a] dark:text-white uppercase tracking-wider">
                      ViaNova • Sistema de Formación Vial Colombia
                    </h3>
                    <p className="text-[11px] text-slate-500">Avalado en normativa Ley 769 y Ley 2251</p>
                  </div>
                </div>

                <span className="font-mono text-xs text-slate-400">
                  REF: CEA-VN-{Date.now().toString().slice(-6)}
                </span>
              </div>

              <div className="text-center space-y-3 py-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Constancia de Suficiencia Teórica</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white">
                  {user?.name || 'Aspirante a Licencia de Conducción'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                  Ha presentado y aprobado satisfactoriamente el simulador integral de normas de tránsito, señalización vial y conducción preventiva con una calificación de <strong className="text-emerald-600">{results.percentage}%</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Fecha de Emisión</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString('es-CO')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Categoría Simulada</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.licenseCategory || 'B1 / A2 Colombia'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Estado RUNT</span>
                  <span className="font-semibold text-emerald-600">APROBADO</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Verificación</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">VALIDADO ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* Competence Breakdown by Category */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-base text-[#0f172a] dark:text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-[#0052cc] dark:text-sky-400" />
              <span>Desempeño por Áreas de Competencia</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(results.categoriesBreakdown).map(([cat, stat]: [string, { total: number; correct: number }]) => {
                const catPct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={cat} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200 truncate pr-2">{cat}</span>
                      <span className={catPct >= 75 ? 'text-emerald-600' : 'text-rose-600'}>{catPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${catPct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{stat.correct} de {stat.total} preguntas correctas</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <h3 className="font-black text-base text-[#0f172a] dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Revisión Detallada y Justificaciones Legales ({examQuestions.length} Preguntas)</span>
            </h3>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {examQuestions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={q.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                          isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{q.category}</span>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {isCorrect ? 'Correcta' : 'Incorrecta'}
                      </span>
                    </div>

                    <p className="font-bold text-sm text-[#0f172a] dark:text-white">{q.question}</p>

                    <div className="text-xs space-y-1 pt-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Check size={13} />
                        <span>Respuesta correcta: {q.options[q.correctIndex]}</span>
                      </div>
                      {!isCorrect && userAns !== undefined && (
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                          <XCircle size={13} />
                          <span>Tu selección: {q.options[userAns]}</span>
                        </div>
                      )}
                    </div>

                    {/* Technical Explanation */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Fundamento técnico:</p>
                      <p>{q.explanation}</p>
                      {q.legalReference && (
                        <p className="font-mono text-[11px] text-[#0052cc] dark:text-sky-400 pt-0.5">
                          Base Legal: {q.legalReference}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
