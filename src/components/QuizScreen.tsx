import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  Target, 
  Zap, 
  Volume2, 
  VolumeX, 
  Flame, 
  Clock, 
  Layers, 
  Check, 
  Shuffle, 
  BookOpen, 
  Trophy, 
  FileCheck2,
  AlertTriangle,
  Lightbulb,
  Filter,
  Camera,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { 
  getQuizTopics, 
  MATCH_SIGNS_DATA, 
  FILL_BLANKS_CHALLENGES, 
  RAPID_FIRE_QUESTIONS,
  QUIZ_MOTIVATIONAL_MESSAGES,
  QUIZ_MOTIVATIONAL_MESSAGES_EN,
  MatchSignItem,
  FillBlankChallenge,
  RapidFireQuestion
} from '../data/quizData';
import { QuizTopic, ExamQuestion, UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getActiveUserSession } from '../utils/authStorage';
import { recordUserQuizScore } from '../utils/userProgress';
import { soundEngine } from '../utils/soundEffects';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { QuizQuestionVisual } from './QuizQuestionVisual';
import { WordSearchGame } from './quiz/WordSearchGame';
import { CrosswordGame } from './quiz/CrosswordGame';
import { CommunityPollsGame } from './quiz/CommunityPollsGame';
import { QuizConfetti } from './quiz/QuizConfetti';

interface QuizScreenProps {
  user?: UserProfile | null;
  onNavigateToEducation?: () => void;
  onNavigateToSimulator?: () => void;
}

type QuizGameMode = 
  | 'hub' 
  | 'matching' 
  | 'fill_blanks' 
  | 'rapid_fire' 
  | 'crossword' 
  | 'word_search' 
  | 'polls' 
  | 'traditional';

export const QuizScreen: React.FC<QuizScreenProps> = ({
  user
}) => {
  const { language, t } = useThemeLanguage();
  const topics = getQuizTopics(language);

  // Active game mode: hub, matching, fill_blanks, rapid_fire, traditional
  const [gameMode, setGameMode] = useState<QuizGameMode>('hub');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.isMuted());

  const handleToggleSound = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  };

  // Filter in Hub view
  const [hubCategoryFilter, setHubCategoryFilter] = useState<'all' | 'word_puzzles' | 'speed' | 'polls' | 'matching' | 'thematic'>('all');

  const handleRecordQuizScore = (scoreOutOf100: number) => {
    const activeUser = user || getActiveUserSession();
    if (activeUser?.email) {
      const scaledScore = Math.max(1, Math.round(scoreOutOf100 / 10));
      recordUserQuizScore(activeUser.email, scaledScore);
    }
  };

  const initCrosswordGame = () => {
    soundEngine.playClick();
    setGameMode('crossword');
  };

  const initWordSearchGame = () => {
    soundEngine.playClick();
    setGameMode('word_search');
  };

  const initPollsGame = () => {
    soundEngine.playClick();
    setGameMode('polls');
  };

  // =========================================================================
  // 1. MODO DIDÁCTICO: EMPAREJAR SEÑALES Y REGLAS (MATCHING)
  // =========================================================================
  const [matchSigns, setMatchSigns] = useState<MatchSignItem[]>([]);
  const [shuffledRules, setShuffledRules] = useState<{ id: string; rule: string }[]>([]);
  const [selectedSignId, setSelectedSignId] = useState<string | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchAttempts, setMatchAttempts] = useState<number>(0);
  const [matchTimerSeconds, setMatchTimerSeconds] = useState<number>(0);
  const [matchGameFinished, setMatchGameFinished] = useState<boolean>(false);
  const [wrongShakeSignId, setWrongShakeSignId] = useState<string | null>(null);
  const [wrongShakeRuleId, setWrongShakeRuleId] = useState<string | null>(null);

  const initMatchingGame = () => {
    soundEngine.playClick();
    const sample = [...MATCH_SIGNS_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    setMatchSigns(sample);

    const rules = sample
      .map(s => ({ id: s.id, rule: s.rule }))
      .sort(() => 0.5 - Math.random());
    setShuffledRules(rules);

    setSelectedSignId(null);
    setSelectedRuleId(null);
    setMatchedPairs([]);
    setMatchAttempts(0);
    setMatchTimerSeconds(0);
    setMatchGameFinished(false);
    setGameMode('matching');
  };

  // Match timer
  useEffect(() => {
    if (gameMode !== 'matching' || matchGameFinished) return;
    const interval = setInterval(() => {
      setMatchTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameMode, matchGameFinished]);

  const handleSelectMatchSign = (id: string) => {
    if (matchedPairs.includes(id)) return;
    soundEngine.playClick();
    setSelectedSignId(id);

    if (selectedRuleId) {
      checkMatch(id, selectedRuleId);
    }
  };

  const handleSelectMatchRule = (id: string) => {
    if (matchedPairs.includes(id)) return;
    soundEngine.playClick();
    setSelectedRuleId(id);

    if (selectedSignId) {
      checkMatch(selectedSignId, id);
    }
  };

  const checkMatch = (signId: string, ruleId: string) => {
    setMatchAttempts(prev => prev + 1);

    if (signId === ruleId) {
      // MATCH CORRECTO
      soundEngine.playSuccess();
      const updated = [...matchedPairs, signId];
      setMatchedPairs(updated);
      setSelectedSignId(null);
      setSelectedRuleId(null);

      if (updated.length === matchSigns.length) {
        setMatchGameFinished(true);
        soundEngine.playComplete();
        const activeUser = user || getActiveUserSession();
        if (activeUser?.email) {
          recordUserQuizScore(activeUser.email, 10);
        }
      }
    } else {
      // MATCH INCORRECTO
      soundEngine.playError();
      setWrongShakeSignId(signId);
      setWrongShakeRuleId(ruleId);
      setTimeout(() => {
        setWrongShakeSignId(null);
        setWrongShakeRuleId(null);
        setSelectedSignId(null);
        setSelectedRuleId(null);
      }, 700);
    }
  };

  // =========================================================================
  // 2. MODO DIDÁCTICO: RELLENAR HUECOS (FILL IN THE BLANKS)
  // =========================================================================
  const [fillChallengeIdx, setFillChallengeIdx] = useState<number>(0);
  const [userFilledWords, setUserFilledWords] = useState<string[]>([]);
  const [fillSubmitted, setFillSubmitted] = useState<boolean>(false);
  const [fillIsCorrect, setFillIsCorrect] = useState<boolean>(false);
  const [fillScore, setFillScore] = useState<number>(0);
  const [fillFinished, setFillFinished] = useState<boolean>(false);

  const initFillBlanksGame = () => {
    soundEngine.playClick();
    setFillChallengeIdx(0);
    setUserFilledWords([]);
    setFillSubmitted(false);
    setFillIsCorrect(false);
    setFillScore(0);
    setFillFinished(false);
    setGameMode('fill_blanks');
  };

  const currentFillChallenge = FILL_BLANKS_CHALLENGES[fillChallengeIdx] || FILL_BLANKS_CHALLENGES[0];

  const handlePlaceWordInBlank = (word: string) => {
    if (fillSubmitted) return;
    soundEngine.playClick();

    if (userFilledWords.length < currentFillChallenge.correctWords.length) {
      setUserFilledWords(prev => [...prev, word]);
    }
  };

  const handleRemoveWordFromBlank = (index: number) => {
    if (fillSubmitted) return;
    soundEngine.playClick();
    setUserFilledWords(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckFillAnswer = () => {
    if (userFilledWords.length !== currentFillChallenge.correctWords.length) return;

    const allCorrect = currentFillChallenge.correctWords.every(
      (expected, idx) => expected.toLowerCase() === (userFilledWords[idx] || '').toLowerCase()
    );

    setFillSubmitted(true);
    setFillIsCorrect(allCorrect);

    if (allCorrect) {
      soundEngine.playSuccess();
      setFillScore(prev => prev + 1);
    } else {
      soundEngine.playError();
    }
  };

  const handleNextFillChallenge = () => {
    soundEngine.playClick();
    if (fillChallengeIdx + 1 < FILL_BLANKS_CHALLENGES.length) {
      setFillChallengeIdx(prev => prev + 1);
      setUserFilledWords([]);
      setFillSubmitted(false);
      setFillIsCorrect(false);
    } else {
      setFillFinished(true);
      soundEngine.playComplete();
      const activeUser = user || getActiveUserSession();
      if (activeUser?.email) {
        const scoreOutOf10 = Math.round((fillScore / FILL_BLANKS_CHALLENGES.length) * 10);
        recordUserQuizScore(activeUser.email, scoreOutOf10);
      }
    }
  };

  // =========================================================================
  // 3. MODO RETO CONTRA RELOJ: ¿VERDADERO O FALSO? (RAPID FIRE)
  // =========================================================================
  const [rfIndex, setRfIndex] = useState<number>(0);
  const [rfTimeLeft, setRfTimeLeft] = useState<number>(10);
  const [rfStreak, setRfStreak] = useState<number>(0);
  const [rfMaxStreak, setRfMaxStreak] = useState<number>(0);
  const [rfScore, setRfScore] = useState<number>(0);
  const [rfAnswered, setRfAnswered] = useState<boolean>(false);
  const [rfLastCorrect, setRfLastCorrect] = useState<boolean | null>(null);
  const [rfFinished, setRfFinished] = useState<boolean>(false);

  const currentRfQuestion = RAPID_FIRE_QUESTIONS[rfIndex] || RAPID_FIRE_QUESTIONS[0];

  const initRapidFireGame = () => {
    soundEngine.playClick();
    setRfIndex(0);
    setRfTimeLeft(10);
    setRfStreak(0);
    setRfMaxStreak(0);
    setRfScore(0);
    setRfAnswered(false);
    setRfLastCorrect(null);
    setRfFinished(false);
    setGameMode('rapid_fire');
  };

  // 10s countdown timer per question
  useEffect(() => {
    if (gameMode !== 'rapid_fire' || rfAnswered || rfFinished) return;

    if (rfTimeLeft <= 0) {
      // Time is up -> count as wrong answer
      handleRapidFireAnswer(null);
      return;
    }

    if (rfTimeLeft <= 3) {
      soundEngine.playTick();
    }

    const timer = setTimeout(() => {
      setRfTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameMode, rfTimeLeft, rfAnswered, rfFinished]);

  const handleRapidFireAnswer = (userChoice: boolean | null) => {
    if (rfAnswered) return;
    setRfAnswered(true);

    const isCorrect = userChoice !== null && userChoice === currentRfQuestion.isTrue;
    setRfLastCorrect(isCorrect);

    if (isCorrect) {
      soundEngine.playSuccess();
      const nextStreak = rfStreak + 1;
      setRfStreak(nextStreak);
      if (nextStreak > rfMaxStreak) setRfMaxStreak(nextStreak);
      setRfScore(prev => prev + 1);
      if (nextStreak >= 3) {
        setTimeout(() => soundEngine.playStreak(), 200);
      }
    } else {
      soundEngine.playError();
      setRfStreak(0);
    }
  };

  const handleNextRapidFireQuestion = () => {
    soundEngine.playClick();
    if (rfIndex + 1 < RAPID_FIRE_QUESTIONS.length) {
      setRfIndex(prev => prev + 1);
      setRfTimeLeft(10);
      setRfAnswered(false);
      setRfLastCorrect(null);
    } else {
      setRfFinished(true);
      soundEngine.playComplete();
      const activeUser = user || getActiveUserSession();
      if (activeUser?.email) {
        recordUserQuizScore(activeUser.email, rfScore);
      }
    }
  };

  // =========================================================================
  // 4. MODO CLÁSICO: QUIZ TRADICIONAL Y VISUAL POR PREGUNTAS
  // =========================================================================
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [tradScore, setTradScore] = useState<number>(0);
  const [tradWrongCount, setTradWrongCount] = useState<number>(0);
  const [tradStreak, setTradStreak] = useState<number>(0);
  const [tradQuizFinished, setTradQuizFinished] = useState<boolean>(false);
  const [feedbackData, setFeedbackData] = useState<{ title: string; subtitle: string; isCorrect: boolean } | null>(null);
  const [topicFilter, setTopicFilter] = useState<'all' | 'visual' | 'facil' | 'medio' | 'dificil'>('all');

  const activeTopic = topics.find(tp => tp.id === activeTopicId) || null;

  const startTopic = (topic: QuizTopic) => {
    soundEngine.playClick();
    setActiveTopicId(topic.id);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTradScore(0);
    setTradWrongCount(0);
    setTradStreak(0);
    setFeedbackData(null);
    setTradQuizFinished(false);
    setGameMode('traditional');
  };

  // Retroalimentación INMEDIATA al seleccionar respuesta
  const handleSelectTradOption = (index: number) => {
    if (isAnswerSubmitted || !activeTopic) return;

    const question = activeTopic.questions[currentQuestionIdx];
    const isCorrect = index === question.correctIndex;

    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    // Selección de mensaje motivador inmediato según resultado
    const motivationalPool = language === 'en'
      ? (isCorrect ? QUIZ_MOTIVATIONAL_MESSAGES_EN.correct : QUIZ_MOTIVATIONAL_MESSAGES_EN.incorrect)
      : (isCorrect ? QUIZ_MOTIVATIONAL_MESSAGES.correct : QUIZ_MOTIVATIONAL_MESSAGES.incorrect);

    const randomMsg = motivationalPool[Math.floor(Math.random() * motivationalPool.length)];
    setFeedbackData({
      title: randomMsg.title,
      subtitle: randomMsg.subtitle,
      isCorrect
    });

    if (isCorrect) {
      soundEngine.playSuccess();
      const nextStreak = tradStreak + 1;
      setTradStreak(nextStreak);
      setTradScore(prev => prev + 1);
      if (nextStreak >= 3) {
        setTimeout(() => soundEngine.playStreak(), 200);
      }
    } else {
      soundEngine.playError();
      setTradStreak(0);
      setTradWrongCount(prev => prev + 1);
    }
  };

  const handleNextTradQuestion = () => {
    if (!activeTopic) return;
    soundEngine.playClick();

    if (currentQuestionIdx + 1 < activeTopic.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setFeedbackData(null);
    } else {
      setTradQuizFinished(true);
      soundEngine.playComplete();
      const activeUser = user || getActiveUserSession();
      if (activeUser?.email && activeTopic.questions.length > 0) {
        recordUserQuizScore(activeUser.email, tradScore);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 font-sans">
      
      {/* ================= BARRA SUPERIOR CON MUTE Y RETORNO ================= */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {gameMode !== 'hub' && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setGameMode('hub');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>← Volver al Centro de Quizzes</span>
            </button>
          )}
          {gameMode === 'hub' && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#0052cc] dark:text-sky-400 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>GIMNASIO INTERACTIVO DE EDUCACIÓN VIAL</span>
            </span>
          )}
        </div>

        {/* Audio Toggle Button */}
        <button
          type="button"
          id="quiz-audio-toggle-btn"
          onClick={handleToggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
            !isMuted 
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-[#0052cc] dark:text-sky-400' 
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}
          title={isMuted ? 'Activar efectos de sonido' : 'Silenciar sonido'}
        >
          {!isMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{!isMuted ? 'Sonido Activo' : 'Silenciado'}</span>
        </button>
      </div>

      {/* =====================================================================
          1. HUB PRINCIPAL DE MODOS DE JUEGO DIDÁCTICOS INTERACTIVOS
         ===================================================================== */}
      {gameMode === 'hub' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Actividades y Quizzes <span className="text-[#0052cc] dark:text-sky-400">Interactivos</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Elige cómo deseas entrenar tus conocimientos sobre normas de tránsito colombianas. Experimenta con dinámicas interactivas inspiradas en plataformas de microaprendizaje didáctico.
            </p>
          </div>

          {/* Filtros de Modos Educativos */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setHubCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hubCategoryFilter === 'all'
                  ? 'bg-[#0052cc] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🌟 Todos los Juegos (6 Modos)
            </button>
            <button
              type="button"
              onClick={() => setHubCategoryFilter('word_puzzles')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hubCategoryFilter === 'word_puzzles'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🧩 Crucigrama y Sopa de Letras
            </button>
            <button
              type="button"
              onClick={() => setHubCategoryFilter('speed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hubCategoryFilter === 'speed'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              ⚡ Retos Rápidos
            </button>
            <button
              type="button"
              onClick={() => setHubCategoryFilter('polls')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hubCategoryFilter === 'polls'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              📊 Encuestas y Dilemas
            </button>
          </div>

          {/* 6 MODOS DIDÁCTICOS INTERACTIVOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Crucigrama Vial Interactivo */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'word_puzzles') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initCrosswordGame}
                className="group bg-gradient-to-b from-purple-500/10 via-white to-white dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-purple-400/40 hover:border-purple-600 dark:hover:border-purple-400 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <HelpCircle size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-black uppercase">
                      Juego Didáctico • Crucigrama
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Crucigrama de Normas
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Resuelve pistas horizontales y verticales sobre límites, señales oficiales, SOAT y derechos del peatón. Incluye teclado táctil y pistas.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                  <span>Jugar Crucigrama</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

            {/* 2. Sopa de Letras de Seguridad Vial */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'word_puzzles') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initWordSearchGame}
                className="group bg-gradient-to-b from-sky-500/10 via-white to-white dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-sky-400/40 hover:border-[#00AFFF] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0052cc] dark:bg-[#00AFFF] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <Sparkles size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-black uppercase">
                      Juego Didáctico • Sopa 10x10
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-[#00AFFF] transition-colors">
                    Sopa de Letras Vial
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Encuentra 10 términos de seguridad vial en la cuadrícula interactiva. Arrastra o toca las letras, gana sonidos chimes y revisa definiciones legales.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0052cc] dark:text-[#00AFFF]">
                  <span>Jugar Sopa de Letras</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

            {/* 3. Reto Contra Reloj (Rapid Fire) */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'speed') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initRapidFireGame}
                className="group bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-amber-400/40 hover:border-amber-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <Zap size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                      Reto Rápido • 10s
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    ¿Verdadero o Falso? (Relámpago)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Pon a prueba tus reflejos con barra de tiempo acelerada, efecto tic-tac de adrenalina y combos de racha por aciertos consecutivos.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>Jugar Reto Rápido</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

            {/* 4. Encuestas y Dilemas en Vía */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'polls') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initPollsGame}
                className="group bg-gradient-to-b from-emerald-500/10 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-emerald-400/40 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <BarChart3 size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                      Encuestas • En Vivo
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Dilemas y Encuestas en Vía
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Decide ante situaciones reales de tráfico colombiano y compara al instante con los porcentajes de votación de la comunidad y la ley.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Votar y Aprender</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

            {/* 5. Relacionar Columnas */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'matching') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initMatchingGame}
                className="group bg-gradient-to-b from-blue-500/10 via-white to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-blue-400/40 hover:border-[#0052cc] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0052cc] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <Shuffle size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-black uppercase">
                      Emparejar
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                    Relacionar Columnas
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Une cada señal vial con su orden de tránsito respectiva en dos columnas interactivas antes de que termine el tiempo.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0052cc] dark:text-sky-400">
                  <span>Jugar Emparejamiento</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

            {/* 6. Completar Huecos */}
            {(hubCategoryFilter === 'all' || hubCategoryFilter === 'matching') && (
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={initFillBlanksGame}
                className="group bg-gradient-to-b from-teal-500/10 via-white to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-teal-400/40 hover:border-teal-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                      <BookOpen size={22} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-black uppercase">
                      Leyes Viales
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Completar la Norma
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Inserta las palabras correctas de la Ley 2251 y el Código Nacional de Tránsito para completar las frases legales.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>Completar Frases</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}

          </div>

          {/* BANCO DE QUIZZES POR TEMAS Y VISUALES */}
          <div className="pt-4 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Quizzes Temáticos y Visuales</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-400 text-[10px] font-black uppercase">
                    Interactivo
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rondas completas de 10 preguntas con imágenes de señales de tránsito, situaciones en vivo y retroalimentación motivadora inmediata.
                </p>
              </div>

              {/* Filtros de Categoría / Dificultad */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => setTopicFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                    topicFilter === 'all'
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Todos los Quizzes
                </button>
                <button
                  type="button"
                  onClick={() => setTopicFilter('visual')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5 ${
                    topicFilter === 'visual'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Camera size={13} />
                  <span>Visuales con Imágenes</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics
                .filter(topic => {
                  if (topicFilter === 'visual') {
                    return topic.questions.some(q => q.signCode || q.situationType || q.imageUrl);
                  }
                  return true;
                })
                .map((topic) => {
                  const hasVisualQuestions = topic.questions.some(q => q.signCode || q.situationType || q.imageUrl);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => startTopic(topic)}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-500 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-lg relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
                            {hasVisualQuestions ? <Camera size={22} /> : <Target size={22} />}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {hasVisualQuestions && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1 border border-emerald-300/60 dark:border-emerald-800">
                                <span>📸 Con Imágenes</span>
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                              10 Preguntas
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-black text-base text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0052cc] dark:text-sky-400">
                        <span>Empezar Quiz</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          2. PANTALLA DE JUEGO: EMPAREJAR SEÑALES Y REGLAS (MATCHING)
         ===================================================================== */}
      {gameMode === 'matching' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header de la partida */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                ACTIVIDAD INTERACTIVA DIDÁCTICA
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Relacionar Señal con su Significado
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toca una señal en la columna izquierda y luego toca su regla correspondiente en la derecha.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Clock size={14} className="text-[#0052cc]" />
                <span className="font-mono">{matchTimerSeconds}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 border border-blue-200 dark:border-blue-900/40">
                <CheckCircle2 size={14} />
                <span>{matchedPairs.length} / {matchSigns.length} Parejas</span>
              </div>
            </div>
          </div>

          {matchGameFinished ? (
            /* Resultados del emparejamiento */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-400">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                ¡Excelente Trabajo! Parejas Completadas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Has emparejado todas las señales oficiales con sus normas de tránsito en <strong className="text-[#0052cc] dark:text-sky-400">{matchTimerSeconds} segundos</strong> con {matchAttempts} intentos.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={initMatchingGame}
                  className="px-5 py-2.5 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0043a8] transition-colors cursor-pointer shadow-sm"
                >
                  Jugar de Nuevo con Otras Señales
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Ir al Menú de Quizzes
                </button>
              </div>
            </div>
          ) : (
            /* Tablero de 2 columnas */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna Izquierda: Señales */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider text-center">
                  Columna A: Señal Oficial
                </h3>
                {matchSigns.map((sign) => {
                  const isMatched = matchedPairs.includes(sign.id);
                  const isSelected = selectedSignId === sign.id;
                  const isShaking = wrongShakeSignId === sign.id;

                  return (
                    <button
                      key={sign.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectMatchSign(sign.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-60 cursor-default'
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-2 border-[#0052cc] dark:border-sky-400 shadow-md scale-102 ring-2 ring-blue-400/20'
                          : isShaking
                          ? 'border-rose-500 bg-rose-50 animate-shake'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <TrafficSignGraphic signCode={sign.signCode} size="xs" showCodeBadge={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-black text-sm text-slate-900 dark:text-white block truncate">
                          {sign.signName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {sign.category}
                        </span>
                      </div>
                      {isMatched && (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Columna Derecha: Reglas y Significado */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider text-center">
                  Columna B: Significado y Norma
                </h3>
                {shuffledRules.map((item) => {
                  const isMatched = matchedPairs.includes(item.id);
                  const isSelected = selectedRuleId === item.id;
                  const isShaking = wrongShakeRuleId === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleSelectMatchRule(item.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer min-h-[76px] ${
                        isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-60 cursor-default'
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 border-2 border-[#0052cc] dark:border-sky-400 shadow-md scale-102 ring-2 ring-blue-400/20'
                          : isShaking
                          ? 'border-rose-500 bg-rose-50 animate-shake'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-0.5">
                        •
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed flex-1">
                        {item.rule}
                      </p>
                      {isMatched && (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          3. PANTALLA DE JUEGO: COMPLETAR LA FRASE (FILL IN THE BLANKS)
         ===================================================================== */}
      {gameMode === 'fill_blanks' && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                COMPLETAR HUECOS • RETO {fillChallengeIdx + 1} DE {FILL_BLANKS_CHALLENGES.length}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {currentFillChallenge.title}
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900">
              Aciertos: {fillScore}
            </div>
          </div>

          {fillFinished ? (
            /* Resultados de Frases */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                ¡Retos de Frases Completados!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Acertaste {fillScore} de {FILL_BLANKS_CHALLENGES.length} leyes y normas de tránsito colombianas.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={initFillBlanksGame}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm"
                >
                  Repetir Actividad
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Volver al Menú
                </button>
              </div>
            </div>
          ) : (
            /* Caja interactiva de frase */
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              {/* Frase interactiva con huecos */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-loose">
                {currentFillChallenge.sentenceParts.map((part, pIdx) => {
                  const isBlankSlot = pIdx < currentFillChallenge.correctWords.length;
                  const filledValue = userFilledWords[pIdx];

                  return (
                    <React.Fragment key={pIdx}>
                      <span>{part}</span>
                      {isBlankSlot && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWordFromBlank(pIdx)}
                          className={`inline-flex items-center justify-center mx-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer min-w-[90px] border ${
                            filledValue
                              ? fillSubmitted
                                ? filledValue.toLowerCase() === currentFillChallenge.correctWords[pIdx].toLowerCase()
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                                  : 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                : 'bg-[#0052cc] text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-dashed border-slate-400 text-slate-400 hover:border-blue-400'
                          }`}
                          title={filledValue ? 'Clic para quitar' : 'Espacio vacío'}
                        >
                          {filledValue || `[ Espacio ${pIdx + 1} ]`}
                        </button>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Feedback de respuesta */}
              {fillSubmitted && (
                <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  fillIsCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                }`}>
                  <p className="font-black text-sm flex items-center gap-1.5">
                    {fillIsCorrect ? '🎉 ¡Respuesta Correcta!' : '❌ Respuesta Incorrecta'}
                  </p>
                  <p className="font-medium">{currentFillChallenge.explanation}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Fundamento: {currentFillChallenge.legalReference}
                  </p>
                </div>
              )}

              {/* Banco de Palabras Interactivas */}
              {!fillSubmitted && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Banco de palabras (toca para rellenar los espacios):
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {currentFillChallenge.optionsPool.map((word, wIdx) => {
                      const isUsed = userFilledWords.includes(word);
                      return (
                        <button
                          key={wIdx}
                          type="button"
                          disabled={isUsed}
                          onClick={() => handlePlaceWordInBlank(word)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isUsed
                              ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#0052cc] hover:text-[#0052cc] shadow-xs active:scale-95'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUserFilledWords([])}
                  disabled={fillSubmitted || userFilledWords.length === 0}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition-colors cursor-pointer disabled:opacity-30"
                >
                  Limpiar espacios
                </button>

                {!fillSubmitted ? (
                  <button
                    type="button"
                    onClick={handleCheckFillAnswer}
                    disabled={userFilledWords.length < currentFillChallenge.correctWords.length}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-40"
                  >
                    Comprobar Frase
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextFillChallenge}
                    className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Siguiente Reto</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          4. PANTALLA DE JUEGO: RETO CONTRA RELOJ (RAPID FIRE 10s)
         ===================================================================== */}
      {gameMode === 'rapid_fire' && (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto relative">
          {rfFinished && <QuizConfetti />}
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                  PREGUNTA {rfIndex + 1} DE {RAPID_FIRE_QUESTIONS.length}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  ¿Verdadero o Falso?
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {rfStreak >= 2 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-300 animate-pulse">
                  <Flame size={14} />
                  <span>Racha x{rfStreak}</span>
                </div>
              )}
              <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                Puntos: {rfScore}
              </div>
            </div>
          </div>

          {rfFinished ? (
            /* Resultados de Velocidad */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto border-2 border-amber-400">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                ¡Reto Contrarreloj Finalizado!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Tu puntuación fue de <strong className="text-amber-500 font-black">{rfScore} / {RAPID_FIRE_QUESTIONS.length}</strong> con una racha máxima de {rfMaxStreak} respuestas seguidas.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={initRapidFireGame}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Jugar de Nuevo
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('hub')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Volver al Menú
                </button>
              </div>
            </div>
          ) : (
            /* Tarjeta de Pregunta con Temporizador */
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Barra de tiempo animada */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Tiempo restante:</span>
                  <span className={`font-mono text-sm font-black ${
                    rfTimeLeft <= 3 ? 'text-rose-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {rfTimeLeft}s
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full ${
                      rfTimeLeft > 5 ? 'bg-emerald-500' : rfTimeLeft > 2 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${(rfTimeLeft / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Enunciado */}
              <div className="text-center py-4 space-y-3">
                <span className="text-4xl block">{currentRfQuestion.icon}</span>
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                  «{currentRfQuestion.statement}»
                </p>
              </div>

              {/* Botones Grandes de Elección */}
              {!rfAnswered ? (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRapidFireAnswer(true)}
                    className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✅ VERDADERO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRapidFireAnswer(false)}
                    className="py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm sm:text-base shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>❌ FALSO</span>
                  </button>
                </div>
              ) : (
                /* Explicación tras responder */
                <div className="space-y-4 pt-2">
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    rfLastCorrect 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300'
                  }`}>
                    <p className="font-black text-sm">
                      {rfLastCorrect ? '🎉 ¡Correcto!' : '❌ ¡Incorrecto!'}
                    </p>
                    <p className="font-medium leading-relaxed">{currentRfQuestion.explanation}</p>
                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                      Fundamento: {currentRfQuestion.legalArticle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextRapidFireQuestion}
                    className="w-full py-3 rounded-2xl bg-[#0052cc] hover:bg-[#0043a8] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Siguiente Pregunta</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MUNDOS DIDÁCTICOS: CRUCIGRAMA, SOPA DE LETRAS Y ENCUESTAS / DILEMAS
         ===================================================================== */}
      {gameMode === 'crossword' && (
        <CrosswordGame 
          onBackToHub={() => setGameMode('hub')} 
          onRecordScore={handleRecordQuizScore}
        />
      )}

      {gameMode === 'word_search' && (
        <WordSearchGame 
          onBackToHub={() => setGameMode('hub')} 
          onRecordScore={handleRecordQuizScore}
        />
      )}

      {gameMode === 'polls' && (
        <CommunityPollsGame 
          onBackToHub={() => setGameMode('hub')} 
          onRecordScore={handleRecordQuizScore}
        />
      )}

      {/* =====================================================================
          5. PANTALLA DE JUEGO: QUIZ TRADICIONAL Y VISUAL POR PREGUNTAS
         ===================================================================== */}
      {gameMode === 'traditional' && activeTopic && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Header con Progreso y Marcadores en Vivo */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            {/* Barra superior de progreso continuo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#0052cc] dark:text-sky-400">
                  {activeTopic.title}
                </span>
                <span>
                  Pregunta <strong className="text-slate-900 dark:text-white font-black">{currentQuestionIdx + 1}</strong> de {activeTopic.questions.length}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0052cc] to-sky-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / activeTopic.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Marcadores de Aciertos, Errores y Racha */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                  <CheckCircle2 size={14} />
                  <span>Aciertos: {tradScore}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-black">
                  <XCircle size={14} />
                  <span>Errores: {tradWrongCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {tradStreak >= 2 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-600 dark:text-amber-400 text-xs font-black animate-pulse">
                    <Flame size={14} />
                    <span>Racha x{tradStreak}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {tradQuizFinished ? (
            /* Pantalla Completa de Resultados Finales */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 dark:bg-sky-500/20 text-[#0052cc] dark:text-sky-400 flex items-center justify-center mx-auto border-2 border-blue-400/40">
                <Trophy size={40} className="animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  ¡Quiz Visual Finalizado!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Completaste todas las preguntas de <strong className="text-[#0052cc] dark:text-sky-400">{activeTopic.title}</strong>.
                </p>
              </div>

              {/* Estadísticas de la Ronda */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {tradScore}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Aciertos
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                    {tradWrongCount}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Errores
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="text-2xl font-black text-[#0052cc] dark:text-sky-400 block">
                    {Math.round((tradScore / activeTopic.questions.length) * 100)}%
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    Efectividad
                  </span>
                </div>
              </div>

              {/* Mensaje Evaluativo Constructivo */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 max-w-md mx-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                {tradScore >= 8 ? (
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                    🎉 ¡Extraordinario desempeño! Tienes un excelente dominio de la señalización y normativa vial colombiana.
                  </p>
                ) : tradScore >= 5 ? (
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    👍 ¡Buen trabajo! Vas por excelente camino. Repasar las preguntas visuales consolidará aún más tu seguridad al conducir.
                  </p>
                ) : (
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    🌱 ¡Buen esfuerzo! Cada error es una valiosa oportunidad para aprender. Vuelve a intentarlo para reforzar estos conceptos.
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startTopic(activeTopic)}
                  className="px-6 py-3 rounded-2xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0043a8] transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <RotateCcw size={15} />
                  <span>Repetir este Quiz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGameMode('hub')}
                  className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Explorar Otros Quizzes
                </button>
              </div>
            </div>
          ) : (
            /* Tarjeta de Pregunta Actual con Imagen y Opciones */
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              
              {/* Categoría de la Pregunta */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-300 text-xs font-bold border border-blue-200 dark:border-blue-900">
                  {activeTopic.questions[currentQuestionIdx].category}
                </span>

                {activeTopic.questions[currentQuestionIdx].difficulty && (
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    activeTopic.questions[currentQuestionIdx].difficulty === 'facil'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300'
                      : activeTopic.questions[currentQuestionIdx].difficulty === 'medio'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300'
                  }`}>
                    Nivel {activeTopic.questions[currentQuestionIdx].difficulty === 'facil' ? 'Fácil' : activeTopic.questions[currentQuestionIdx].difficulty === 'medio' ? 'Medio' : 'Difícil'}
                  </span>
                )}
              </div>

              {/* Tarjeta Visual: Muestra Señal de Tránsito Oficial, Situación Vial o Imagen */}
              <QuizQuestionVisual question={activeTopic.questions[currentQuestionIdx]} />

              {/* Enunciado de la Pregunta */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                {activeTopic.questions[currentQuestionIdx].question}
              </h3>

              {/* Opciones de Respuesta Interactivas */}
              <div className="space-y-3">
                {activeTopic.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === activeTopic.questions[currentQuestionIdx].correctIndex;

                  let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#0052cc] dark:hover:border-sky-400 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      // Respuesta correcta (verde resaltado con icono)
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm';
                    } else if (isSelected && !isCorrect) {
                      // Selección incorrecta del usuario (rojo suave)
                      optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-950 dark:text-rose-100 font-bold shadow-sm';
                    } else {
                      // Resto de opciones atenuadas
                      optionStyle = 'opacity-40 border-slate-200 dark:border-slate-800 cursor-not-allowed bg-slate-50 dark:bg-slate-900';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectTradOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 cursor-pointer relative ${optionStyle} ${
                        !isAnswerSubmitted ? 'active:scale-[0.99]' : ''
                      }`}
                    >
                      {/* Letra A, B, C, D */}
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 transition-colors ${
                        isAnswerSubmitted && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswerSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>

                      <span className="flex-1 leading-relaxed pt-0.5">
                        {opt}
                      </span>

                      {/* Icono de Verificación Inmediata */}
                      {isAnswerSubmitted && isCorrect && (
                        <div className="shrink-0 text-emerald-600 dark:text-emerald-400 pt-0.5 animate-bounce">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <div className="shrink-0 text-rose-600 dark:text-rose-400 pt-0.5">
                          <XCircle size={20} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* PANEL DE RETROALIMENTACIÓN INMEDIATA MOTIVADORA */}
              <AnimatePresence>
                {isAnswerSubmitted && feedbackData && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={`p-5 rounded-2xl border text-xs sm:text-sm space-y-3.5 ${
                      feedbackData.isCorrect
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100 shadow-sm'
                        : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100 shadow-sm'
                    }`}
                  >
                    {/* Encabezado Motivador con Icono */}
                    <div className="flex items-center gap-3">
                      {feedbackData.isCorrect ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
                          <XCircle size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-black text-sm sm:text-base leading-tight">
                          {feedbackData.title}
                        </h4>
                        <p className="text-xs font-medium opacity-90 mt-0.5">
                          {feedbackData.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* En caso de error: Resaltar cuál era la opción correcta */}
                    {!feedbackData.isCorrect && (
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/60 text-xs leading-relaxed">
                        <span className="font-bold text-rose-700 dark:text-rose-300">
                          Respuesta correcta:{' '}
                        </span>
                        <strong className="text-emerald-700 dark:text-emerald-300 font-bold">
                          Opción {String.fromCharCode(65 + activeTopic.questions[currentQuestionIdx].correctIndex)}: {activeTopic.questions[currentQuestionIdx].options[activeTopic.questions[currentQuestionIdx].correctIndex]}
                        </strong>
                      </div>
                    )}

                    {/* Explicación Educativa y Fundamento Legal */}
                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                      <p className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100 text-xs">
                        <Lightbulb size={14} className="text-amber-500" />
                        <span>Fundamento Pedagógico y Vial:</span>
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {activeTopic.questions[currentQuestionIdx].explanation}
                      </p>
                      {activeTopic.questions[currentQuestionIdx].legalReference && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pt-1">
                          Norma: {activeTopic.questions[currentQuestionIdx].legalReference}
                        </p>
                      )}
                    </div>

                    {/* Botón para Continuar a la Siguiente Pregunta */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextTradQuestion}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>
                          {currentQuestionIdx + 1 < activeTopic.questions.length
                            ? 'Continuar a la Siguiente Pregunta'
                            : 'Finalizar Quiz y Ver Resultados'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
