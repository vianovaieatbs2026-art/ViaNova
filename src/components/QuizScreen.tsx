import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getQuizTopics } from '../data/quizData';
import { QuizTopic, ExamQuestion, UserProfile } from '../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Scale, 
  BookOpen, 
  FileCheck2,
  Flame,
  Sparkles,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getActiveUserSession } from '../utils/authStorage';
import { recordUserQuizScore } from '../utils/userProgress';
import { TrafficSignGraphic } from './TrafficSignGraphic';

interface QuizScreenProps {
  user?: UserProfile | null;
  onNavigateToEducation: () => void;
  onNavigateToSimulator: () => void;
}

interface QuestionAnswerRecord {
  question: ExamQuestion;
  selectedOption: number;
  isCorrect: boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  user,
  onNavigateToEducation,
  onNavigateToSimulator
}) => {
  const { language, t } = useThemeLanguage();
  const topics = getQuizTopics(language);
  
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<QuestionAnswerRecord[]>([]);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isZoomedSign, setIsZoomedSign] = useState<boolean>(false);

  const activeTopic = topics.find(tp => tp.id === activeTopicId) || null;

  // Sound disabled per user requirements
  const playSound = (_type: 'correct' | 'wrong' | 'click' | 'complete') => {};

  const startTopic = (topic: QuizTopic) => {
    playSound('click');
    setActiveTopicId(topic.id);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalPoints(0);
    setAnswersHistory([]);
    setShowReviewList(false);
    setShowHint(false);
    setQuizFinished(false);
  };

  const handleSelectOption = (index: number) => {
    if (!isAnswerSubmitted) {
      playSound('click');
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !activeTopic) return;
    setIsAnswerSubmitted(true);
    const question = activeTopic.questions[currentQuestionIdx];
    const isCorrect = selectedOption === question.correctIndex;

    // Record answer
    setAnswersHistory(prev => [
      ...prev,
      {
        question,
        selectedOption,
        isCorrect
      }
    ]);

    if (isCorrect) {
      playSound('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      setScore(prev => prev + 1);
      // Points: 100 base + 25 per streak count
      const earned = 100 + (newStreak > 1 ? (newStreak - 1) * 25 : 0);
      setTotalPoints(prev => prev + earned);
    } else {
      playSound('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (!activeTopic) return;
    playSound('click');
    setShowHint(false);
    
    if (currentQuestionIdx + 1 < activeTopic.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      playSound('complete');
      const activeUser = user || getActiveUserSession();
      if (activeUser?.email && activeTopic.questions.length > 0) {
        const finalScore = score + (selectedOption === activeTopic.questions[currentQuestionIdx]?.correctIndex && !isAnswerSubmitted ? 1 : 0);
        const scoreOutOf10 = Math.round((finalScore / activeTopic.questions.length) * 10 * 10) / 10;
        recordUserQuizScore(activeUser.email, scoreOutOf10);
      }
    }
  };

  const handleRestart = () => {
    if (activeTopic) {
      startTopic(activeTopic);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* ===================== 1. CATEGORY SELECTION SCREEN ===================== */}
      {!activeTopic ? (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 text-xs font-bold mb-3 border border-blue-100 dark:border-blue-900/50 shadow-xs">
              <Sparkles size={14} />
              <span>{t('quiz_questions_10_badge', 'Quizzes Interactivos de 10 Preguntas')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
              {t('quiz_page_title', 'Quizzes Rápidos de Tránsito Colombia')}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 mt-2.5 leading-relaxed max-w-2xl mx-auto">
              {t('quiz_page_sub', 'Pon a prueba tus conocimientos en rondas de 10 preguntas con señales de tránsito en alta definición, animaciones interactivas, rachas y retroalimentación oficial de Mintransporte.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topics.map((topic, index) => {
              const isVisualTopic = topic.id === 'quiz-adivina-senales';
              return (
                <motion.div 
                  key={topic.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden ${
                    isVisualTopic 
                      ? 'border-[#0052cc] dark:border-sky-500 ring-2 ring-[#0052cc]/10 dark:ring-sky-500/20' 
                      : 'border-[#e2e8f0] dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-500'
                  }`}
                >
                  {isVisualTopic && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0052cc] to-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs flex items-center gap-1">
                      <Eye size={12} />
                      <span>¡Nuevo Reto Visual!</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {isVisualTopic ? (
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                          <TrafficSignGraphic signCode="SR-01" signType="sr-01" size="sm" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] dark:bg-slate-800 text-[#0052cc] dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-[#0052cc] group-hover:text-white transition-colors shadow-xs">
                          <Award size={26} />
                        </div>
                      )}

                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#0f172a] dark:text-white leading-tight">
                          {topic.title}
                        </h2>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0052cc] dark:text-sky-400 mt-1">
                          <Target size={12} />
                          <span>10 Preguntas Oficiales</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mb-5 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Preview of signs if visual quiz */}
                    {isVisualTopic && (
                      <div className="p-3 bg-[#f8fafc] dark:bg-slate-800/70 rounded-xl border border-[#e2e8f0] dark:border-slate-700/60 mb-4 flex items-center justify-around">
                        <TrafficSignGraphic signCode="SR-01" signType="sr-01" size="sm" />
                        <TrafficSignGraphic signCode="SR-02" signType="sr-02" size="sm" />
                        <TrafficSignGraphic signCode="SR-30" signType="sr-30-50" size="sm" />
                        <TrafficSignGraphic signCode="SP-40" signType="sp-40" size="sm" />
                        <TrafficSignGraphic signCode="SI-01" signType="si-01" size="sm" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#475569] dark:text-slate-400 border-t border-[#f1f5f9] dark:border-slate-800 pt-3.5 mb-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {topic.questionCount} preguntas
                      </span>
                      <span>{topic.durationMinutes} min aprox.</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startTopic(topic)}
                      className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                        isVisualTopic
                          ? 'bg-[#0052cc] text-white hover:bg-[#0043a8]'
                          : 'bg-[#0f172a] text-white hover:bg-slate-800 dark:bg-[#0052cc] dark:hover:bg-[#0043a8]'
                      }`}
                    >
                      <span>{t('quiz_start_btn', 'Iniciar Quiz de 10 Preguntas')}</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick study banner */}
          <div className="mt-8 p-6 bg-[#f8fafc] dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-slate-800 text-[#0052cc] dark:text-sky-400 flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">
                  {t('quiz_prefer_study_title', '¿Prefieres estudiar los módulos teóricos primero?')}
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                  {t('quiz_prefer_study_sub', 'Revisa la sección de Educación Vial con las leyes y normas explicadas paso a paso.')}
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToEducation}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-[#334155] dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-[#f1f5f9] dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              {t('quiz_see_modules_btn', 'Ver Módulos de Educación')}
            </button>
          </div>
        </div>
      ) : quizFinished ? (
        /* ===================== 2. QUIZ COMPLETED RESULTS SCREEN ===================== */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md ${
              score >= 8 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white' 
                : score >= 6 
                ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'
                : 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white'
            }`}
          >
            {score >= 8 ? <Trophy size={42} /> : score >= 6 ? <Award size={42} /> : <Target size={42} />}
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white mb-1 tracking-tight">
            {t('quiz_completed_title', '¡Quiz Completado!')}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-400 mb-6">
            {activeTopic.title}
          </p>

          {/* Score Card with Statistics */}
          <div className="p-6 bg-[#f8fafc] dark:bg-slate-800/80 rounded-2xl border border-[#e2e8f0] dark:border-slate-700 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pb-4 border-b border-[#e2e8f0] dark:border-slate-700">
              {/* Primary Score */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748b] dark:text-slate-400 block mb-1">
                  Puntaje Total
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#0052cc] dark:text-sky-400 tracking-tight">
                  {score} <span className="text-xl sm:text-2xl text-[#94a3b8] dark:text-slate-500">/ 10</span>
                </div>
                <div className="text-xs font-bold text-[#475569] dark:text-slate-300 mt-1">
                  {Math.round((score / 10) * 100)}% de efectividad
                </div>
              </div>

              {/* Points Earned */}
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748b] dark:text-slate-400 block mb-1">
                  Puntos Viales
                </span>
                <div className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <Zap size={24} className="fill-amber-500" />
                  <span>+{totalPoints}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">acumulados</span>
              </div>

              {/* Best Streak */}
              <div className="text-center">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748b] dark:text-slate-400 block mb-1">
                  Mayor Racha
                </span>
                <div className="text-3xl font-black text-orange-500 flex items-center justify-center gap-1">
                  <Flame size={24} className="fill-orange-500" />
                  <span>{maxStreak}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">aciertos seguidos</span>
              </div>
            </div>

            {/* Performance message */}
            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 mt-4 leading-relaxed font-medium">
              {score === 10
                ? '¡Puntaje Perfecto! Tienes un dominio impecable del Código Nacional de Tránsito y Señalización de Colombia. 🏆🥇'
                : score >= 8
                ? '¡Excelente trabajo! Aprobaste con honores. Tus conocimientos en seguridad vial son sólidos y confiables. 🌟'
                : score >= 6
                ? 'Buen intento. Conoces las normas básicas, pero te recomendamos repasar los conceptos en los que tuviste dudas.'
                : 'Puntaje bajo. Te aconsejamos estudiar los módulos de Educación Vial para afianzar tus conocimientos antes de salir a la vía.'}
            </p>
          </div>

          {/* Toggle Question-by-Question Review */}
          <div className="mb-6">
            <button
              onClick={() => setShowReviewList(prev => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0052cc] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900 transition-colors cursor-pointer"
            >
              <span>{showReviewList ? t('quiz_hide_review_btn', 'Ocultar Revisión') : t('quiz_review_btn', 'Revisar las 10 Preguntas y Respuestas')}</span>
              {showReviewList ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {/* Detailed Review Accordion */}
            <AnimatePresence>
              {showReviewList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-left space-y-3 overflow-hidden"
                >
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#64748b] dark:text-slate-400 px-1">
                    {t('quiz_review_title', 'Revisión Pregunta por Pregunta')}:
                  </h3>

                  {answersHistory.map((record, rIdx) => (
                    <div
                      key={rIdx}
                      className={`p-4 rounded-xl border text-xs leading-relaxed ${
                        record.isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                          : 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 ${
                            record.isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                          }`}>
                            {rIdx + 1}
                          </span>
                          <span className="font-bold text-[#0f172a] dark:text-white">
                            {record.question.category}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold flex items-center gap-1 ${
                          record.isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                        }`}>
                          {record.isCorrect ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Correcto</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={13} />
                              <span>Incorrecto</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Optional Sign Graphic in review */}
                      {(record.question.signCode || record.question.signType) && (
                        <div className="my-2.5 flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-[#e2e8f0] dark:border-slate-700 w-fit">
                          <TrafficSignGraphic
                            signCode={record.question.signCode}
                            signType={record.question.signType}
                            size="sm"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-[#0052cc] dark:text-sky-400 uppercase block">
                              {record.question.signCode}
                            </span>
                            <span className="text-[11px] text-[#475569] dark:text-slate-300 font-medium">
                              Señal Oficial
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="font-semibold text-[#1e293b] dark:text-slate-200 mb-2">
                        {record.question.question}
                      </p>

                      <div className="space-y-1 mb-2 text-[11px]">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-500 dark:text-slate-400">Tu selección:</span>
                          <span className={record.isCorrect ? 'text-emerald-800 dark:text-emerald-300 font-medium' : 'text-red-700 dark:text-red-300 font-medium line-through'}>
                            {record.question.options[record.selectedOption]}
                          </span>
                        </div>
                        {!record.isCorrect && (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">Respuesta correcta:</span>
                            <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                              {record.question.options[record.question.correctIndex]}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-white/70 dark:bg-slate-800/80 rounded-lg text-[11px] text-[#475569] dark:text-slate-300 border border-black/5">
                        <span className="font-bold text-[#0f172a] dark:text-white mr-1">Explicación:</span>
                        {record.question.explanation}
                        {record.question.legalReference && (
                          <span className="block mt-1 font-semibold text-[#0052cc] dark:text-sky-400">
                            Norma: {record.question.legalReference}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-xl border border-[#cbd5e1] dark:border-slate-700 text-[#334155] dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <RotateCcw size={15} />
              <span>{t('quiz_repeat_btn', 'Repetir Quiz')}</span>
            </button>

            <button
              onClick={() => setActiveTopicId(null)}
              className="px-5 py-3 rounded-xl bg-[#0052cc] text-white text-xs sm:text-sm font-bold hover:bg-[#0043a8] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t('quiz_choose_other_btn', 'Elegir Otro Quiz')}</span>
            </button>

            <button
              onClick={onNavigateToSimulator}
              className="px-5 py-3 rounded-xl bg-[#0f172a] dark:bg-slate-800 text-white text-xs sm:text-sm font-bold hover:bg-[#1e293b] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <FileCheck2 size={15} />
              <span>{t('edu_go_to_simulator', 'Ir al Simulador RUNT')}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* ===================== 3. ACTIVE QUIZ (10 QUESTIONS) ===================== */
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
          {/* Header of Active Quiz with Progress and Streak */}
          <div className="border-b border-[#f1f5f9] dark:border-slate-800 pb-5 mb-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0052cc] dark:text-sky-400">
                  {activeTopic.title}
                </span>
                <h2 className="text-sm font-bold text-[#0f172a] dark:text-white">
                  Pregunta {currentQuestionIdx + 1} de {activeTopic.questions.length}
                </h2>
              </div>

              {/* Status Badges: Streak & Points */}
              <div className="flex items-center gap-2.5">
                {streak > 1 && (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-black shadow-xs border border-orange-200 dark:border-orange-800"
                  >
                    <Flame size={14} className="fill-orange-500 animate-bounce" />
                    <span>{streak} en Racha</span>
                  </motion.div>
                )}

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <Zap size={13} className="fill-amber-500" />
                  <span>{totalPoints} pts</span>
                </div>

                <button
                  onClick={() => setActiveTopicId(null)}
                  className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t('quiz_exit_btn', 'Salir')}
                </button>
              </div>
            </div>

            {/* Smooth animated progress bar */}
            <div className="w-full bg-[#f1f5f9] dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0052cc] to-sky-400 rounded-full"
                initial={{ width: `${(currentQuestionIdx / activeTopic.questions.length) * 100}%` }}
                animate={{ width: `${((currentQuestionIdx + (isAnswerSubmitted ? 1 : 0.4)) / activeTopic.questions.length) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            {/* Step markers indicator */}
            <div className="flex justify-between items-center mt-2 px-0.5">
              {activeTopic.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx < currentQuestionIdx
                      ? 'bg-[#0052cc] dark:bg-sky-400'
                      : idx === currentQuestionIdx
                      ? 'bg-[#0052cc] ring-3 ring-[#0052cc]/20 dark:ring-sky-400/30'
                      : 'bg-[#e2e8f0] dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Question Box with Animation */}
          <AnimatePresence mode="wait">
            {(() => {
              const question: ExamQuestion = activeTopic.questions[currentQuestionIdx];
              const hasSign = Boolean(question.signCode || question.signType);

              return (
                <motion.div
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Category Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0052cc] dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
                      {question.category}
                    </span>

                    {question.signHint && (
                      <button
                        type="button"
                        onClick={() => setShowHint(prev => !prev)}
                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Info size={13} />
                        <span>{showHint ? 'Ocultar Pista' : 'Ver Pista'}</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Reveal */}
                  <AnimatePresence>
                    {showHint && question.signHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2"
                      >
                        <Info size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>{question.signHint}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* PROMINENT TRAFFIC SIGN GRAPHIC (Visual Sign Guessing Card) */}
                  {hasSign && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-6 bg-gradient-to-b from-[#f8fafc] to-[#eff6ff]/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border-2 border-[#cbd5e1] dark:border-slate-700 flex flex-col items-center justify-center text-center relative shadow-xs group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#64748b] dark:text-slate-400 mb-3 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-[#e2e8f0] dark:border-slate-800 shadow-2xs">
                        {t('quiz_sign_guess_badge', 'Señal Oficial de Tránsito de Colombia')}
                      </span>

                      {/* The Traffic Sign Graphic */}
                      <div 
                        onClick={() => setIsZoomedSign(true)}
                        className="cursor-pointer transform transition-transform group-hover:scale-105 duration-200 p-2"
                        title="Haz clic para ver más grande"
                      >
                        <TrafficSignGraphic
                          signCode={question.signCode}
                          signType={question.signType}
                          size="xl"
                          showCodeBadge={false} // Hidden initially so user must guess!
                        />
                      </div>

                      <span className="text-[11px] font-medium text-[#64748b] dark:text-slate-400 mt-2 flex items-center gap-1">
                        <Eye size={13} />
                        <span>{t('quiz_sign_guess_prompt', 'Observa la señal e identifica su significado normativo:')}</span>
                      </span>
                    </motion.div>
                  )}

                  {/* Question Text */}
                  <div className="p-4 sm:p-5 bg-[#f8fafc] dark:bg-slate-800/90 rounded-2xl border border-[#e2e8f0] dark:border-slate-700 shadow-2xs">
                    <p className="text-base sm:text-lg font-bold text-[#0f172a] dark:text-white leading-snug">
                      {question.question}
                    </p>
                  </div>

                  {/* Options List with Interactive Feedback and Hover */}
                  <div className="space-y-3">
                    {question.options.map((option, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = oIdx === question.correctIndex;

                      let btnStyle = 'bg-white dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 hover:border-[#0052cc] text-[#334155] dark:text-slate-200';
                      if (isSelected && !isAnswerSubmitted) {
                        btnStyle = 'bg-[#eff6ff] dark:bg-blue-950/60 border-[#0052cc] dark:border-sky-500 text-[#0052cc] dark:text-sky-300 font-bold ring-2 ring-[#0052cc]/20';
                      } else if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-[#dcfce7] dark:bg-emerald-950/60 border-[#16a34a] dark:border-emerald-600 text-[#166534] dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-[#fee2e2] dark:bg-red-950/60 border-[#dc2626] dark:border-red-600 text-[#991b1b] dark:text-red-300 font-semibold';
                        } else {
                          btnStyle = 'bg-white dark:bg-slate-800 border-[#f1f5f9] dark:border-slate-800 text-[#94a3b8] opacity-50';
                        }
                      }

                      return (
                        <motion.button
                          key={oIdx}
                          whileHover={!isAnswerSubmitted ? { scale: 1.01 } : {}}
                          whileTap={!isAnswerSubmitted ? { scale: 0.99 } : {}}
                          onClick={() => handleSelectOption(oIdx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex items-center justify-between gap-3.5 text-xs sm:text-sm cursor-pointer shadow-xs ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                              isSelected && !isAnswerSubmitted
                                ? 'bg-[#0052cc] text-white'
                                : isAnswerSubmitted && isCorrect
                                ? 'bg-[#16a34a] text-white'
                                : isAnswerSubmitted && isSelected && !isCorrect
                                ? 'bg-[#dc2626] text-white'
                                : 'bg-[#f1f5f9] dark:bg-slate-700 text-[#475569] dark:text-slate-200'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="leading-snug">{option}</span>
                          </div>

                          {isAnswerSubmitted && isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <CheckCircle2 size={20} className="text-[#16a34a] dark:text-emerald-400 shrink-0" />
                            </motion.div>
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <XCircle size={20} className="text-[#dc2626] dark:text-red-400 shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Animated Explanation Card after submitting */}
                  <AnimatePresence>
                    {isAnswerSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed shadow-xs ${
                          selectedOption === question.correctIndex 
                            ? 'bg-[#f0fdf4] dark:bg-emerald-950/40 border-[#bbf7d0] dark:border-emerald-800 text-[#166534] dark:text-emerald-200'
                            : 'bg-[#fff1f2] dark:bg-red-950/40 border-[#fecdd3] dark:border-red-800 text-[#9f1239] dark:text-red-200'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Scale size={16} />
                            <span className="text-sm font-black">
                              {selectedOption === question.correctIndex 
                                ? t('quiz_feedback_correct', '¡Correcto!') 
                                : t('quiz_feedback_incorrect', 'Incorrecto')}
                            </span>
                          </div>

                          {selectedOption === question.correctIndex && (
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                              +100 Pts
                            </span>
                          )}
                        </div>

                        <p className="text-[#334155] dark:text-slate-300 text-xs sm:text-sm font-normal">
                          {question.explanation}
                        </p>

                        {question.legalReference && (
                          <p className="text-[11px] font-bold text-[#0052cc] dark:text-sky-400 mt-2.5 border-t border-black/5 dark:border-white/5 pt-2">
                            {t('quiz_legal_ref', 'Referencia Legal:')} {question.legalReference}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom Action Controls */}
                  <div className="pt-4 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-[#64748b] dark:text-slate-400 font-medium">
                      Aciertos: <strong className="text-[#0f172a] dark:text-white font-bold">{score}</strong> de {currentQuestionIdx + (isAnswerSubmitted ? 1 : 0)}
                    </span>

                    {!isAnswerSubmitted ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="px-6 py-3 rounded-xl bg-[#0052cc] disabled:bg-[#cbd5e1] dark:disabled:bg-slate-700 text-white text-xs sm:text-sm font-bold hover:bg-[#0043a8] transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                      >
                        {t('quiz_btn_submit_ans', 'Confirmar Respuesta')}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNextQuestion}
                        className="px-6 py-3 rounded-xl bg-[#0052cc] text-white text-xs sm:text-sm font-bold hover:bg-[#0043a8] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <span>
                          {currentQuestionIdx + 1 < activeTopic.questions.length 
                            ? t('quiz_btn_next_q', 'Siguiente Pregunta') 
                            : t('quiz_btn_finish', 'Finalizar y Ver Calificación')}
                        </span>
                        <ArrowRight size={15} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      )}

      {/* Modal for Zooming Sign Graphic */}
      <AnimatePresence>
        {isZoomedSign && activeTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomedSign(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full border border-slate-700 shadow-2xl flex flex-col items-center text-center"
            >
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Detalle de Señal Vial
              </h4>
              <TrafficSignGraphic
                signCode={activeTopic.questions[currentQuestionIdx]?.signCode}
                signType={activeTopic.questions[currentQuestionIdx]?.signType}
                size="xl"
              />
              <button
                onClick={() => setIsZoomedSign(false)}
                className="mt-6 px-6 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
