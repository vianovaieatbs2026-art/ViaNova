import React from 'react';
import { 
  LogIn, 
  UserPlus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';

interface LandingScreenProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGoToLogin,
  onGoToRegister,
}) => {
  const { t } = useThemeLanguage();

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Centered Welcome Container */}
      <div className="w-full max-w-xl mx-auto text-center flex flex-col items-center animate-fade-in">
        
        {/* Brand Logo */}
        <div className="mb-4">
          <ViaNovaLogo size="lg" />
        </div>

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/60 text-[#0052cc] dark:text-sky-400 text-xs font-black uppercase tracking-wider mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#0052cc] dark:bg-sky-400 animate-ping"></span>
          <span>{t('landing_badge', 'MOVILIDAD INTELIGENTE PARA TU CIUDAD')}</span>
        </div>

        {/* H1 Main Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight leading-tight max-w-lg">
          {t('landing_welcome_title', 'Bienvenido a ViaNova')}
        </h1>

        {/* Subtitle description */}
        <p className="mt-3 text-sm sm:text-base text-[#475569] dark:text-slate-300 max-w-md font-medium leading-relaxed">
          {t('landing_welcome_sub', 'Selecciona una opción para acceder a la plataforma:')}
        </p>

        {/* The Two Main Action Cards: Iniciar Sesión & Crear Cuenta Nueva */}
        <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Iniciar Sesión */}
          <button
            type="button"
            id="landing-hero-login-btn"
            onClick={onGoToLogin}
            className="w-full p-6 bg-white dark:bg-[#0f172a] hover:bg-blue-50/50 dark:hover:bg-slate-800/80 border-2 border-[#0052cc] dark:border-sky-500 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] dark:bg-blue-950 text-[#0052cc] dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <LogIn size={28} />
            </div>

            <h2 className="text-lg font-black text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
              {t('landing_cta_access', 'Iniciar Sesión')}
            </h2>

            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-2 leading-relaxed">
              {t('landing_login_card_sub', 'Si ya tienes una cuenta registrada, ingresa aquí con tu correo y contraseña.')}
            </p>

            <div className="mt-5 w-full py-2.5 px-4 bg-[#0052cc] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-[#0043a8] transition-colors shadow-xs">
              <span>{t('landing_cta_access', 'Iniciar Sesión')}</span>
              <ArrowRight size={14} />
            </div>
          </button>

          {/* 2. Crear Cuenta Nueva */}
          <button
            type="button"
            id="landing-hero-register-btn"
            onClick={onGoToRegister}
            className="w-full p-6 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0052cc] dark:hover:border-sky-500 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#0f172a] dark:text-slate-200 group-hover:text-[#0052cc] dark:group-hover:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <UserPlus size={28} />
            </div>

            <h2 className="text-lg font-black text-[#0f172a] dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-sky-400 transition-colors">
              {t('landing_cta_register', 'Crear Cuenta Nueva')}
            </h2>

            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-2 leading-relaxed">
              {t('landing_register_card_sub', '¿Eres nuevo en ViaNova? Regístrate gratis en menos de un minuto para comenzar.')}
            </p>

            <div className="mt-5 w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-[#0f172a] dark:group-hover:bg-slate-700 transition-colors shadow-xs">
              <span>{t('landing_cta_register', 'Crear Cuenta Nueva')}</span>
              <ArrowRight size={14} />
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};
