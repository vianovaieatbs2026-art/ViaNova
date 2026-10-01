import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MessageSquare, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  BookOpen, 
  AlertTriangle, 
  HelpCircle, 
  Car, 
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Minimize2,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { OwlAvatar3D, OwlAnimationState } from './OwlAvatar3D';
import { 
  OWL_QUIZ_QUESTIONS, 
  OWL_SIMULATION_SCENARIOS, 
  OWL_TRAFFIC_SIGNS, 
  OWL_ROAD_EDUCATION_TOPICS, 
  OWL_CAMPAIGNS,
  OwlQuizQuestion,
  OwlSimulationScenario
} from '../data/owlAssistantData';
import { ScreenId } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface OwlAssistantWidgetProps {
  onNavigate?: (screen: ScreenId) => void;
  currentScreen?: ScreenId;
}

type AssistantTab = 'menu' | 'senales' | 'educacion' | 'quiz' | 'simulador' | 'campanas' | 'custom_chat';

interface ChatMessage {
  id: string;
  sender: 'owl' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
  highlight?: boolean;
}

export const OwlAssistantWidget: React.FC<OwlAssistantWidgetProps> = ({ 
  onNavigate,
  currentScreen
}) => {
  const { t } = useThemeLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('menu');
  const [owlAnimation, setOwlAnimation] = useState<OwlAnimationState>('idle');
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Quiz interactive state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean | null>(null);

  // Simulator interactive state
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [simSelectedOption, setSimSelectedOption] = useState<number | null>(null);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  // Custom text conversation state
  const [customInput, setCustomInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss tooltip after 8 seconds or on click
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // When panel opens: trigger waving entrance
  const handleOpenWidget = () => {
    setIsOpen(true);
    setIsTooltipVisible(false);
    setOwlAnimation('wave');
    setTimeout(() => {
      setOwlAnimation('talk');
      setTimeout(() => setOwlAnimation('idle'), 2500);
    }, 1500);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    setOwlAnimation('idle');
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab, quizFeedback, simFeedback]);

  // Voice speech synthesis helper (polite friendly speech)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.pitch = 1.15; // slightly youthful pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  // Switch tabs & trigger animated gestures
  const handleSelectTopic = (tab: AssistantTab) => {
    setActiveTab(tab);
    setOwlAnimation('talk');
    setTimeout(() => setOwlAnimation('idle'), 2000);

    if (tab === 'quiz') {
      setCurrentQuizIndex(0);
      setQuizSelectedOption(null);
      setQuizFeedback(null);
      setQuizIsCorrect(null);
    } else if (tab === 'simulador') {
      setCurrentSimIndex(0);
      setSimSelectedOption(null);
      setSimFeedback(null);
    }
  };

  // Quiz evaluation handler
  const handleQuizAnswer = (optionIdx: number, question: OwlQuizQuestion) => {
    if (quizSelectedOption !== null) return; // already answered
    setQuizSelectedOption(optionIdx);

    const isCorrect = optionIdx === question.correctIndex;
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      setOwlAnimation('celebrate');
      const speech = '🦉🎉 ¡Muy bien! Esa respuesta es correcta.';
      setQuizFeedback(`${speech} ${question.explanation}`);
      speakText(`${speech} ${question.explanation}`);
      setTimeout(() => setOwlAnimation('idle'), 3500);
    } else {
      setOwlAnimation('concern');
      const speech = '🦉 No te preocupes, vamos a intentarlo de nuevo. Te explico la respuesta.';
      setQuizFeedback(`${speech} ${question.explanation}`);
      speakText(`${speech} ${question.explanation}`);
      setTimeout(() => setOwlAnimation('idle'), 3500);
    }
  };

  const handleNextQuiz = () => {
    setQuizSelectedOption(null);
    setQuizFeedback(null);
    setQuizIsCorrect(null);
    setCurrentQuizIndex((prev) => (prev + 1) % OWL_QUIZ_QUESTIONS.length);
    setOwlAnimation('think');
    setTimeout(() => setOwlAnimation('idle'), 1500);
  };

  // Simulator decision handler
  const handleSimChoice = (optionIdx: number, scenario: OwlSimulationScenario) => {
    if (simSelectedOption !== null) return;
    setSimSelectedOption(optionIdx);
    const choice = scenario.options[optionIdx];

    if (choice.correct) {
      setOwlAnimation('celebrate');
      setSimFeedback(choice.feedback);
      speakText(choice.feedback);
    } else {
      setOwlAnimation('concern');
      setSimFeedback(choice.feedback);
      speakText(choice.feedback);
    }
    setTimeout(() => setOwlAnimation('idle'), 3500);
  };

  const handleNextSim = () => {
    setSimSelectedOption(null);
    setSimFeedback(null);
    setCurrentSimIndex((prev) => (prev + 1) % OWL_SIMULATION_SCENARIOS.length);
    setOwlAnimation('talk');
    setTimeout(() => setOwlAnimation('idle'), 1500);
  };

  // Natural text question responding engine
  const handleSendCustomQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customInput.trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setCustomInput('');
    setOwlAnimation('think');

    // Process answer with intelligent road safety keywords
    setTimeout(() => {
      setOwlAnimation('talk');
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('señal') || lower.includes('pare') || lower.includes('rojo') || lower.includes('amarillo')) {
        responseText = '🚦 En Colombia las señales se dividen en 4 familias: Reglamentarias (borde rojo, acatamiento obligatorio), Preventivas (amarillas, advierten peligro), Informativas (azules) y Transitorias (naranjas de obra). Por ejemplo, la señal SR-01 (PARE) exige detenerte por completo a 0 km/h.';
      } else if (lower.includes('velocidad') || lower.includes('límite') || lower.includes('julian') || lower.includes('colegio')) {
        responseText = '⚡ Por la Ley 2251 de 2022 (Ley Julián Esteban), el límite urbano general es de 50 km/h, y se reduce estrictamente a 30 km/h en zonas escolares, residenciales y de alta concurrencia peatonal.';
      } else if (lower.includes('ciclista') || lower.includes('bicicleta') || lower.includes('metro')) {
        responseText = '🚲 Todo conductor debe conservar al menos 1.5 metros de distancia lateral al adelantar a un ciclista. El ciclista es un actor vulnerable y una ráfaga de viento o desbalance puede ser fatal.';
      } else if (lower.includes('alcohol') || lower.includes('cerveza') || lower.includes('tomar')) {
        responseText = '🚫 En Colombia rige la Cero Tolerancia al Alcohol (Ley 1696). Conducir bajo cualquier grado de alcoholemia acarrea inmovilización inmediata, multas millonarias y suspensión de la licencia.';
      } else if (lower.includes('cinturón') || lower.includes('casco') || lower.includes('seguridad')) {
        responseText = '🛡️ El cinturón de seguridad es obligatorio para todos los ocupantes, incluidos los asientos traseros. En motocicletas, el casco reglamentario debe estar certificado y abrochado correctamente.';
      } else {
        responseText = `🦉 ¡Excelente pregunta sobre seguridad vial! Como tu asistente oficial de ViaNova, te recomiendo explorar las secciones interactivas de Señales, Educación, Quiz o Simulador para reforzar tus conocimientos prácticos.`;
      }

      const owlMsg: ChatMessage = {
        id: `owl-${Date.now()}`,
        sender: 'owl',
        text: responseText
      };

      setChatMessages((prev) => [...prev, owlMsg]);
      speakText(responseText);

      setTimeout(() => setOwlAnimation('idle'), 3500);
    }, 900);
  };

  const currentQuiz = OWL_QUIZ_QUESTIONS[currentQuizIndex];
  const currentSim = OWL_SIMULATION_SCENARIOS[currentSimIndex];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none font-sans">
      
      {/* ================= 1. FLOATING OWL TRIGGER BUTTON (WHEN CLOSED) ================= */}
      {!isOpen && (
        <div className="relative flex items-end flex-col">
          
          {/* Animated Speech Bubble Tooltip */}
          {isTooltipVisible && (
            <div 
              onClick={handleOpenWidget}
              className="mb-2 mr-1 bg-white dark:bg-[#0a192f] text-slate-800 dark:text-white px-3.5 py-2 rounded-2xl shadow-xl border border-sky-300 dark:border-sky-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer animate-bounce hover:animate-none transition-all max-w-[240px]"
            >
              <span className="text-base">🦉</span>
              <div className="leading-tight">
                <p className="font-extrabold text-[#0052cc] dark:text-sky-400 text-[11px]">Asistente ViaNova</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300">¡Hola! Haz clic para aprender seguridad vial.</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTooltipVisible(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-xs"
                title="Cerrar aviso"
              >
                ×
              </button>
            </div>
          )}

          {/* 3D Owl Round Floating Button */}
          <button
            type="button"
            id="vianova-owl-assistant-btn"
            onClick={handleOpenWidget}
            onMouseEnter={() => setOwlAnimation('wave')}
            onMouseLeave={() => setOwlAnimation('idle')}
            className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#0052cc] via-[#00AFFF] to-[#facc15] shadow-[0_8px_25px_rgba(0,82,204,0.4)] hover:shadow-[0_10px_35px_rgba(0,175,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-visible"
            aria-label="Abrir Asistente Virtual Búho ViaNova"
            title="Búho Asistente Virtual de ViaNova"
          >
            {/* Pulsing Aura */}
            <span className="absolute inset-0 rounded-full bg-[#00AFFF]/30 animate-ping pointer-events-none" />

            {/* Inner background container */}
            <div className="w-full h-full rounded-full bg-[#0a192f] flex items-center justify-center relative overflow-hidden border-2 border-white/20">
              
              {/* Radial gradient backdrop */}
              <div className="absolute inset-0 bg-radial from-sky-500/20 via-transparent to-transparent pointer-events-none" />

              {/* 3D Owl Canvas (Real-time WebGL) */}
              <OwlAvatar3D 
                animationState={owlAnimation}
                size="sm"
                interactive={true}
                className="pointer-events-none"
              />

              {/* Green online badge */}
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a192f] shadow-xs animate-pulse" />
            </div>
          </button>
        </div>
      )}

      {/* ================= 2. INTERACTIVE CONVERSATION PANEL (WHEN OPEN) ================= */}
      {isOpen && (
        <div 
          className="w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white dark:bg-[#0b1626] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in transition-all duration-300"
          role="dialog"
          aria-labelledby="owl-assistant-title"
        >
          {/* Header with 3D Owl Viewport */}
          <div className="relative px-4 py-3 bg-gradient-to-r from-[#0052cc] via-[#0a2540] to-[#0f172a] text-white flex items-center justify-between shadow-md shrink-0 border-b border-white/10">
            
            {/* Left: 3D Owl Live Avatar + Status */}
            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => {
                  setOwlAnimation('celebrate');
                  setTimeout(() => setOwlAnimation('idle'), 2500);
                }}
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-inner group"
                title="Tócame para celebrar"
              >
                <OwlAvatar3D 
                  animationState={owlAnimation} 
                  size="xs" 
                  interactive={true}
                  className="pointer-events-none"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="owl-assistant-title" className="font-black text-sm text-white tracking-tight flex items-center gap-1">
                    <span>Búho ViaNova</span>
                    <span className="text-amber-300 text-xs">🦉🚦</span>
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-sky-200 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Asistente Oficial de Educación Vial</span>
                </div>
              </div>
            </div>

            {/* Right: Controls (Mute / Close) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-200 hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? 'Silenciar voz' : 'Activar voz'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              <button
                type="button"
                onClick={handleCloseWidget}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Minimizar asistente"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Subheader: Active Category Navigation Bar */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-[#070e18] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => handleSelectTopic('menu')}
                className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'menu' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                🏠 Inicio
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopic('senales')}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'senales' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                🚦 Señales
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopic('educacion')}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'educacion' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                📚 Educación
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopic('quiz')}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'quiz' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                🧠 Quiz
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopic('simulador')}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'simulador' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                🚗 Simulador
              </button>
              <button
                type="button"
                onClick={() => handleSelectTopic('campanas')}
                className={`px-2 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'campanas' 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                📢 Campañas
              </button>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* ================= VISTA 1: MENÚ PRINCIPAL OFICIAL ================= */}
            {activeTab === 'menu' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* 3D Showcase of the Owl in the Menu */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-amber-50/50 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-amber-950/10 border border-sky-100 dark:border-sky-900/40 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <OwlAvatar3D animationState={owlAnimation} size="sm" interactive={true} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                      👋 ¡Hola! Soy el búho de ViaNova. 🦉🚦
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Estoy aquí para ayudarte a aprender educación y seguridad vial.
                    </p>
                  </div>
                </div>

                <div className="text-center py-1">
                  <p className="font-black text-slate-800 dark:text-slate-100 text-xs">
                    ¿Qué quieres aprender hoy?
                  </p>
                </div>

                {/* 5 Requested Main Options */}
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTopic('senales')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🚦</span>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
                          Señales de tránsito
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Aprende su significado y cómo actuar en la vía
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-[#0052cc] dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTopic('educacion')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📚</span>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Educación vial
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Ley Julián Esteban, peatones y normas vitales
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTopic('quiz')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🧠</span>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          Quiz con el Búho
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Ponte a prueba con retroalimentación animada
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTopic('simulador')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🚗</span>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          Simulador de situaciones
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Toma decisiones reales de tráfico en Colombia
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTopic('campanas')}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📢</span>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          Campañas de sensibilización
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Mensajes educativos de impacto y prevención
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= VISTA 2: SEÑALES DE TRÁNSITO ================= */}
            {activeTab === 'senales' && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <span>🚦 Señales de Tránsito en Colombia</span>
                  </h4>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('senales');
                        handleCloseWidget();
                      }}
                      className="text-[10px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Abrir catálogo completo</span>
                      <ExternalLink size={11} />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Las señales de tránsito salvan vidas guiando a conductores y peatones. El búho te explica sus familias principales:
                </p>

                <div className="space-y-2.5">
                  {OWL_TRAFFIC_SIGNS.map((sign) => (
                    <div 
                      key={sign.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{sign.icon}</span>
                          <span>{sign.code}</span>
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300">
                          {sign.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Significado:</strong> {sign.meaning}
                      </p>
                      <div className="p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200 font-semibold">
                        👉 <strong>Qué debes hacer:</strong> {sign.driverAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VISTA 3: EDUCACIÓN VIAL ================= */}
            {activeTab === 'educacion' && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <span>📚 Conceptos Clave de Seguridad Vial</span>
                  </h4>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('educacion_vial');
                        handleCloseWidget();
                      }}
                      className="text-[10px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Ir a módulos</span>
                      <ExternalLink size={11} />
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {OWL_ROAD_EDUCATION_TOPICS.map((topic) => (
                    <div 
                      key={topic.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs"
                    >
                      <h5 className="font-black text-xs text-[#0052cc] dark:text-sky-400 flex items-center gap-1.5">
                        <Sparkles size={13} />
                        <span>{topic.title}</span>
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {topic.summary}
                      </p>
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                        💡 <strong>Regla de oro:</strong> {topic.keyRule}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VISTA 4: QUIZ INTERACTIVO ================= */}
            {activeTab === 'quiz' && currentQuiz && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                    Pregunta {currentQuizIndex + 1} de {OWL_QUIZ_QUESTIONS.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 font-bold text-xs text-slate-900 dark:text-white leading-relaxed">
                  {currentQuiz.question}
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isAnswerCorrect = idx === currentQuiz.correctIndex;
                    let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800';

                    if (quizSelectedOption !== null) {
                      if (isAnswerCorrect) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-black shadow-xs';
                      } else if (isSelected && !isAnswerCorrect) {
                        btnStyle = 'bg-rose-500 text-white border-rose-600 font-black shadow-xs';
                      } else {
                        btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={quizSelectedOption !== null}
                        onClick={() => handleQuizAnswer(idx, currentQuiz)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSelectedOption !== null && isAnswerCorrect && (
                          <CheckCircle2 size={15} className="shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box (Official Required Quotes) */}
                {quizFeedback && (
                  <div 
                    className={`p-3 rounded-2xl border text-xs leading-relaxed space-y-2 animate-fade-in ${
                      quizIsCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                    }`}
                  >
                    <p className="font-extrabold text-xs">
                      {quizFeedback}
                    </p>
                    
                    <button
                      type="button"
                      onClick={handleNextQuiz}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xs"
                    >
                      Continuar a la siguiente pregunta →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ================= VISTA 5: SIMULADOR DE SITUACIONES ================= */}
            {activeTab === 'simulador' && currentSim && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    {currentSim.title}
                  </h4>
                  <button
                    type="button"
                    onClick={handleNextSim}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Otro caso</span>
                    <RotateCcw size={12} />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  <strong>Situación:</strong> {currentSim.situation}
                </div>

                <div className="space-y-2">
                  <p className="font-black text-[11px] text-slate-700 dark:text-slate-300">
                    ¿Qué decisión tomas como conductor responsable?
                  </p>
                  {currentSim.options.map((opt, idx) => {
                    const isSelected = simSelectedOption === idx;
                    let optStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                    if (simSelectedOption !== null) {
                      if (opt.correct) {
                        optStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                      } else if (isSelected) {
                        optStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                      } else {
                        optStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={simSelectedOption !== null}
                        onClick={() => handleSimChoice(idx, currentSim)}
                        className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all flex items-start justify-between cursor-pointer disabled:cursor-default ${optStyle}`}
                      >
                        <span className="leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {simFeedback && (
                  <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-100 space-y-2 animate-fade-in">
                    <p className="font-bold leading-relaxed">
                      {simFeedback}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextSim}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#0052cc] text-white font-black text-xs cursor-pointer shadow-xs"
                    >
                      Evaluar siguiente situación vial →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ================= VISTA 6: CAMPAÑAS ================= */}
            {activeTab === 'campanas' && (
              <div className="space-y-3.5 animate-fade-in">
                <h4 className="font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <span>📢 Campañas Oficiales de Seguridad Vial</span>
                </h4>

                <div className="space-y-3">
                  {OWL_CAMPAIGNS.map((camp) => (
                    <div 
                      key={camp.id}
                      className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-900 dark:to-rose-950/20 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs"
                    >
                      <h5 className="font-black text-xs text-rose-600 dark:text-rose-400">
                        {camp.title}
                      </h5>
                      <p className="font-extrabold text-[11px] text-slate-900 dark:text-white">
                        "{camp.slogan}"
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {camp.content}
                      </p>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                        {camp.tip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat History Messages */}
            {chatMessages.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">
                  Conversación con el Búho
                </p>
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'owl' && (
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        🦉
                      </span>
                    )}
                    <div 
                      className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#0052cc] text-white rounded-tr-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <form 
            onSubmit={handleSendCustomQuery}
            className="p-2.5 bg-slate-50 dark:bg-[#070e18] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input 
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Hazle una pregunta al búho de ViaNova..."
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="p-2 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] disabled:opacity-40 text-white font-bold transition-all cursor-pointer shadow-xs shrink-0"
              title="Enviar consulta"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
