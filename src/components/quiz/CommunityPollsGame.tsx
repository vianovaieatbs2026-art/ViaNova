import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCcw, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  AlertTriangle,
  Trophy,
  Info
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { QuizConfetti } from './QuizConfetti';

interface PollOption {
  id: string;
  text: string;
  percentage: number; // community vote
  isCorrect: boolean;
  critique: string;
}

interface DilemmaItem {
  id: string;
  situation: string;
  context: string;
  location: string;
  options: PollOption[];
  legalReference: string;
  legalExplanation: string;
  defensiveTip: string;
}

const DILEMMAS_DATA: DilemmaItem[] = [
  {
    id: 'dil-1',
    situation: 'Vas a 45 km/h por una avenida con pavimento mojado por lluvia. A 15 metros, el semáforo cambia de verde a amarillo.',
    context: 'Lluvia intensa • Pavimento deslizante',
    location: 'Avenida El Poblado, Medellín',
    options: [
      {
        id: 'opt-a',
        text: 'Acelerar a fondo para cruzar la intersección antes de que encienda la luz roja.',
        percentage: 4,
        isCorrect: false,
        critique: 'Peligro extremo: acelera en pavimento mojado aumentando el riesgo de hidroplaneo y colisión lateral.'
      },
      {
        id: 'opt-b',
        text: 'Clavar los frenos bruscamente en seco para no cruzar la línea de pare.',
        percentage: 12,
        isCorrect: false,
        critique: 'Riesgo de derrape, pérdida de control del vehículo y colisión por alcance trasero de quien viene detrás.'
      },
      {
        id: 'opt-c',
        text: 'Evaluar retrovisores y frenar de manera progresiva y controlada para detenerte seguro antes de la línea.',
        percentage: 84,
        isCorrect: true,
        critique: '¡Decisión óptima! La luz amarilla advierte despejar o detenerse con anticipación controlada.'
      }
    ],
    legalReference: 'Art. 118 Ley 769 de 2002 - Luces del Semáforo',
    legalExplanation: 'La luz amarilla del semáforo indica prevención y el deber de detenerse antes de la línea de parada, salvo que el vehículo esté tan próximo que una frenada comprometa la seguridad.',
    defensiveTip: 'En lluvia duplica la distancia de seguimiento a mínimo 4 segundos.'
  },
  {
    id: 'dil-2',
    situation: 'Un conductor impaciente detrás tuyo empieza a pitarte y hacer cambio de luces porque vas a 30 km/h en una zona escolar.',
    context: 'Horario escolar • Presencia de niños',
    location: 'Zona Escolar Urbana, Colombia',
    options: [
      {
        id: 'opt-a',
        text: 'Acelerar a 50 km/h para no estorbar el flujo vehicular y calmar al conductor de atrás.',
        percentage: 6,
        isCorrect: false,
        critique: 'Infracción grave a la Ley 2251: la velocidad en zona escolar es de 30 km/h innegociable.'
      },
      {
        id: 'opt-b',
        text: 'Mantener con firmeza y calma tus 30 km/h sin ceder a la presión psicológica agresiva.',
        percentage: 91,
        isCorrect: true,
        critique: '¡Excelente conducta defensiva! La vida de los menores prima sobre el afán de cualquier conductor.'
      },
      {
        id: 'opt-c',
        text: 'Frenar de golpe para asustar al conductor impaciente y obligarlo a guardar distancia.',
        percentage: 3,
        isCorrect: false,
        critique: 'Conducción agresiva y temeraria con alto riesgo de generar un choque en cadena.'
      }
    ],
    legalReference: 'Ley 2251 de 2022 (Ley Julián Esteban) Art. 106',
    legalExplanation: 'La Ley 2251 prohíbe exceder los 30 km/h en zonas escolares y residenciales bajo cualquier circunstancia.',
    defensiveTip: 'No dejes que conductores agresivos dicten tu velocidad en zonas de alta vulnerabilidad.'
  },
  {
    id: 'dil-3',
    situation: 'Entras a una glorieta de dos carriles y vas a tomar la tercera salida (hacia la izquierda de tu sentido inicial).',
    context: 'Glorieta concurrida de dos carriles',
    location: 'Glorieta de La Aguacatala',
    options: [
      {
        id: 'opt-a',
        text: 'Permanecer en el carril exterior derecho durante toda la vuelta hasta tu salida.',
        percentage: 17,
        isCorrect: false,
        critique: 'Infracción: el carril derecho en glorieta es para quienes salen en la primera o segunda salida.'
      },
      {
        id: 'opt-b',
        text: 'Ingresar por el carril interior izquierdo y pasar con anticipación señalizada al carril derecho antes de salir.',
        percentage: 80,
        isCorrect: true,
        critique: '¡Correcto! En glorietas, salidas a la izquierda o retornos requieren circular por el carril interno.'
      },
      {
        id: 'opt-c',
        text: 'Pitar duro para que los demás carros te abran espacio directo sin importar el carril.',
        percentage: 3,
        isCorrect: false,
        critique: 'El uso abusivo de la bocina está prohibido y genera confusión en rotondas.'
      }
    ],
    legalReference: 'Art. 70 Ley 769 de 2002 - Prelación en Glorietas',
    legalExplanation: 'El Código Nacional de Tránsito establece que dentro de la glorieta quien circula tiene prelación, y los cambios de carril deben anticiparse con direccional.',
    defensiveTip: 'Nunca intentes salir de una glorieta directamente desde el carril interior izquierdo sin pasarte antes al derecho.'
  },
  {
    id: 'dil-4',
    situation: 'En una vía intermunicipal con doble línea continua amarilla ves a un ciclista adelante. Para adelantarlo debes invadir el carril opuesto.',
    context: 'Vía sinuosa • Doble línea continua',
    location: 'Vía Las Palmas, Antioquia',
    options: [
      {
        id: 'opt-a',
        text: 'Adelantarlo rápidamente rozándolo a 40 cm para no pisar la línea amarilla del carril contrario.',
        percentage: 5,
        isCorrect: false,
        critique: 'Violación mortal: la Ley 1811 exige dejar mínimo 1.5 metros de distancia lateral con ciclistas.'
      },
      {
        id: 'opt-b',
        text: 'Tocarle la bocina repetidamente para que se tire a la cuneta o el andén.',
        percentage: 6,
        isCorrect: false,
        critique: 'Prohibido por Ley 1811: el pito asusta al ciclista y puede causarle una caída mortal.'
      },
      {
        id: 'opt-c',
        text: 'Esperar pacientemente detrás del ciclista hasta llegar a un tramo recto con visibilidad total para adelantarlo a 1.5 metros.',
        percentage: 89,
        isCorrect: true,
        critique: '¡Excelente cultura vial! La paciencia y la distancia de 1.5 metros salvan vidas.'
      }
    ],
    legalReference: 'Ley 1811 de 2016 (Ley Pro-Bici) Art. 14',
    legalExplanation: 'Todo conductor de automotor que adelante a un ciclista debe reducir la velocidad y guardar una distancia lateral no menor a 1.5 metros.',
    defensiveTip: 'El ciclista no tiene carrocería; tu paciencia es su única armadura.'
  },
  {
    id: 'dil-5',
    situation: 'Una ambulancia con sirena y baliza encendida se aproxima detrás de tu vehículo en una vía con tráfico lento.',
    context: 'Vehículo de emergencia en misión',
    location: 'Autopista Sur, Medellín',
    options: [
      {
        id: 'opt-a',
        text: 'Quedarte inmóvil en el centro de tu carril creyendo que la ambulancia sabrá esquivarte.',
        percentage: 7,
        isCorrect: false,
        critique: 'Obstaculizar un vehículo de emergencia cuesta minutos vitales para la persona auxiliada.'
      },
      {
        id: 'opt-b',
        text: 'Señalizar y orillarte de inmediato al costado derecho de la calzada de forma segura para dejar el carril libre.',
        percentage: 91,
        isCorrect: true,
        critique: '¡Conducta ejemplar! Todo conductor debe despejar la vía de inmediato ante vehículos de emergencia.'
      },
      {
        id: 'opt-c',
        text: 'Pegarte detrás de la ambulancia para aprovechar el trancón y avanzar más rápido.',
        percentage: 2,
        isCorrect: false,
        critique: 'Infracción grave: seguir de cerca a vehículos de emergencia genera comparendo e inmovilización.'
      }
    ],
    legalReference: 'Art. 64 Ley 769 de 2002 - Vehículos de Emergencia',
    legalExplanation: 'Los vehículos de emergencia en servicio tienen prelación absoluta; los demás conductores deben situarse en el costado derecho y detenerse si es necesario.',
    defensiveTip: 'Facilitar el paso de una ambulancia es tanto un deber legal como humanitario.'
  }
];

interface CommunityPollsGameProps {
  onBackToHub: () => void;
  onRecordScore?: (score: number) => void;
}

export const CommunityPollsGame: React.FC<CommunityPollsGameProps> = ({
  onBackToHub,
  onRecordScore
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const currentDilemma = DILEMMAS_DATA[currentIndex];

  const handleVote = (option: PollOption) => {
    if (hasVoted) return;

    soundEngine.playClick();
    setSelectedOptionId(option.id);
    setHasVoted(true);

    if (option.isCorrect) {
      soundEngine.playSuccess();
      setCorrectCount(prev => prev + 1);
    } else {
      soundEngine.playError();
    }
  };

  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex + 1 < DILEMMAS_DATA.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setHasVoted(false);
    } else {
      setGameFinished(true);
      soundEngine.playComplete();
      soundEngine.playConfettiPop();
      if (onRecordScore) {
        const score = Math.round(((correctCount + (currentDilemma.options.find(o => o.id === selectedOptionId)?.isCorrect ? 0 : 0)) / DILEMMAS_DATA.length) * 100);
        onRecordScore(score);
      }
    }
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasVoted(false);
    setCorrectCount(0);
    setGameFinished(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {gameFinished && <QuizConfetti />}

      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Volver a Modos de Quiz"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-[#00AFFF] tracking-wider">
                EDUCAPLAY STYLE • ENCUESTAS Y DILEMAS EN VÍA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                Comunidad en Vivo
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Dilemas y Encuestas de Conducción
            </h2>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Users size={15} className="text-[#0052cc] dark:text-[#00AFFF]" />
            <span>Caso {currentIndex + 1} de {DILEMMAS_DATA.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={15} />
            <span>{correctCount} Aciertos Legales</span>
          </div>
        </div>
      </div>

      {/* Main Dilemma Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Top Badges: Context & Location */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0052cc] dark:text-sky-300 text-xs font-bold border border-blue-200 dark:border-blue-900">
            📍 {currentDilemma.location}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {currentDilemma.context}
          </span>
        </div>

        {/* Dilemma Question Title */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={15} />
            <span>Situación de Decisión Inmediata:</span>
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
            "{currentDilemma.situation}"
          </h3>
        </div>

        {/* Options / Poll voting buttons */}
        <div className="space-y-3">
          {currentDilemma.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showVerdict = hasVoted;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleVote(option)}
                disabled={hasVoted}
                whileHover={!hasVoted ? { scale: 1.01 } : {}}
                whileTap={!hasVoted ? { scale: 0.99 } : {}}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  !showVerdict
                    ? 'bg-slate-50 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#0052cc]'
                    : option.isCorrect
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500 shadow-md'
                      : isSelected
                        ? 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* Background Community Percentage Bar */}
                {showVerdict && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 opacity-15 pointer-events-none ${
                      option.isCorrect ? 'bg-emerald-500' : 'bg-slate-500'
                    }`}
                  />
                )}

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      !showVerdict
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : option.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {showVerdict && option.isCorrect ? (
                        <CheckCircle2 size={16} />
                      ) : showVerdict && isSelected ? (
                        <XCircle size={16} />
                      ) : (
                        option.id.replace('opt-', '').toUpperCase()
                      )}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {option.text}
                    </span>
                  </div>

                  {/* Percentage badge */}
                  {showVerdict && (
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-black ${
                        option.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                      }`}>
                        {option.percentage}%
                      </span>
                      <span className="block text-[10px] text-slate-400 font-semibold">
                        Comunidad
                      </span>
                    </div>
                  )}
                </div>

                {/* Critique text after voting */}
                {showVerdict && isSelected && (
                  <div className="relative z-10 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {option.critique}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legal Feedback & Next Button (Shows after vote) */}
        <AnimatePresence>
          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-5 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#0052cc] dark:text-sky-400 flex items-center gap-1.5">
                    <Scale size={15} />
                    <span>Fundamento Legal Mintransporte</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {currentDilemma.legalReference}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {currentDilemma.legalExplanation}
                </p>
                <div className="pt-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Tip de Conducción Defensiva: {currentDilemma.defensiveTip}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-6 bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currentIndex + 1 < DILEMMAS_DATA.length ? 'Siguiente Dilema' : 'Ver Resultados Finales'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {gameFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce">
                <Trophy size={34} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] dark:text-[#00AFFF]">
                  ¡DILEMAS VIALES COMPLETADOS!
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Criterio de Conductor Seguro
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Has evaluado con éxito los {DILEMMAS_DATA.length} dilemas viales con un balance de{' '}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{correctCount} decisiones legales correctas</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400">Aciertos</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {correctCount} / {DILEMMAS_DATA.length}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Nivel Defensivo</span>
                  <p className="text-xl font-black text-[#0052cc] dark:text-[#00AFFF]">
                    {correctCount >= 4 ? 'Avanzado ⭐' : 'En Formación'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Repetir Encuestas
                </button>
                <button
                  type="button"
                  onClick={onBackToHub}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Otros Quizzes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
