import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  FileCheck2,
  BookOpen,
  MapPin,
  UserCheck,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  Send,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
  Settings2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ViaNovaLogo } from './ViaNovaLogo';
import { UserProfile } from '../types';
import { 
  findRegisteredUserByEmail, 
  updateRegisteredUserPassword,
  formatNameFromEmail,
  saveRegisteredUser
} from '../utils/authStorage';
import { executeInvisibleRecaptcha, RecaptchaVerificationResult } from '../utils/security';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { sendPasswordReset, firebaseLogin } from '../lib/firebase';
import { 
  sendVerificationCodeEmail, 
  verifyLoginCode, 
  EmailDeliveryResult,
  getEmailConfigStatus,
  EmailConfigStatus
} from '../services/emailService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onFirstTimeRequired: (user: UserProfile) => void;
  onNavigateToRegister: () => void;
  onBackToLanding?: () => void;
  initialEmail?: string;
  onOpenResetCodeModal?: (code?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onFirstTimeRequired,
  onNavigateToRegister,
  onBackToLanding,
  initialEmail = '',
  onOpenResetCodeModal,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaState, setRecaptchaState] = useState<'idle' | 'checking' | 'verified'>('idle');
  const [recaptchaResult, setRecaptchaResult] = useState<RecaptchaVerificationResult | null>(null);

  // 2-Step Login with Email Verification Code (OTP)
  const [loginStep, setLoginStep] = useState<'credentials' | 'verification'>('credentials');
  const [activeLoginEmail, setActiveLoginEmail] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<EmailDeliveryResult | null>(null);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccessMsg, setVerificationSuccessMsg] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Timer countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);
  
  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetErrorMessage, setResetErrorMessage] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const { t } = useThemeLanguage();

  // Email Service Configuration Guide & Live Tester
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [emailConfigStatus, setEmailConfigStatus] = useState<EmailConfigStatus | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string; provider?: string } | null>(null);

  // Fetch email config status on mount
  useEffect(() => {
    getEmailConfigStatus().then(setEmailConfigStatus).catch(() => {});
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      setTestEmailResult({ success: false, message: 'Ingresa un correo electrónico válido para la prueba.' });
      return;
    }
    setIsSendingTestEmail(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmailAddress.trim() })
      });
      const data = await res.json();
      if (data.success && !data.notConfigured) {
        setTestEmailResult({
          success: true,
          provider: data.provider,
          message: '¡Correo de prueba enviado con éxito! Revisa tu bandeja de entrada y spam.'
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data.message || 'No hay un proveedor de correo (SMTP o Resend) configurado en .env todavía.'
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: 'Error al contactar el servidor: ' + (err?.message || '')
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    const inputEmail = email.trim();
    setResetErrorMessage('');

    // If user already entered an email in the input, take it and send immediately
    if (inputEmail && inputEmail.includes('@')) {
      setResetEmail(inputEmail);
      setResetSuccessMessage('');
      setResetSent(false);
      setIsSendingReset(true);
      setShowForgotModal(true);

      try {
        const res = await sendPasswordReset(inputEmail);
        setIsSendingReset(false);
        if (res.success) {
          setResetSuccessMessage('Se te envió un código de verificación al correo');
          setResetSent(true);
        } else {
          setResetErrorMessage(res.message);
        }
      } catch (err: any) {
        setIsSendingReset(false);
        setResetErrorMessage(err?.message || 'Error inesperado al conectar con el servicio de autenticación.');
      }
    } else {
      // If email input is empty or invalid, open modal so user can enter the email
      setResetEmail(inputEmail);
      setResetErrorMessage(inputEmail ? 'Por favor ingresa un correo electrónico válido.' : '');
      setResetSuccessMessage('');
      setResetSent(false);
      setIsSendingReset(false);
      setShowForgotModal(true);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = (resetEmail || email).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setResetErrorMessage(t('login_forgot_err_email', 'Por favor ingresa un correo electrónico válido.'));
      return;
    }
    
    setIsSendingReset(true);
    setResetErrorMessage('');

    try {
      const res = await sendPasswordReset(targetEmail);
      setIsSendingReset(false);
      if (res.success) {
        setResetSuccessMessage('Se te envió un código de verificación al correo');
        setResetSent(true);
      } else {
        setResetErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsSendingReset(false);
      setResetErrorMessage(err?.message || 'Error inesperado al conectar con el servicio de autenticación.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage(t('login_err_empty_email', 'Por favor ingresa tu correo electrónico.'));
      return;
    }
    if (!password) {
      setErrorMessage(t('login_err_empty_pass', 'Por favor ingresa tu contraseña.'));
      return;
    }

    setIsSubmitting(true);
    setRecaptchaState('checking');

    // 1. Execute Invisible reCAPTCHA v3
    try {
      const captchaRes = await executeInvisibleRecaptcha('login');
      setRecaptchaResult(captchaRes);
      setRecaptchaState('verified');
    } catch (err) {
      setRecaptchaState('idle');
      setIsSubmitting(false);
      setErrorMessage(t('login_err_recaptcha', 'Error al validar la protección antibot reCAPTCHA. Inténtalo de nuevo.'));
      return;
    }

    // 2. Validate user credentials (check Firebase Auth first for freshly reset passwords)
    const triggerVerificationStep = async (targetProf: UserProfile) => {
      setPendingUser(targetProf);
      setActiveLoginEmail(normalizedEmail);
      setIsSubmitting(true);
      setVerificationError('');
      setVerificationSuccessMsg('Código enviado, revisa tu correo incluyendo spam');
      setVerificationCodeInput('');

      try {
        const deliveryResult = await sendVerificationCodeEmail(normalizedEmail, targetProf.name);
        setVerificationResult(deliveryResult);
        setLoginStep('verification');
        setResendCooldown(60);
      } catch (err: any) {
        setErrorMessage('Error al despachar el código de verificación: ' + (err?.message || ''));
      } finally {
        setIsSubmitting(false);
        setRecaptchaState('idle');
      }
    };

    try {
      const fbRes = await firebaseLogin(normalizedEmail, password);
      if (fbRes.success) {
        // Firebase Auth login succeeded! Synchronize local password cache
        updateRegisteredUserPassword(normalizedEmail, password);
        const existingAccount = findRegisteredUserByEmail(normalizedEmail);
        if (existingAccount) {
          await triggerVerificationStep(existingAccount.profile);
        } else {
          const defaultProf: UserProfile = {
            id: `usr-${Date.now()}`,
            name: formatNameFromEmail(normalizedEmail),
            email: normalizedEmail,
            userType: 'conductor',
            primer_ingreso: false,
            emailVerified: true,
            termsAccepted: true,
            safetyScore: 88,
            completedHours: 0,
            passedExams: 0,
            activeReports: 0
          };
          saveRegisteredUser(defaultProf, password);
          await triggerVerificationStep(defaultProf);
        }
        return;
      }
    } catch (_) {}

    // Fallback: Check local stored account credentials
    setTimeout(async () => {
      const existingAccount = findRegisteredUserByEmail(normalizedEmail);

      if (!existingAccount) {
        setIsSubmitting(false);
        setRecaptchaState('idle');
        setErrorMessage(t('login_err_not_found', 'Esta cuenta no se encuentra registrada. Solo los usuarios registrados pueden iniciar sesión.'));
        return;
      }

      // Check password matching if stored
      if (existingAccount.password && existingAccount.password !== password) {
        setIsSubmitting(false);
        setRecaptchaState('idle');
        setErrorMessage(t('login_err_wrong_pass', 'Contraseña incorrecta. Por favor verifica tus credenciales o solicita restablecer tu contraseña.'));
        return;
      }

      // Pass credentials check: proceed to verification step
      await triggerVerificationStep(existingAccount.profile);
    }, 450);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    setVerificationSuccessMsg('');

    if (!activeLoginEmail || !pendingUser) {
      setVerificationError('No hay una sesión pendiente. Por favor ingresa tus datos nuevamente.');
      return;
    }

    const trimmed = verificationCodeInput.trim().replace(/\D/g, '');
    if (trimmed.length !== 6) {
      setVerificationError('Por favor ingresa los 6 dígitos numéricos del código recibido.');
      return;
    }

    setIsVerifyingCode(true);

    const check = verifyLoginCode(activeLoginEmail, trimmed);

    if (check.success) {
      setVerificationSuccessMsg('¡Código verificado con éxito! Ingresando a tu cuenta...');
      setTimeout(() => {
        setIsVerifyingCode(false);
        onLoginSuccess(pendingUser);
      }, 700);
    } else {
      setIsVerifyingCode(false);
      setVerificationError(check.message);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !activeLoginEmail || !pendingUser || isResendingCode) return;
    setIsResendingCode(true);
    setVerificationError('');
    setVerificationSuccessMsg('');

    try {
      const res = await sendVerificationCodeEmail(activeLoginEmail, pendingUser.name);
      setVerificationResult(res);
      setResendCooldown(60);
      setVerificationSuccessMsg('Código enviado, revisa tu correo incluyendo spam');
      setTimeout(() => setVerificationSuccessMsg(''), 7000);
    } catch (err: any) {
      setVerificationError('Error al reenviar el código. Inténtalo de nuevo.');
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleBackToCredentials = () => {
    setLoginStep('credentials');
    setVerificationCodeInput('');
    setVerificationError('');
    setVerificationSuccessMsg('');
    setVerificationResult(null);
    setErrorMessage('');
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f4f9] to-[#e4edf7] dark:from-[#0b1120] dark:to-[#020617] text-[#0f172a] dark:text-slate-100 transition-colors">
      
      {/* Return to Portada if callback provided */}
      {onBackToLanding && (
        <div className="w-full max-w-6xl mx-auto mb-6 flex justify-start">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0052cc] dark:text-sky-400 hover:underline cursor-pointer bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800"
          >
            <ArrowLeft size={16} />
            <span>{t('landing_back_to_hero', 'Volver a la portada')}</span>
          </button>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* ===================== LEFT COLUMN (Pitch & Official Trust Badges) ===================== */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex items-center gap-3">
            <ViaNovaLogo size="lg" />
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
                <span className="text-[#0072ff]">Via</span>Nova
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0052cc] dark:text-sky-400">
                {t('brand_tagline', 'MOVILIDAD INTELIGENTE PARA TU CIUDAD')}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] dark:text-white leading-tight max-w-lg">
            {t('landing_hero_h1', 'Aprende las normas viales, simula exámenes oficiales y viaja seguro por Colombia')}
          </h1>

          <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 max-w-lg leading-relaxed">
            {t('landing_hero_p', 'Plataforma oficial de educación vial, simulación de pruebas teóricas CEA/RUNT y consulta de señalización nacional bajo el Código Nacional de Tránsito (Ley 769) y la Ley Julián Esteban (Ley 2251).')}
          </p>

          {/* Official Trust & Privacy Guarantees */}
          <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">Privacidad Garantizada</h4>
                <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-snug mt-0.5">
                  Protección de datos personales conforme a la Ley 1581 de 2012 (Habeas Data).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="text-[#0052cc] dark:text-sky-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-[#0f172a] dark:text-white">Normativa Oficial</h4>
                <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-snug mt-0.5">
                  Alineado a lineamientos ANSV, RUNT y Ministerio de Transporte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT COLUMN (Login Card) ===================== */}
        <div className="w-full lg:w-[440px] shrink-0 flex flex-col items-center">
          <main 
            id="login-card" 
            className="w-full bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-[#e2e8f0] dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-[#0052cc] absolute top-0 left-0"></div>

            {loginStep === 'verification' ? (
              /* ================= 2-STEP VERIFICATION CODE UI ================= */
              <div className="w-full space-y-5 animate-fade-in">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-sky-950 text-[#0052cc] dark:text-sky-400 mx-auto flex items-center justify-center mb-2 shadow-xs">
                    <ShieldCheck size={26} />
                  </div>
                  <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">
                    Código de Verificación
                  </h2>
                  <p className="text-xs text-[#64748b] dark:text-slate-400">
                    Ingresa el código de 6 dígitos que enviamos a:
                  </p>
                  <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono font-bold text-[#0052cc] dark:text-sky-300 max-w-full truncate">
                    {activeLoginEmail}
                  </div>
                </div>

                {/* Prominent Spam Warning Notice as requested */}
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 shadow-xs">
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 leading-relaxed">
                    <p className="font-extrabold text-xs sm:text-[13px] text-emerald-950 dark:text-emerald-100">
                      Código enviado, revisa tu correo incluyendo spam
                    </p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      El código ya fue emitido al correo ingresado. Si no aparece en tu bandeja principal en unos instantes, revisa tu carpeta de <strong>correo no deseado (spam)</strong> o <strong>promociones</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#0052cc] dark:text-sky-400 hover:underline font-bold mt-1 cursor-pointer"
                    >
                      <Settings2 size={12} />
                      <span>¿Cómo configurar el envío de correos reales (SMTP / Firebase)?</span>
                    </button>
                  </div>
                </div>

                {/* Development Mode / API Key Guide Box */}
                {verificationResult?.provider === 'local_dev' && (
                  <div className="p-3.5 bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0052cc] dark:text-sky-300 flex items-center gap-1.5 text-[11px]">
                        <span>⚙️ Modo Preview / Asistente de Envío</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-200/70 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold">
                        OTP Generado
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Código actual:</span>
                        <span className="font-mono text-lg font-black tracking-widest text-[#0052cc] dark:text-sky-400">
                          {verificationResult.code}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationCodeInput(verificationResult.code);
                          setCopiedCode(true);
                          setTimeout(() => setCopiedCode(false), 2500);
                        }}
                        className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedCode ? '¡Rellenado!' : 'Autocompletar'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      Para recibirlo directamente en tu buzón real, agrega <code className="font-mono text-[#0052cc] dark:text-sky-400 font-bold">VITE_RESEND_API_KEY</code> o <code className="font-mono text-[#0052cc] dark:text-sky-400 font-bold">VITE_SENDGRID_API_KEY</code> a tu entorno.
                    </p>
                  </div>
                )}

                {/* Verification Form */}
                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wider block text-center">
                      Ingresa el código numérico de 6 dígitos
                    </label>
                    <input
                      id="login-otp-code-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      autoFocus
                      value={verificationCodeInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCodeInput(val);
                        if (verificationError) setVerificationError('');
                      }}
                      placeholder="000000"
                      className="w-full text-center py-3 px-4 border-2 border-slate-300 dark:border-slate-700 focus:border-[#0052cc] dark:focus:border-sky-500 rounded-2xl text-2xl font-mono font-black tracking-[10px] text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition-all focus:outline-none"
                    />
                  </div>

                  {verificationError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-start gap-2 animate-fade-in">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{verificationError}</span>
                    </div>
                  )}

                  {verificationSuccessMsg && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{verificationSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    id="submit-otp-verify-btn"
                    disabled={isVerifyingCode || verificationCodeInput.length !== 6}
                    className="w-full h-12 bg-[#0052cc] hover:bg-[#0043a8] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verificar e Ingresar a ViaNova</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex flex-col gap-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || isResendingCode}
                      className="text-[#0052cc] dark:text-sky-400 hover:underline font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={13} className={isResendingCode ? 'animate-spin' : ''} />
                      {resendCooldown > 0 
                        ? `Reenviar código en ${resendCooldown}s` 
                        : isResendingCode 
                        ? 'Enviando código...' 
                        : '¿No recibiste el código? Reenviar código'}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToCredentials}
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium cursor-pointer flex items-center justify-center gap-1 mt-1"
                    >
                      <ArrowLeft size={13} />
                      <span>Volver e ingresar con otra cuenta</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ================= STANDARD CREDENTIALS STEP ================= */
              <>
                <div className="mb-5 text-center">
                  <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">
                    {t('login_title', 'Ingresar a tu Cuenta')}
                  </h2>
                  <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1">
                    {t('login_subtitle', 'Ingresa con tu correo registrado y contraseña')}
                  </p>
                </div>

                {/* reCAPTCHA Status Indicator */}
                {recaptchaState === 'checking' && (
                  <div className="mb-4 p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl text-xs text-sky-800 dark:text-sky-300 flex items-center gap-2 animate-pulse">
                    <ShieldCheck size={16} className="text-[#0052cc] animate-spin" />
                    <span>{t('login_recaptcha_verifying', 'Verificando seguridad antibot reCAPTCHA v3...')}</span>
                  </div>
                )}

                {errorMessage && (
                  <div 
                    id="login-error-alert" 
                    className="w-full mb-4 p-3.5 bg-[#fee2e2] dark:bg-rose-950/50 border border-[#fecdd3] dark:border-rose-900 text-[#991b1b] dark:text-rose-200 rounded-xl text-xs flex flex-col gap-2 animate-fade-in"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600 dark:text-rose-400" />
                      <span className="font-medium">{errorMessage}</span>
                    </div>
                    {errorMessage.includes(t('login_err_not_found', 'Esta cuenta no se encuentra registrada')) && (
                      <button
                        type="button"
                        onClick={onNavigateToRegister}
                        className="self-start text-xs font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <UserPlus size={14} />
                        {t('login_click_here_register', 'Haz clic aquí para registrarte ahora')}
                      </button>
                    )}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wider block">
                      {t('login_email_label', 'Correo Electrónico Registrado')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                        <Mail size={16} />
                      </span>
                      <input 
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login_email_placeholder', 'ejemplo@correo.com')}
                        className="w-full pl-10 pr-3.5 py-3 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0052cc]/20 transition-all bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wider block">
                      {t('login_password_label', 'Contraseña')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
                        <Lock size={16} />
                      </span>
                      <input 
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-500 focus:ring-2 focus:ring-[#0052cc]/20 transition-all bg-white dark:bg-slate-900 font-mono"
                      />
                      <button 
                        type="button"
                        id="login-toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Invisible reCAPTCHA Badge Notice */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 text-[11px] text-[#64748b] dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
                      <span>{t('login_recaptcha_notice', 'Protegido por reCAPTCHA invisible v3')}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {t('login_recaptcha_active', 'Activo')}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    id="submit-login-btn"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#0052cc] text-white font-bold text-sm rounded-xl hover:bg-[#0043a8] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t('login_btn_submit', 'Iniciar Sesión')}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={handleForgotPasswordClick}
                      disabled={isSendingReset}
                      className="text-xs text-[#0052cc] dark:text-sky-400 hover:underline font-semibold cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
                    >
                      {isSendingReset ? (
                        <>
                          <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 dark:border-sky-400/30 dark:border-t-sky-400 rounded-full animate-spin" />
                          <span>Enviando correo de recuperación...</span>
                        </>
                      ) : (
                        <span>{t('login_forgot_password', '¿Olvidaste tu contraseña?')}</span>
                      )}
                    </button>

                    {resetSent && (
                      <div className="mt-2.5 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5 animate-fade-in">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold">Revisa tu correo, incluyendo spam</span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-[#e2e8f0] dark:border-slate-800"></div>
                  </div>

                  {/* Create New Account Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      id="facebook-style-create-account-btn"
                      onClick={onNavigateToRegister}
                      className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UserPlus size={16} />
                      <span>{t('login_create_new_account', 'Crear cuenta nueva')}</span>
                    </button>
                  </div>

                  {/* Email Service Configuration Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                    >
                      <Settings2 size={13} className="text-[#0052cc] dark:text-sky-400" />
                      <span>Guía de configuración de correos (SMTP / Firebase)</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Forgot Password Modal (Firebase Auth sendPasswordResetEmail) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#e2e8f0] dark:border-slate-800 text-[#0f172a] dark:text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#eff6ff] dark:bg-sky-950 flex items-center justify-center text-[#0052cc] dark:text-sky-400">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] dark:text-white text-base">
                  {t('login_forgot_title', 'Recuperar Contraseña')}
                </h3>
                <p className="text-xs text-[#64748b] dark:text-slate-400">
                  {t('login_forgot_desc', 'Te enviaremos un enlace de restablecimiento seguro a tu correo electrónico vía Firebase Auth.')}
                </p>
              </div>
            </div>

            {resetErrorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{resetErrorMessage}</span>
              </div>
            )}

            {resetSent ? (
              <div className="p-5 bg-[#f0fdf4] dark:bg-emerald-950/40 border border-[#bbf7d0] dark:border-emerald-900 rounded-2xl text-xs text-[#166534] dark:text-emerald-300 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-200">
                      {resetSuccessMessage || "Se te envió un código de verificación al correo"}
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Enviado a <span className="font-bold underline">{resetEmail || email}</span>
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed text-emerald-800 dark:text-emerald-300/90">
                  Hemos enviado un correo seguro mediante Firebase Auth con el enlace y código de verificación para restablecer tu contraseña.
                </p>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>⚠️ Importante:</span>
                  </p>
                  <p>
                    Revisa tu correo, incluyendo spam o correo no deseado. Si tu gestor filtra remitentes nuevos, el mensaje puede estar en la bandeja de spam.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      if (onOpenResetCodeModal) {
                        onOpenResetCodeModal();
                      }
                    }}
                    className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs text-xs flex items-center justify-center gap-1.5"
                  >
                    <KeyRound size={14} />
                    <span>¿Ya recibiste el enlace o código? Ingrésalo aquí</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer transition-colors shadow-xs text-xs"
                  >
                    {t('login_forgot_back', 'Entendido, volver')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-3">
                <div>
                  <label htmlFor="reset-email-input" className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-1.5">
                    {t('login_email_label', 'Correo Electrónico')}
                  </label>
                  <input
                    id="reset-email-input"
                    type="email"
                    required
                    value={resetEmail}
                    disabled={isSendingReset}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder={t('login_forgot_input_ph', 'Ingresa tu correo registrado...')}
                    className="w-full px-3.5 py-2.5 border border-[#cbd5e1] dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-[#0f172a] dark:text-white disabled:opacity-60"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSendingReset}
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-bold text-[#64748b] dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white cursor-pointer disabled:opacity-50"
                  >
                    {t('login_forgot_cancel', 'Cancelar')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSendingReset ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t('login_forgot_sending', 'Enviando...')}</span>
                      </>
                    ) : (
                      <span>{t('login_forgot_send', 'Enviar Enlace')}</span>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      if (onOpenResetCodeModal) {
                        onOpenResetCodeModal();
                      }
                    }}
                    className="text-[11px] text-[#0052cc] dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                  >
                    ¿Ya tienes el enlace o código de tu correo? Ingrésalo aquí
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Email Service Configuration Guide & Live Tester Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-[#e2e8f0] dark:border-slate-800 text-[#0f172a] dark:text-white max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-sky-950 flex items-center justify-center text-[#0052cc] dark:text-sky-400">
                  <Settings2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white">
                    Configuración de Envío de Correos
                  </h3>
                  <p className="text-xs text-[#64748b] dark:text-slate-400">
                    Guía para recibir códigos de verificación y restablecimiento en tu bandeja
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Current Status Pill */}
            <div className="my-4 p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${emailConfigStatus?.configured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="font-bold">
                  Estado actual del despachador:
                </span>
                <span className={emailConfigStatus?.configured ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-medium'}>
                  {emailConfigStatus?.configured 
                    ? `Activo con ${emailConfigStatus.activeProviders.join(', ')}`
                    : 'Modo Asistente / Preview (Faltan claves en .env o Firebase)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  getEmailConfigStatus().then(setEmailConfigStatus).catch(() => {});
                }}
                className="text-[11px] text-[#0052cc] dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RefreshCw size={12} />
                <span>Actualizar</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: Firebase Console */}
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-xs sm:text-sm">
                    <span>1. Configurar en Firebase Console (Recomendado)</span>
                  </h4>
                  <a
                    href="https://console.firebase.google.com/project/pure-mender-0xctm/authentication/emails"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <span>Ir a Firebase</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Para que Firebase envíe los correos desde tu propio dominio o cuenta de Gmail:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1">
                  <li>Ingresa a <strong>Firebase Console &gt; Authentication &gt; pestaña &quot;Templates&quot;</strong>.</li>
                  <li>Baja hasta la sección <strong>&quot;Configuración de SMTP&quot; (SMTP Settings)</strong> y haz clic en Editar.</li>
                  <li>Activa <strong>&quot;Habilitar SMTP personalizado&quot;</strong>.</li>
                  <li>Ingresa los datos de tu servidor SMTP (ej. Gmail: <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">smtp.gmail.com</code>, puerto <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">587</code>, tu correo y tu Contraseña de Aplicación).</li>
                  <li>¡Guarda los cambios! Todos los correos saldrán con tu remitente oficial.</li>
                </ol>
              </div>

              {/* Option 2: Configurar API Key o SMTP en archivo .env */}
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl space-y-2.5">
                <h4 className="font-bold text-blue-950 dark:text-blue-200 text-xs sm:text-sm">
                  2. Configuración mediante archivo .env (Servidor Express)
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  El servidor backend integrado soporta envío directo mediante <strong>Resend</strong> o tu servidor <strong>SMTP</strong>. Agrega cualquiera de estas opciones a tu archivo <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono font-bold">.env</code>:
                </p>

                <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-[11px] space-y-2 overflow-x-auto">
                  <p className="text-slate-400 font-sans font-bold text-[10px] uppercase">Opción A: Resend (Gratis y más rápida, crea key en resend.com)</p>
                  <code>RESEND_API_KEY=re_tu_api_key_aqui</code>
                  
                  <p className="text-slate-400 font-sans font-bold text-[10px] uppercase pt-2">Opción B: Servidor SMTP Propio (Gmail, Outlook, Hostinger, cPanel)</p>
                  <code>SMTP_HOST=smtp.gmail.com<br/>
SMTP_PORT=587<br/>
SMTP_USER=tu_correo@gmail.com<br/>
SMTP_PASS=tu_contraseña_de_aplicacion_google<br/>
SMTP_SECURE=false<br/>
EMAIL_FROM=&quot;ViaNova Colombia &lt;tu_correo@gmail.com&gt;&quot;</code>
                </div>
              </div>

              {/* Option 3: Probador en Vivo */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-3">
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-1.5">
                  <Send size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>3. Probador de Envío en Vivo</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs">
                  Envía un correo de prueba ahora mismo para validar si tu proveedor está activo y entregando mensajes:
                </p>

                <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Ingresa tu correo (ej. munoznaz12@gmail.com)..."
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSendingTestEmail}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
                  >
                    {isSendingTestEmail ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Enviar Prueba</span>
                      </>
                    )}
                  </button>
                </form>

                {testEmailResult && (
                  <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testEmailResult.success 
                      ? 'bg-emerald-100/70 dark:bg-emerald-900/40 border-emerald-300 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-amber-100/70 dark:bg-amber-900/40 border-amber-300 text-amber-900 dark:text-amber-200'
                  }`}>
                    {testEmailResult.success ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold">{testEmailResult.message}</p>
                      {testEmailResult.provider && (
                        <p className="text-[11px] opacity-80 mt-0.5">Enviado mediante: {testEmailResult.provider}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
