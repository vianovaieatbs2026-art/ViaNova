import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Car, 
  Sparkles, 
  Film, 
  Compass,
  ChevronDown
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';
import { MultimediaCanvas } from './MultimediaCanvas';
import { FloatingDecorations } from './FloatingDecorations';
import { CityRouteSimulator2D } from './CityRouteSimulator2D';
import { InteractiveStoryboard } from './InteractiveStoryboard';
import { AnimatedServicesGrid } from './AnimatedServicesGrid';
import { MultimediaVideoSection } from './MultimediaVideoSection';
import { InteractiveWireframeSection } from './InteractiveWireframeSection';
import { soundEngine } from '../utils/soundEffects';

interface LandingScreenProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGoToLogin,
  onGoToRegister,
}) => {
  const { t } = useThemeLanguage();

  // Typewriter effect state
  const typewriterPhrases = [
    t('gateway_typewriter_1', 'Inteligencia Vial para Colombia'),
    t('gateway_typewriter_2', 'Educación Interactiva y Certificada'),
    t('gateway_typewriter_3', 'Rutas Seguras, Vidas Salvadas'),
    t('gateway_typewriter_4', 'El Futuro de la Movilidad Urbana')
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = typewriterPhrases[currentPhraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, 65);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  const scrollToSection = (id: string) => {
    soundEngine.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative overflow-hidden bg-[#f8fafc] dark:bg-[#050B14] transition-colors duration-300">
      
      {/* ===================== 1. HERO MULTIMEDIA SECTION ===================== */}
      <section 
        id="hero"
        className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Animated Particles Canvas */}
        <MultimediaCanvas />

        {/* Floating Mobility Elements: Gears, Cars, Traffic Lights, GPS */}
        <FloatingDecorations />

        {/* Centered Hero Content */}
        <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
          
          {/* Logo with Glow Effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-4 relative group"
          >
            <div className="absolute inset-0 rounded-full bg-[#00AFFF]/25 blur-xl group-hover:bg-[#00AFFF]/40 transition-all" />
            <div className="relative">
              <ViaNovaLogo size="lg" />
            </div>
          </motion.div>

          {/* Badge: Movilidad y Educación Vial */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#0A1931]/90 backdrop-blur-md border border-[#00AFFF]/50 text-[#0052cc] dark:text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-5 shadow-[0_0_18px_rgba(0,175,255,0.25)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-ping" />
            <span>{t('gateway_badge', 'SEGURIDAD VIAL & MOVILIDAD INTELIGENTE COLOMBIA')}</span>
          </motion.div>

          {/* Main H1 Headline */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl"
          >
            {t('landing_hero_welcome', 'Bienvenido a')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] via-[#00AFFF] to-[#00FF88] dark:drop-shadow-[0_0_25px_rgba(0,175,255,0.4)]">
              ViaNova
            </span>
          </motion.h1>

          {/* Dynamic Typewriter Subheadline */}
          <div className="h-10 mt-3 flex items-center justify-center">
            <p className="text-base sm:text-2xl font-bold text-[#0052cc] dark:text-[#00AFFF] tracking-tight">
              <span>{currentText}</span>
              <span className="inline-block w-0.5 h-5 ml-1 bg-[#00FF88] animate-pulse align-middle" />
            </p>
          </div>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
            {t('landing_hero_desc', 'Plataforma multimedia de educación vial, simulación de normas de tránsito CEA/RUNT y reportes de movilidad colaborativa en Colombia.')}
          </p>

          {/* Sub-Navigation Quick Pill Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-2xl">
            <button
              type="button"
              onClick={() => scrollToSection('servicios')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#00AFFF] hover:text-[#00AFFF] transition-all cursor-pointer shadow-xs"
            >
              {t('landing_nav_services', 'Servicios Viales')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('simulacion-2d')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#00FF88] hover:text-[#00FF88] transition-all cursor-pointer shadow-xs"
            >
              {t('landing_nav_sim_2d', 'Ruta 2D Interactiva')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('storyboard')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all cursor-pointer shadow-xs"
            >
              {t('landing_nav_storyboard', 'Ruta de Aprendizaje')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('multimedia')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#00AFFF] hover:text-[#00AFFF] transition-all cursor-pointer shadow-xs"
            >
              {t('landing_nav_videos', 'Cápsulas de Video')}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contacto')}
              className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#00FF88] hover:text-[#00FF88] transition-all cursor-pointer shadow-xs"
            >
              {t('landing_nav_contact', 'Contacto')}
            </button>
          </div>

          {/* The Main Action Cards: Iniciar Sesión & Crear Cuenta Nueva */}
          <div className="mt-8 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Iniciar Sesión (With Pulse & Neon Border) */}
            <motion.button
              type="button"
              id="landing-hero-login-btn"
              onClick={() => {
                soundEngine.playClick();
                onGoToLogin();
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 bg-white/90 dark:bg-[#0A1931]/90 backdrop-blur-md border-2 border-[#0052cc] dark:border-[#00AFFF] rounded-3xl shadow-[0_0_25px_rgba(0,175,255,0.25)] hover:shadow-[0_0_35px_rgba(0,175,255,0.4)] transition-all flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
            >
              {/* Neon border glow accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0052cc] to-[#00AFFF]" />

              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0052cc] dark:text-[#00AFFF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <LogIn size={28} />
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-[#00AFFF] transition-colors">
                {t('landing_cta_access', 'Iniciar Sesión')}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                {t('landing_login_card_sub', 'Si ya tienes una cuenta registrada, ingresa aquí con tu correo y contraseña.')}
              </p>

              <div className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-[#0052cc] to-[#00AFFF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:brightness-110 transition-all shadow-xs">
                <span>{t('landing_cta_access', 'Iniciar Sesión')}</span>
                <ArrowRight size={14} />
              </div>
            </motion.button>

            {/* 2. Crear Cuenta Nueva (With Neon Accent) */}
            <motion.button
              type="button"
              id="landing-hero-register-btn"
              onClick={() => {
                soundEngine.playClick();
                onGoToRegister();
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-6 bg-white/90 dark:bg-[#0A1931]/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700 hover:border-[#00FF88] dark:hover:border-[#00FF88] rounded-3xl shadow-md hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
            >
              {/* Neon border glow accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00FF88] to-[#00AFFF]" />

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#00FF88] group-hover:text-[#00FF88] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <UserPlus size={28} />
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#00FF88] transition-colors">
                {t('landing_cta_register', 'Crear Cuenta Nueva')}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
                {t('landing_register_card_sub', '¿Eres nuevo en ViaNova? Regístrate gratis en menos de un minuto para comenzar.')}
              </p>

              <div className="mt-5 w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-[#00FF88] group-hover:text-slate-950 transition-colors shadow-xs">
                <span>{t('landing_cta_register', 'Crear Cuenta Nueva')}</span>
                <ArrowRight size={14} />
              </div>
            </motion.button>

          </div>

          {/* Scroll Down Indicator */}
          <button
            type="button"
            onClick={() => scrollToSection('servicios')}
            className="mt-12 flex flex-col items-center text-slate-400 dark:text-slate-500 hover:text-[#00AFFF] transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:tracking-wider transition-all">
              Explorar Contenido Multimedia
            </span>
            <ChevronDown size={18} className="animate-bounce text-[#00AFFF]" />
          </button>

        </div>
      </section>

      {/* ===================== 2. SERVICIOS VIALES (SQUASH & STRETCH ANIMATED CARDS) ===================== */}
      <section id="servicios" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedServicesGrid onActionClick={onGoToLogin} />
      </section>

      {/* ===================== 3. RUTA INTELIGENTE 2D (ANIMATED 2D SEQUENCE) ===================== */}
      <section id="simulacion-2d" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CityRouteSimulator2D />
      </section>

      {/* ===================== 4. STORYBOARD INTERACTIVO EN 4 ESCENAS ===================== */}
      <section id="storyboard" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <InteractiveStoryboard />
      </section>

      {/* ===================== 5. CÁPSULAS MULTIMEDIA DE VIDEO Y AUDIO ===================== */}
      <section id="multimedia" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MultimediaVideoSection />
      </section>

      {/* ===================== 6. GUÍA DE NAVEGACIÓN Y CONTACTO CIUDADANO ===================== */}
      <section id="contacto" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <InteractiveWireframeSection />
      </section>

    </div>
  );
};
