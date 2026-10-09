import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  RotateCcw, 
  Sparkles, 
  HelpCircle,
  MessageSquare,
  Compass
} from 'lucide-react';
import { OwlAvatar3D, OwlAnimationState } from './OwlAvatar3D';
import { ScreenId } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { soundEngine } from '../utils/soundEffects';

interface Message {
  id: string;
  sender: 'owl' | 'user';
  text: string;
  timestamp: string;
}

interface OwlAssistantWidgetProps {
  onNavigate?: (screen: ScreenId) => void;
  currentScreen?: ScreenId;
}

export const OwlAssistantWidget: React.FC<OwlAssistantWidgetProps> = ({ 
  onNavigate: _onNavigate,
  currentScreen: _currentScreen
}) => {
  const { language, t } = useThemeLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [owlAnimation, setOwlAnimation] = useState<OwlAnimationState>('idle');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message in active language
  const getInitialMessage = (lang: 'es' | 'en'): string => {
    return lang === 'en'
      ? "Hello! I'm your ViaNova road mobility & safety assistant. My only role is to answer any questions you have about Colombian traffic rules (Law 769, Julian Esteban Law 2251, Law 1696), speed limits, road signs, fines, license categories, and safe driving. What would you like to know?"
      : "¡Hola! Soy tu asistente de movilidad y seguridad vial de ViaNova. Mi función es resolver cualquier duda que tengas sobre normas de tránsito en Colombia (Ley 769, Ley 2251 Julián Esteban, Ley 1696), límites de velocidad, señales viales, comparendos, categorías de licencia y conducción segura. ¿Qué te gustaría consultar hoy?";
  };

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome-1',
      sender: 'owl',
      text: getInitialMessage(language === 'en' ? 'en' : 'es'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update initial message when language changes if only welcome is present
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome-1') {
        return [{
          ...prev[0],
          text: getInitialMessage(language === 'en' ? 'en' : 'es')
        }];
      }
      return prev;
    });
  }, [language]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isAnswering]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'en' ? 'en-US' : 'es-CO';
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  };

  // Comprehensive Q&A Knowledge base answering engine
  const generateOwlAnswer = (query: string, lang: 'es' | 'en'): string => {
    const q = query.toLowerCase().trim();

    if (lang === 'en') {
      if (q.includes('speed') || q.includes('limit') || q.includes('2251') || q.includes('julian') || q.includes('esteban')) {
        return "According to Law 2251 of 2022 (Julian Esteban Law): in school and residential zones, the strict speed limit is 30 km/h. On general urban streets and avenues, it is 50 km/h. On rural highways, the limit is 90 km/h for private vehicles and 80 km/h for public service/cargo. Local authorities cannot exceed these maximum statutory caps.";
      }
      if (q.includes('cyclist') || q.includes('bike') || q.includes('bicycle') || q.includes('distance')) {
        return "Under Law 2251 of 2022 and Article 60 of the National Traffic Code, all motor vehicle drivers must maintain a minimum lateral safety distance of 1.5 meters when overtaking a cyclist. This protects vulnerable riders from fatal turbulence or unexpected maneuvers.";
      }
      if (q.includes('roundabout') || q.includes('circle') || q.includes('priority') || q.includes('glorieta')) {
        return "Pursuant to Article 70 of Law 769 of 2002, vehicles already circulating inside a roundabout have absolute right-of-way over vehicles wishing to enter. Entering drivers must stop and yield.";
      }
      if (q.includes('alcohol') || q.includes('drunk') || q.includes('1696') || q.includes('beer') || q.includes('liquor')) {
        return "Colombia enforces strict Zero Tolerance for driving under the influence (Law 1696 of 2013). Starting at Grade Zero (20–39 mg of ethanol/100 ml of blood), sanctions include heavy financial fines, vehicle impoundment, and license suspension for at least 1 year. Refusing a breathalyzer test results in automatic license cancellation and 20 days of vehicle immobilization.";
      }
      if (q.includes('yellow') || q.includes('traffic light') || q.includes('signal') || q.includes('amber')) {
        return "A solid yellow traffic signal warns that the green phase has ended and red is imminent. It is not an invitation to speed up. If you can stop safely without causing a rear-end collision, you are legally required to stop before the pedestrian crossing line.";
      }
      if (q.includes('license') || q.includes('valid') || q.includes('category') || q.includes('categories')) {
        return "In Colombia, license categories include: A1/A2 for motorcycles; B1/B2/B3 for private vehicles; C1/C2/C3 for commercial/public service. For private drivers under age 60, licenses are valid for 10 years; between 60 and 80 years old, 5 years; and over 80, 1 year. For public service drivers, renewal is every 3 years (1 year after age 60).";
      }
      if (q.includes('sign') || q.includes('red') || q.includes('regulatory') || q.includes('warning') || q.includes('inform')) {
        return "The Road Signage Manual classifies signs into 4 official groups: 1) Regulatory (Red circle): Mandatory orders and prohibitions — disobeying generates fines and impoundment; 2) Warning (Yellow diamond): Warns of potential hazards ahead; 3) Informative (Blue/Green rectangle): Guides travelers and indicates public services; 4) Temporary (Orange): Road work and temporary diversions.";
      }
      if (q.includes('helmet') || q.includes('moto') || q.includes('motorcycle') || q.includes('23385')) {
        return "Under Resolution 23385, motorcycle operators and passengers must wear certified helmets (DOT, ECE, or NTC 4533). The head must be fully inserted, retention strap firmly buckled under the chin, and mobile devices cannot be placed inside the helmet while operating.";
      }
      if (q.includes('soat') || q.includes('insurance') || q.includes('inspection') || q.includes('tecnomecanica')) {
        return "SOAT (Compulsory Traffic Accident Insurance) is mandatory for all vehicles and guarantees bodily injury and medical coverage for crash victims. The Technical-Mechanical Inspection is mandatory annually for private vehicles after year 5 or 6, and for motorcycles after year 2.";
      }
      if (q.includes('fine') || q.includes('ticket') || q.includes('comparendo') || q.includes('camera')) {
        return "A traffic ticket (comparendo) is a summons. You have 5 business days (in-person notification) or 11 business days (automated camera) to contest the ticket in a hearing. Completing the mandatory pedagogical course on road safety within these windows grants a 50% discount on the fine.";
      }
      return `Regarding "${query}": According to the Colombian National Traffic Code (Law 769 of 2002) and Julian Esteban Law (Law 2251 of 2022), all drivers must practice defensive driving, protect pedestrians and cyclists, respect posted regulatory signs, and never operate vehicles under the influence of substances or fatigue. Let me know if you would like more specific details!`;
    }

    // SPANISH ANSWERS
    if (q.includes('velocidad') || q.includes('limite') || q.includes('límite') || q.includes('2251') || q.includes('julian') || q.includes('esteban')) {
      return "De acuerdo con la Ley 2251 de 2022 (Ley Julián Esteban), los límites de velocidad vigentes en Colombia son: en zonas escolares, residenciales y con alta presencia de peatones, máximo 30 km/h. En vías urbanas generales, máximo 50 km/h. En carreteras rurales, 90 km/h para particulares y 80 km/h para servicio público o de carga. Ninguna autoridad local puede autorizar velocidades superiores.";
    }
    if (q.includes('ciclista') || q.includes('bicicleta') || q.includes('distancia') || q.includes('adelantar')) {
      return "La Ley 2251 de 2022 y el Código Nacional de Tránsito establecen que todo conductor de vehículo automotor debe mantener una distancia lateral mínima de 1.5 metros al adelantar a un ciclista. Esta distancia evita que la succión aerodinámica o cualquier maniobra imprevista termine en un siniestro vial fatal.";
    }
    if (q.includes('glorieta') || q.includes('rotonda') || q.includes('prioridad') || q.includes('prelacion') || q.includes('prelación')) {
      return "Según el Artículo 70 de la Ley 769 de 2002, el vehículo que ya se encuentra circulando dentro de la glorieta tiene prelación absoluta sobre los vehículos que van a ingresar a ella. Si vas a entrar, debes detenerte y ceder el paso.";
    }
    if (q.includes('alcohol') || q.includes('embriaguez') || q.includes('1696') || q.includes('cerveza') || q.includes('licor') || q.includes('trago')) {
      return "En Colombia rige la Cero Tolerancia al Alcohol (Ley 1696 de 2013). Desde Grado Cero (20 a 39 mg de etanol/100 ml de sangre) se imponen multas millonarias, inmovilización del vehículo y suspensión de la licencia por mínimo 1 año. Negarse a la prueba de alcoholemia acarrea la sanción más drástica: cancelación definitiva de la licencia e inmovilización por 20 días hábiles.";
    }
    if (q.includes('amarilla') || q.includes('semáforo') || q.includes('semaforo') || q.includes('ambar') || q.includes('ámbar')) {
      return "La luz amarilla en el semáforo es una advertencia de que la fase verde terminó y el rojo es inminente. No significa 'acelerar'. Si puedes detener tu vehículo de forma segura sin provocar un choque por alcance, debes frenar antes de la línea de pare peatonal.";
    }
    if (q.includes('licencia') || q.includes('vigencia') || q.includes('categoria') || q.includes('categoría') || q.includes('vence')) {
      return "Las categorías en Colombia son: A1 y A2 para motocicletas; B1, B2 y B3 para vehículos particulares; C1, C2 y C3 para servicio público. Para conductores particulares menores de 60 años, la vigencia es de 10 años; entre 60 y 80 años, 5 años; mayores de 80 años, 1 año. En servicio público se renueva cada 3 años (o anual para mayores de 60 años).";
    }
    if (q.includes('señal') || q.includes('señales') || q.includes('roja') || q.includes('amarilla') || q.includes('reglamentaria') || q.includes('preventiva')) {
      return "El Manual de Señalización Vial clasifica las señales en 4 grupos: 1) Reglamentarias (Rojas con blanco): Órdenes obligatorias y prohibiciones (su omisión genera comparendo); 2) Preventivas (Amarillas con negro): Advierten riesgos próximos en la vía; 3) Informativas (Azules o verdes): Guían destinos y servicios; 4) Transitorias (Naranjas): Obras o desvíos temporales.";
    }
    if (q.includes('casco') || q.includes('moto') || q.includes('motocicleta') || q.includes('23385')) {
      return "Según la Resolución 23385 de 2020, conductores y acompañantes de motocicleta deben usar cascos certificados (DOT, ECE o NTC 4533). La cabeza debe estar completamente cubierta, la correa abrochada bajo la barbilla, y está prohibido llevar teléfonos celulares interpuestos dentro del casco al rodar.";
    }
    if (q.includes('soat') || q.includes('seguro') || q.includes('tecnomecanica') || q.includes('tecnomecánica') || q.includes('revisión')) {
      return "El SOAT es el Seguro Obligatorio de Accidentes de Tránsito que cubre la atención médica integral a víctimas de siniestros. La Revisión Técnico-Mecánica es obligatoria anualmente para carros particulares a partir del 5to año de matrícula y para motos a partir del 2do año. Circular sin ellos genera inmovilización inmediata y comparendo.";
    }
    if (q.includes('comparendo') || q.includes('multa') || q.includes('fotodetección') || q.includes('fotocomparendo') || q.includes('descuento')) {
      return "El comparendo es una citación formal. Tienes 5 días hábiles (notificación presencial) u 11 días hábiles (fotodetección) para solicitar audiencia de impugnación. Si realizas el curso pedagógico de normas de tránsito dentro de ese plazo, obtienes un 50% de descuento sobre el valor total de la multa.";
    }
    return `Sobre "${query}": De acuerdo con el Código Nacional de Tránsito (Ley 769 de 2002) y la Ley Julián Esteban (Ley 2251 de 2022), la prioridad en la movilidad la tiene el peatón y los usuarios vulnerables. Recuerda conducir de forma defensiva, acatar siempre la señalización vial y verificar tus documentos vigentes (SOAT y licencia). ¿Deseas profundizar en algún punto específico?`;
  };

  // Handle Question Submission
  const handleSendQuestion = (questionText?: string) => {
    const textToSend = (questionText || inputValue).trim();
    if (!textToSend || isAnswering) return;

    soundEngine.playClick();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAnswering(true);
    setOwlAnimation('think');

    // Simulate natural thinking delay
    setTimeout(() => {
      const activeLang = language === 'en' ? 'en' : 'es';
      const owlResponse = generateOwlAnswer(textToSend, activeLang);
      const owlMsg: Message = {
        id: `owl-${Date.now()}`,
        sender: 'owl',
        text: owlResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, owlMsg]);
      setIsAnswering(false);
      setOwlAnimation('celebrate');
      speakText(owlResponse);

      setTimeout(() => {
        setOwlAnimation('idle');
      }, 3000);
    }, 600);
  };

  const handleOpenMascot = () => {
    soundEngine.playClick();
    setIsOpen(true);
    setIsBubbleVisible(false);
    setOwlAnimation('wave');
    setTimeout(() => setOwlAnimation('idle'), 2000);
  };

  const handleCloseMascot = () => {
    soundEngine.playClick();
    setIsOpen(false);
    setOwlAnimation('idle');
  };

  const handleClearChat = () => {
    soundEngine.playClick();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'owl',
        text: getInitialMessage(language === 'en' ? 'en' : 'es'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Quick suggestion questions
  const suggestions = language === 'en' 
    ? [
        { label: '🚦 Urban speed limits', query: 'What are the urban speed limits according to Julian Esteban Law?' },
        { label: '🚲 Distance with cyclists', query: 'What is the required safety distance when passing a cyclist?' },
        { label: '🔄 Roundabout priority', query: 'Who has the right-of-way inside a roundabout?' },
        { label: '🍷 Alcohol tolerance', query: 'What are the penalties for driving with alcohol in Colombia?' },
        { label: '🟡 Yellow light meaning', query: 'What should a driver do when facing a yellow light?' },
        { label: '🪪 License categories', query: 'What are driver license categories and their validity in Colombia?' }
      ]
    : [
        { label: '🚦 Límites de velocidad', query: '¿Cuáles son los límites de velocidad según la Ley Julián Esteban?' },
        { label: '🚲 Distancia con ciclistas', query: '¿Cuál es la distancia obligatoria al adelantar un ciclista?' },
        { label: '🔄 Prioridad en glorietas', query: '¿Quién tiene prioridad en una glorieta en Colombia?' },
        { label: '🍷 Alcoholemia y sanciones', query: '¿Cuáles son las sanciones por conducir con alcohol en Colombia?' },
        { label: '🟡 Luz amarilla en semáforo', query: '¿Qué se debe hacer ante una luz amarilla de semáforo?' },
        { label: '🪪 Categorías de licencias', query: '¿Cuáles son las categorías y vigencia de las licencias de conducción?' }
      ];

  return (
    <aside 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none font-sans"
      aria-label="Asistente Virtual Búho ViaNova"
    >
      {/* ================= 1. FLOATING COMPANION (MINIMIZED) ================= */}
      {!isOpen && (
        <div className="relative flex items-end flex-col">
          {/* Animated Friendly Speech Bubble */}
          {isBubbleVisible && (
            <div 
              onClick={handleOpenMascot}
              className="mb-2 mr-1 bg-white dark:bg-[#0a192f] text-slate-800 dark:text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-sky-300 dark:border-sky-500/40 text-xs font-bold flex items-center gap-2.5 cursor-pointer hover:scale-102 transition-all max-w-[280px]"
            >
              <span className="text-xl shrink-0">🦉</span>
              <div className="leading-tight">
                <p className="font-extrabold text-[#0052cc] dark:text-sky-400 text-xs flex items-center gap-1">
                  <span>{t('owl_bubble_title', 'Asistente ViaNova')}</span>
                  <span className="text-[10px] text-amber-500 font-bold">✨</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {t('owl_bubble_text', '¡Hola! Pregúntame cualquier duda sobre normas de tránsito o seguridad vial.')}
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBubbleVisible(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 text-sm font-bold cursor-pointer"
                title={t('owl_close', 'Cerrar globo')}
              >
                ×
              </button>
            </div>
          )}

          {/* 3D Owl Round Floating Button */}
          <button
            type="button"
            id="vianova-owl-mascot-btn"
            onClick={handleOpenMascot}
            onMouseEnter={() => setOwlAnimation('wave')}
            onMouseLeave={() => setOwlAnimation('idle')}
            className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#0052cc] via-[#00AFFF] to-[#facc15] shadow-[0_8px_25px_rgba(0,82,204,0.4)] hover:shadow-[0_10px_35px_rgba(0,175,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-visible"
            aria-label={t('owl_mascot_title', 'Búho Asistente ViaNova')}
            title={t('owl_mascot_title', 'Búho Asistente ViaNova')}
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
      )}

      {/* ================= 2. Q&A ASSISTANT PANEL (EXPANDED) ================= */}
      {isOpen && (
        <div 
          className="w-[94vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white dark:bg-[#0b1626] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in transition-all duration-300"
          role="complementary"
          aria-labelledby="mascot-title"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0052cc] via-[#0a2540] to-[#0f172a] text-white flex items-center justify-between border-b border-white/10 shadow-sm shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                <OwlAvatar3D animationState={owlAnimation} size="xs" interactive={true} />
              </div>
              <div className="leading-tight">
                <h3 id="mascot-title" className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>{t('owl_mascot_title', 'Búho Asistente ViaNova')}</span>
                  <span className="text-amber-300 text-xs">🦉✨</span>
                </h3>
                <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">
                  {t('owl_mascot_badge', 'Asistente de Preguntas y Seguridad Vial')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-200 hover:text-white transition-colors cursor-pointer"
                title={soundEnabled ? t('owl_voice_disable', 'Silenciar voz') : t('owl_voice_enable', 'Activar voz')}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-xl hover:bg-white/15 text-sky-200 hover:text-white transition-colors cursor-pointer"
                title={t('owl_clear_chat', 'Limpiar chat')}
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={handleCloseMascot}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title={t('owl_close', 'Minimizar asistente')}
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70 dark:bg-[#070e18]/80 text-xs">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'owl' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-700 flex items-center justify-center shrink-0 text-sm shadow-xs">
                    🦉
                  </div>
                )}
                <div 
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0052cc] text-white rounded-br-xs font-medium'
                      : 'bg-white dark:bg-[#0f1d32] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-[11.5px]">{msg.text}</p>
                  <span 
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isAnswering && (
              <div className="flex gap-2.5 items-center text-slate-500 dark:text-slate-400 text-xs animate-pulse">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-sm shrink-0">
                  🦉
                </div>
                <div className="bg-white dark:bg-[#0f1d32] border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500 animate-spin" />
                  <span className="text-[11px] font-semibold">
                    {t('owl_thinking', 'Consultando normativa vial...')}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions Chips */}
          <div className="p-2.5 bg-white dark:bg-[#0b1626] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1 mb-1.5">
              <HelpCircle size={11} className="text-[#0052cc] dark:text-sky-400" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t('owl_suggestions_title', 'Preguntas frecuentes:')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendQuestion(s.query)}
                  disabled={isAnswering}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0052cc] dark:hover:text-sky-300 text-[10.5px] font-semibold border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="p-3 bg-slate-50 dark:bg-[#070e18] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('owl_input_placeholder', 'Haz una pregunta sobre tránsito, normas, señales...')}
              disabled={isAnswering}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0052cc] dark:focus:ring-sky-500 transition-all"
            />
            <button
              type="submit"
              disabled={isAnswering || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0043a8] text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center shrink-0 active:scale-95"
              title={t('owl_send_btn', 'Preguntar')}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
