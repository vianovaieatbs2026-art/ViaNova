import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  KeyRound,
  RotateCcw,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ViaNovaLogo } from './ViaNovaLogo';
import { MultimediaCanvas } from './MultimediaCanvas';
import { FloatingDecorations } from './FloatingDecorations';
import { UserProfile, UserType } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { firebaseLogin, firebaseRegister, sendPasswordReset } from '../lib/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { supabase } from '../lib/supabase';
import { 
  findRegisteredUserByEmail, 
  saveRegisteredUser, 
  formatNameFromEmail,
  verifyUserPassword,
  updateRegisteredUserPassword
} from '../utils/authStorage';
import { evaluatePasswordStrength, validateColombianPhone } from '../utils/security';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { TermsModal } from './TermsModal';

interface AuthGatewayScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
  initialTab?: 'login' | 'register';
  initialEmail?: string;
  initialMessage?: string;
  onOpenResetCodeModal?: (code?: string) => void;
}

export const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  onAuthSuccess,
  initialTab = 'login',
  initialEmail = '',
  initialMessage = '',
  onOpenResetCodeModal,
}) => {
  const { t } = useThemeLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [systemNotice, setSystemNotice] = useState<string>(initialMessage);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialMessage) {
      setSystemNotice(initialMessage);
      if (initialTab === 'register' && initialMessage.toLowerCase().includes('crear una cuenta')) {
        setRegError('Debes crear una cuenta primero');
      }
    }
  }, [initialMessage, initialTab]);

  // Typewriter effect state for Hero Headline
  const typewriterPhrases = [
    t('gateway_typewriter_1', 'Inteligencia Vial para Colombia'),
    t('gateway_typewriter_2', 'Educación Interactiva y Certificada'),
    t('gateway_typewriter_3', 'Rutas Seguras, Vidas Salvadas'),
    t('gateway_typewriter_4', 'El Futuro de la Movilidad Urbana')
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = typewriterPhrases[phraseIdx];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < targetPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2400);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIdx]);

  // ===================== LOGIN FORM STATE =====================
  const [loginEmail, setLoginEmail] = useState(initialEmail || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Guarantee credentials and password fields are strictly empty by default on load
  useEffect(() => {
    setLoginPassword('');
    if (!initialEmail) {
      setLoginEmail('');
    }
  }, [initialEmail]);

  // ===================== REGISTER FORM STATE =====================
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUserType, setRegUserType] = useState<UserType | ''>('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
  const [regAcceptedTerms, setRegAcceptedTerms] = useState(false);
  const [regError, setRegError] = useState('');
  const [regFieldErrors, setRegFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    userType?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  // Real-time password criteria evaluation
  const passRules = {
    minLength: regPassword.length >= 8,
    hasUpper: /[A-Z]/.test(regPassword),
    hasLower: /[a-z]/.test(regPassword),
    hasNumber: /[0-9]/.test(regPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-=+\[\]\\\/~`]/.test(regPassword),
  };
  const isPasswordSecure = Object.values(passRules).every(Boolean);

  // Switch tabs
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setLoginError('');
    setRegError('');
    setLoginPassword('');
    setLoginFieldErrors({});
    setRegFieldErrors({});
  };

  // ===================== HANDLE LOGIN SUBMIT =====================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const newErrors: { email?: string; password?: string } = {};

    const trimmedEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!cleanPassword) {
      newErrors.password = 'Este campo es obligatorio.';
    }

    if (Object.keys(newErrors).length > 0) {
      setLoginFieldErrors(newErrors);
      return;
    }
    setLoginFieldErrors({});

    setLoginSubmitting(true);

    try {
      // 1. REQUISITO CRÍTICO: Antes de dejar iniciar sesión, verifica supabase.auth.getUser()
      const { data: userCheck, error: userError } = await supabase.auth.getUser(trimmedEmail);

      // Si no existe usuario en la base de datos de Supabase Auth / Local / Servidor,
      // bloquea el acceso y redirige a /registro con el error "Debes crear una cuenta primero"
      if (userError || !userCheck?.user) {
        setLoginSubmitting(false);
        setActiveTab('register');
        setRegError('Debes crear una cuenta primero');
        return;
      }

      // 2. Usuario existe: Validar credenciales de forma robusta
      // A. Comprobar contra almacenamiento local seguro y cuentas de sistema (Isabella, Naz, etc.)
      const authCheck = verifyUserPassword(trimmedEmail, cleanPassword);
      if (authCheck.valid && authCheck.user) {
        updateRegisteredUserPassword(trimmedEmail, cleanPassword);
        onAuthSuccess(authCheck.user);
        setLoginSubmitting(false);
        return;
      }

      // B. Comprobar con backend server (/api/auth/login)
      try {
        const srvRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password: cleanPassword })
        });
        const srvData = await srvRes.json().catch(() => ({}));
        if (srvRes.ok && srvData.success && srvData.user) {
          updateRegisteredUserPassword(trimmedEmail, cleanPassword);
          onAuthSuccess(srvData.user);
          setLoginSubmitting(false);
          return;
        }
      } catch (_) {}

      // C. Comprobar con Firebase Auth
      try {
        const fbRes = await firebaseLogin(trimmedEmail, cleanPassword);
        if (fbRes.success) {
          updateRegisteredUserPassword(trimmedEmail, cleanPassword);
          const account = findRegisteredUserByEmail(trimmedEmail);
          if (account?.profile) {
            onAuthSuccess(account.profile);
            setLoginSubmitting(false);
            return;
          }
        }
      } catch (_) {}

      // Si las credenciales no son válidas
      setLoginSubmitting(false);
      setLoginError(t('login_err_wrong_pass', 'Contraseña incorrecta. Por favor verifica tus credenciales o solicita restablecer tu contraseña.'));
    } catch (err: any) {
      setLoginSubmitting(false);
      setLoginError(err?.message || 'Error de conexión con el servicio de autenticación.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // ===================== HANDLE REGISTER SUBMIT =====================
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      userType?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!regName.trim()) {
      newErrors.name = 'Este campo es obligatorio.';
    } else if (regName.trim().length < 3) {
      newErrors.name = 'Ingresa tu nombre y apellido completos.';
    }

    const trimmedEmail = regEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      newErrors.email = 'Este campo es obligatorio.';
    } else if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!regPhone.trim()) {
      newErrors.phone = 'Este campo es obligatorio.';
    } else if (!validateColombianPhone(regPhone)) {
      newErrors.phone = 'Ingresa un número celular colombiano válido (10 dígitos, ej. 3001234567).';
    }

    if (!regUserType) {
      newErrors.userType = 'Este campo es obligatorio. Selecciona un perfil vial.';
    }

    if (!regPassword) {
      newErrors.password = 'Este campo es obligatorio.';
    } else if (!isPasswordSecure) {
      newErrors.password = 'La contraseña no cumple todos los requisitos de seguridad.';
    }

    if (!regConfirmPassword) {
      newErrors.confirmPassword = 'Este campo es obligatorio.';
    } else if (regPassword !== regConfirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (!regAcceptedTerms) {
      newErrors.terms = 'Debes aceptar los Términos de Servicio y la Política de Privacidad.';
    }

    if (Object.keys(newErrors).length > 0) {
      setRegFieldErrors(newErrors);
      return;
    }
    setRegFieldErrors({});

    setRegSubmitting(true);

    try {
      // 1. Create account with Firebase Auth
      const firebaseRes = await firebaseRegister(trimmedEmail, regPassword);

      if (firebaseRes.success && firebaseRes.user) {
        const newUser: UserProfile = {
          id: firebaseRes.user.uid || `user-${Date.now()}`,
          name: regName.trim(),
          email: trimmedEmail,
          phone: regPhone.trim(),
          userType: regUserType || 'conductor',
          safetyScore: 80,
          completedHours: 0,
          passedExams: 0,
          activeReports: 0,
          primer_ingreso: true,
          termsAccepted: true,
          emailVerified: true
        };
        saveRegisteredUser(newUser, regPassword);
        try {
          await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: newUser, password: regPassword })
          });
        } catch (_) {}
        onAuthSuccess(newUser);
        return;
      }

      // Handle Firebase registration errors
      const errorMsg = firebaseRes.error || '';
      if (errorMsg.includes('auth/email-already-in-use')) {
        setRegError('Este correo electrónico ya se encuentra registrado. Cambia a la pestaña "Iniciar Sesión".');
      } else if (errorMsg.includes('auth/weak-password')) {
        setRegError('La contraseña es demasiado débil para Firebase Auth.');
      } else {
        // Fallback local registration if offline or Firebase email/pass disabled
        const isDeleted = typeof window !== 'undefined' && localStorage.getItem(`vianova_deleted_${trimmedEmail}`) === 'true';
        const existing = isDeleted ? null : findRegisteredUserByEmail(trimmedEmail);
        if (existing) {
          setRegError('Este correo ya está registrado localmente. Por favor inicia sesión.');
        } else {
          if (typeof window !== 'undefined') {
            try { localStorage.removeItem(`vianova_deleted_${trimmedEmail}`); } catch (_) {}
          }
          const newUser: UserProfile = {
            id: `user-${Date.now()}`,
            name: regName.trim(),
            email: trimmedEmail,
            phone: regPhone.trim(),
            userType: (regUserType || 'conductor') as UserType,
            safetyScore: 80,
            completedHours: 0,
            passedExams: 0,
            activeReports: 0,
            primer_ingreso: true,
            termsAccepted: true
          };
          saveRegisteredUser(newUser, regPassword);
          try {
            await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profile: newUser, password: regPassword })
            });
          } catch (_) {}
          onAuthSuccess(newUser);
        }
      }
    } catch (err: any) {
      setRegError(err?.message || 'Error durante el registro. Inténtalo de nuevo.');
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#f8fafc] dark:bg-[#0A1931] text-[#0f172a] dark:text-white py-10 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-300">
      
      {/* 1. Real-time Animated Particle Canvas */}
      <MultimediaCanvas />

      {/* 2. Floating Mobility Icons & Rotating Tech Gears (Arandelas) */}
      <FloatingDecorations />

      {/* 3. Deep Atmospheric Ambient Lighting (Adaptable a Claro y Oscuro) */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#00AFFF]/15 via-[#00FF88]/10 to-[#FF6B00]/10 dark:from-[#00AFFF]/20 dark:via-[#00FF88]/15 dark:to-[#FF6B00]/10 blur-[130px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* 4. Central Authenticator Container */}
      <div className="w-full max-w-xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Large ViaNova Logo with Glow and Entrance Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-3 relative group"
        >
          <div className="absolute inset-0 rounded-full bg-[#00AFFF]/35 blur-2xl group-hover:bg-[#00AFFF]/50 transition-all" />
          <div className="relative">
            <ViaNovaLogo size="lg" />
          </div>
        </motion.div>

        {/* Educational Road Safety Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-[#050B14]/80 backdrop-blur-md border border-sky-300 dark:border-[#00AFFF]/40 text-[#0052cc] dark:text-[#00AFFF] text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs dark:shadow-[0_0_15px_rgba(0,175,255,0.3)] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88] animate-ping" />
          <span data-i18n="gateway_badge">{t('gateway_badge', 'EDUCACIÓN Y SEGURIDAD VIAL • COLOMBIA')}</span>
        </motion.div>

        {/* Dynamic Typewriter Headline */}
        <div className="h-9 mb-6 flex items-center justify-center text-center">
          <p className="text-base sm:text-xl font-bold text-[#0052cc] dark:text-[#00AFFF] tracking-tight drop-shadow-xs dark:drop-shadow-[0_0_15px_rgba(0,175,255,0.4)]">
            <span>{currentText}</span>
            <span className="inline-block w-0.5 h-4 ml-1 bg-[#00FF88] animate-pulse align-middle" />
          </p>
        </div>

        {/* System Notice Banner (e.g. Cuenta eliminada permanentemente) */}
        {systemNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full mb-5 p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-3 shadow-md ${
              systemNotice.toLowerCase().includes('eliminada')
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <AlertCircle size={18} className="shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{systemNotice}</span>
          </motion.div>
        )}

        {/* ===================== THE 2 PROMINENT TABS ===================== */}
        <div className="w-full grid grid-cols-2 p-1.5 rounded-2xl bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700/80 mb-6 shadow-xl dark:shadow-2xl relative transition-colors">
          
          {/* Tab 1: Iniciar Sesión */}
          <button
            type="button"
            id="tab-login-btn"
            data-i18n="tab_login"
            onClick={() => handleTabChange('login')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-[#0052cc] to-[#00AFFF] text-white shadow-[0_0_25px_rgba(0,175,255,0.5)] scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
            }`}
          >
            <LogIn size={18} className={activeTab === 'login' ? 'animate-pulse text-white' : ''} />
            <span data-i18n-text>{t('tab_login', 'Iniciar Sesión')}</span>
            {activeTab === 'login' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-1" />
            )}
          </button>

          {/* Tab 2: Crear Cuenta */}
          <button
            type="button"
            id="tab-register-btn"
            data-i18n="tab_register"
            onClick={() => handleTabChange('register')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#00FF88] to-[#00AFFF] text-slate-950 shadow-[0_0_25px_rgba(0,255,136,0.5)] scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
            }`}
          >
            <UserPlus size={18} className={activeTab === 'register' ? 'animate-pulse text-slate-950' : ''} />
            <span data-i18n-text>{t('tab_register', 'Crear Cuenta')}</span>
            {activeTab === 'register' && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping ml-1" />
            )}
          </button>
        </div>

        {/* ===================== GLASSMORPHIC CARD WITH INPUT FOCUS GLOW ===================== */}
        <motion.div 
          layout
          className="w-full rounded-3xl bg-white/95 dark:bg-[#050B14]/85 backdrop-blur-2xl border-2 border-sky-300/60 dark:border-[#00AFFF]/40 p-6 sm:p-8 shadow-xl dark:shadow-[0_0_50px_rgba(0,175,255,0.25)] relative overflow-hidden transition-colors duration-300"
        >
          {/* Subtle top neon border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0052cc] via-[#00AFFF] to-[#00FF88]" />

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              /* ================= TAB 1: FORMULARIO INICIAR SESIÓN ================= */
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLoginSubmit}
                autoComplete="off"
                className="space-y-4"
              >
                <div className="text-center pb-2">
                  <h2 data-i18n="gateway_login_title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {t('gateway_login_title', 'Acceso Oficial a la Plataforma')}
                  </h2>
                  <p data-i18n="gateway_login_sub" className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {t('gateway_login_sub', 'Ingresa tus credenciales registradas en Firebase Auth')}
                  </p>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/15 border border-red-500/50 text-red-700 dark:text-red-200 text-xs flex items-start gap-2.5 shadow-sm"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{loginError}</span>
                  </motion.div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="login-email" data-i18n="login_email_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('login_email_label', 'Correo Electrónico')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Mail size={16} />
                    </div>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginFieldErrors.email) {
                          setLoginFieldErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder="Correo electrónico"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                        loginFieldErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#0052cc] dark:focus:border-[#00AFFF]'
                      } text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00AFFF]/40 transition-all`}
                    />
                  </div>
                  {loginFieldErrors.email && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{loginFieldErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" data-i18n="login_password_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('login_password_label', 'Contraseña')}
                    </label>
                    <button
                      type="button"
                      id="gateway-forgot-password-btn"
                      onClick={async () => {
                        const email = loginEmail.trim();
                        if (email && email.includes('@')) {
                          const auth = getAuth();
                          try {
                            await sendPasswordResetEmail(auth, email);
                            alert("Te enviamos el correo a " + email + ". Revisa bandeja de entrada y spam.");
                          } catch (error: any) {
                            console.log(error.code);
                            alert("Error: " + error.message);
                          }
                        }
                        setIsForgotPasswordOpen(true);
                      }}
                      data-i18n="login_forgot_password"
                      className="text-xs font-bold text-[#0052cc] dark:text-[#00AFFF] hover:text-[#0043a8] dark:hover:text-[#00FF88] hover:underline transition-colors cursor-pointer"
                    >
                      {t('login_forgot_password', '¿Olvidaste tu contraseña? Recuperar contraseña')}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      id="login-password"
                      name="password"
                      type={loginShowPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginFieldErrors.password) {
                          setLoginFieldErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                        loginFieldErrors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-[#0052cc] dark:focus:border-[#00AFFF]'
                      } text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00AFFF]/40 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                      aria-label="Ver contraseña"
                    >
                      {loginShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginFieldErrors.password && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{loginFieldErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Pulsing Login Button */}
                <button
                  type="submit"
                  disabled={loginSubmitting}
                  data-i18n="login_btn_submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0052cc] via-[#00AFFF] to-[#00FF88] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,175,255,0.4)] hover:shadow-[0_0_35px_rgba(0,175,255,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loginSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>{t('reg_btn_submitting_firebase', 'Verificando con Firebase...')}</span>
                    </div>
                  ) : (
                    <>
                      <span data-i18n-text>{t('login_btn_submit', 'Iniciar Sesión en ViaNova')}</span>
                      <ArrowRight size={17} className="animate-pulse" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* ================= TAB 2: FORMULARIO CREAR CUENTA ================= */
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-3.5 text-left"
              >
                <div className="text-center pb-1">
                  <h2 data-i18n="gateway_reg_title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {t('gateway_reg_title', 'Registro de Conductor en Colombia')}
                  </h2>
                  <p data-i18n="gateway_reg_sub" className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    {t('gateway_reg_sub', 'Crea tu perfil oficial para acceder a simuladores y certificaciones')}
                  </p>
                </div>

                {/* Error Banner */}
                {regError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/15 border border-red-500/50 text-red-700 dark:text-red-200 text-xs flex items-start gap-2.5 shadow-sm"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">{regError}</span>
                  </motion.div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="reg-name" data-i18n="reg_name_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('reg_name_label', 'Nombre y Apellidos')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <User size={15} />
                    </div>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        if (regFieldErrors.name) {
                          setRegFieldErrors(prev => ({ ...prev, name: undefined }));
                        }
                      }}
                      placeholder="Nombre y apellidos"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                        regFieldErrors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                      } text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition-all`}
                    />
                  </div>
                  {regFieldErrors.name && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{regFieldErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email & Phone in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="reg-email" data-i18n="reg_email_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('reg_email_label', 'Correo Electrónico')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Mail size={15} />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (regFieldErrors.email) {
                            setRegFieldErrors(prev => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="Correo electrónico"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                          regFieldErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                        } text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition-all`}
                      />
                    </div>
                    {regFieldErrors.email && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{regFieldErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="reg-phone" data-i18n="reg_phone_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('reg_phone_label', 'Celular (Colombia)')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Phone size={15} />
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          if (regFieldErrors.phone) {
                            setRegFieldErrors(prev => ({ ...prev, phone: undefined }));
                          }
                        }}
                        placeholder="Número de celular"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                          regFieldErrors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                        } text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition-all`}
                      />
                    </div>
                    {regFieldErrors.phone && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{regFieldErrors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Tipo de Perfil / Aspirante */}
                <div className="space-y-1">
                  <label htmlFor="reg-user-type" data-i18n="reg_profile_type_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('reg_profile_type_label', 'Tipo de Perfil / Aspirante')}
                  </label>
                  <select
                    id="reg-user-type"
                    value={regUserType}
                    onChange={(e) => {
                      setRegUserType(e.target.value as UserType);
                      if (regFieldErrors.userType) {
                        setRegFieldErrors(prev => ({ ...prev, userType: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${
                      regFieldErrors.userType ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                    } text-xs sm:text-sm text-slate-900 dark:text-white transition-all cursor-pointer`}
                  >
                    <option value="" disabled>{t('reg_user_type_placeholder', 'Selecciona tu tipo de perfil...')}</option>
                    <option value="aspirante">{t('reg_type_aspirante', '🚦 Aspirante a Licencia (Principiante)')}</option>
                    <option value="conductor">{t('reg_type_conductor', '🚗 Conductor')}</option>
                    <option value="estudiante">{t('reg_type_estudiante', '📚 Estudiante de Educación Vial')}</option>
                    <option value="ciudadano">{t('reg_type_ciudadano', '🚶 Peatón / Ciudadano')}</option>
                  </select>
                  {regFieldErrors.userType && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{regFieldErrors.userType}</span>
                    </p>
                  )}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="reg-password" data-i18n="reg_pass_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('reg_pass_label', 'Contraseña')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock size={15} />
                      </div>
                      <input
                        id="reg-password"
                        type={regShowPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regFieldErrors.password) {
                            setRegFieldErrors(prev => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="Contraseña"
                        className={`w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                          regFieldErrors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                        } text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword(!regShowPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {regShowPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="reg-confirm-password" data-i18n="reg_pass_confirm_label" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t('reg_pass_confirm_label', 'Confirmar Contraseña')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock size={15} />
                      </div>
                      <input
                        id="reg-confirm-password"
                        type={regShowConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (regFieldErrors.confirmPassword) {
                            setRegFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                          }
                        }}
                        placeholder="Confirmar contraseña"
                        className={`w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${
                          (regConfirmPassword.length > 0 && regConfirmPassword !== regPassword) || regFieldErrors.confirmPassword
                            ? 'border-rose-500 focus:border-rose-500'
                            : regConfirmPassword.length > 0 && regConfirmPassword === regPassword
                              ? 'border-emerald-500 focus:border-emerald-500'
                              : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-[#00FF88]'
                        } text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/30 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        {regShowConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {/* Inline check for Confirm Password */}
                    {regConfirmPassword.length > 0 ? (
                      regConfirmPassword !== regPassword ? (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>Las contraseñas no coinciden.</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>✓ Las contraseñas coinciden</span>
                        </p>
                      )
                    ) : regFieldErrors.confirmPassword ? (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{regFieldErrors.confirmPassword}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Real-time Password Security Requirements Guide */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    Tu contraseña debe contener:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-medium">
                    <div className={`flex items-center gap-1.5 ${passRules.minLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{passRules.minLength ? '✅' : '❌'}</span>
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passRules.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{passRules.hasUpper ? '✅' : '❌'}</span>
                      <span>Una letra mayúscula</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passRules.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{passRules.hasLower ? '✅' : '❌'}</span>
                      <span>Una letra minúscula</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passRules.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{passRules.hasNumber ? '✅' : '❌'}</span>
                      <span>Un número</span>
                    </div>
                    <div className={`flex items-center gap-1.5 sm:col-span-2 ${passRules.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span>{passRules.hasSpecial ? '✅' : '❌'}</span>
                      <span>Un carácter especial (ej. !, @, #, $, %)</span>
                    </div>
                  </div>
                </div>
                {regFieldErrors.password && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{regFieldErrors.password}</span>
                  </p>
                )}

                {/* Terms Acceptance */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regAcceptedTerms}
                      onChange={(e) => {
                        setRegAcceptedTerms(e.target.checked);
                        if (regFieldErrors.terms) {
                          setRegFieldErrors(prev => ({ ...prev, terms: undefined }));
                        }
                      }}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-[#0052cc] dark:text-[#00FF88] focus:ring-[#0052cc] dark:focus:ring-[#00FF88] bg-white dark:bg-slate-900"
                    />
                    <span className="leading-snug">
                      <span data-i18n="reg_terms_agree">{t('reg_terms_agree', 'Acepto los')}</span>{' '}
                      <button
                        type="button"
                        data-i18n="reg_terms_service"
                        onClick={() => setTermsModalType('terms')}
                        className="text-[#0052cc] dark:text-[#00AFFF] underline hover:text-[#0043a8] dark:hover:text-[#00FF88]"
                      >
                        {t('reg_terms_service', 'Términos de Servicio')}
                      </button>{' '}
                      <span data-i18n="reg_terms_and">{t('reg_terms_and', 'y la')}</span>{' '}
                      <button
                        type="button"
                        data-i18n="reg_terms_privacy"
                        onClick={() => setTermsModalType('privacy')}
                        className="text-[#0052cc] dark:text-[#00AFFF] underline hover:text-[#0043a8] dark:hover:text-[#00FF88]"
                      >
                        {t('reg_terms_privacy', 'Política de Privacidad')}
                      </button>
                      .
                    </span>
                  </label>
                  {regFieldErrors.terms && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{regFieldErrors.terms}</span>
                    </p>
                  )}
                </div>

                {/* Pulsing Register Button */}
                <button
                  type="submit"
                  disabled={regSubmitting}
                  data-i18n="reg_btn_submit_official"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00FF88] via-[#00AFFF] to-[#0052cc] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,136,0.4)] hover:shadow-[0_0_35px_rgba(0,255,136,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {regSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>{t('reg_btn_submitting_firebase', 'Creando cuenta en Firebase...')}</span>
                    </div>
                  ) : (
                    <>
                      <span data-i18n-text>{t('reg_btn_submit_official', 'Crear Mi Cuenta en ViaNova')}</span>
                      <UserPlus size={17} className="animate-pulse" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer info: Seguridad Vial Colombia */}
        <p data-i18n="gateway_footer_legal" className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
          {t('gateway_footer_legal', 'Sistema de Educación Vial y Movilidad Urbana • Ley 769 de 2002 & Ley 2251 de 2022')}
        </p>
      </div>

      {/* Forgot Password Modal (Real 6-digit code recovery flow) */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={loginEmail}
        onOpenResetCode={onOpenResetCodeModal ? () => onOpenResetCodeModal() : undefined}
        onSuccessLogin={(changedEmail) => {
          setLoginEmail(changedEmail);
          setIsForgotPasswordOpen(false);
          setActiveTab('login');
          setLoginPassword('');
        }}
      />

      {/* Terms & Privacy Modal */}
      <TermsModal
        isOpen={termsModalType !== null}
        onClose={() => setTermsModalType(null)}
        type={termsModalType === 'privacy' ? 'privacy' : 'terms'}
      />
    </div>
  );
};
