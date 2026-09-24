import React, { useState, useEffect, useRef } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Clock, 
  MailCheck, 
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { findRegisteredUserByEmail, updateRegisteredUserPassword } from '../utils/authStorage';
import { supabase } from '../lib/supabase';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { requestPasswordReset, verifyPasswordReset, confirmPasswordResetWithCode } from '../services/emailService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccessLogin?: (email: string) => void;
  onOpenResetCode?: () => void;
}

type RecoveryStep = 'email' | 'code' | 'new_password' | 'success';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccessLogin
}) => {
  const { t } = useThemeLanguage();

  // Navigation step state
  const [step, setStep] = useState<RecoveryStep>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [resolvedUserName, setResolvedUserName] = useState('');

  // 10-minute countdown timer (600 seconds)
  const [countdown, setCountdown] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input ref
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Sync initial email when modal opens and reset state
  useEffect(() => {
    if (isOpen) {
      setEmail((initialEmail || '').trim().toLowerCase());
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setErrorMessage('');
      setSuccessBanner('');
      setIsLoading(false);
      setStep('email');
      setCountdown(600);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isOpen, initialEmail]);

  // Countdown timer effect during code step
  useEffect(() => {
    if (step === 'code' && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step, countdown]);

  if (!isOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to verify if user exists in database
  const verifyUserInDatabase = async (targetEmail: string): Promise<{ exists: boolean; name: string }> => {
    const cleanEmail = targetEmail.trim().toLowerCase();

    // 1. Check local persistent accounts (ViaNova registered users)
    const localAccount = findRegisteredUserByEmail(cleanEmail);
    if (localAccount && localAccount.profile) {
      return { 
        exists: true, 
        name: localAccount.profile.name || 'Usuario' 
      };
    }

    // 2. Check universal Supabase / system accounts
    try {
      const { data: userCheck } = await supabase.auth.getUser(cleanEmail);
      if (userCheck?.user) {
        const metaName = userCheck.user.user_metadata?.name || '';
        return { exists: true, name: metaName || 'Usuario' };
      }
    } catch (_) {}

    // 3. Check Firestore users collection if connected
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', cleanEmail));
        if (userDoc.exists()) {
          const docData = userDoc.data();
          return { exists: true, name: docData?.name || 'Usuario' };
        }
      } catch (_) {}
    }

    return { exists: false, name: '' };
  };

  // STEP 1: Handle sending recovery code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessBanner('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format (requirement 3)
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico con formato válido (ejemplo: usuario@correo.com).');
      return;
    }

    setIsLoading(true);

    try {
      // Verify user existence in database (requirement 3)
      const userCheck = await verifyUserInDatabase(cleanEmail);

      if (!userCheck.exists) {
        setIsLoading(false);
        setErrorMessage('No existe ninguna cuenta asociada a este correo electrónico. Por favor verifica que esté bien escrito o regístrate en la plataforma.');
        return;
      }

      setResolvedUserName(userCheck.name);

      // Call backend to generate 6-digit code and dispatch REAL email (requirement 4 & 5)
      const res = await requestPasswordReset(cleanEmail, userCheck.name);

      setIsLoading(false);

      if (res.success) {
        setSuccessBanner('Código enviado correctamente. Revisa tu correo electrónico.');
        setStep('code');
        setCountdown(600); // 10 minutes (requirement 7)
        setTimeout(() => {
          if (codeInputRef.current) {
            codeInputRef.current.focus();
          }
        }, 150);
      } else {
        // Honest error message when email service fails or is unconfigured (requirement 4, 13)
        setErrorMessage(res.message || 'Error al enviar el correo. Por favor verifica la configuración o intenta de nuevo.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Error al procesar la solicitud de recuperación. Inténtalo de nuevo.');
    }
  };

  // STEP 2: Handle verifying the 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessBanner('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().replace(/\D/g, '');

    if (!cleanCode || cleanCode.length !== 6) {
      setErrorMessage('Por favor ingresa el código completo de 6 dígitos numéricos.');
      return;
    }

    if (countdown <= 0) {
      setErrorMessage('El código ha expirado (validez de 10 minutos). Haz clic en "Reenviar código" para recibir uno nuevo.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyPasswordReset(cleanEmail, cleanCode);
      setIsLoading(false);

      if (res.success) {
        setStep('new_password');
        setSuccessBanner('Código verificado correctamente.');
      } else {
        setErrorMessage(res.message || 'Código incorrecto. Verifica los 6 dígitos recibidos en tu correo.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Error al verificar el código con el servidor.');
    }
  };

  // Resend recovery code action
  const handleResendCode = async () => {
    if (isLoading) return;
    setErrorMessage('');
    setSuccessBanner('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await requestPasswordReset(cleanEmail, resolvedUserName);
      setIsLoading(false);

      if (res.success) {
        setCode('');
        setCountdown(600); // Reset 10 minutes
        setSuccessBanner('Nuevo código de 6 dígitos enviado exitosamente a tu correo.');
        if (codeInputRef.current) {
          codeInputRef.current.focus();
        }
      } else {
        setErrorMessage(res.message || 'No se pudo reenviar el código. Inténtalo de nuevo en unos momentos.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Error al solicitar un nuevo código de recuperación.');
    }
  };

  // STEP 3: Handle setting new password
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor asegúrate de que sean idénticas.');
      return;
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().replace(/\D/g, '');

    try {
      // 1. Confirm and invalidate code on server (requirement 11 & 12)
      const res = await confirmPasswordResetWithCode(cleanEmail, cleanCode, newPassword);

      if (!res.success) {
        setIsLoading(false);
        setErrorMessage(res.message || 'Error al actualizar la contraseña en el servidor.');
        return;
      }

      // 2. Update password in the database (requirement 11)
      const updatedLocally = updateRegisteredUserPassword(cleanEmail, newPassword);

      // 3. Sync into Firestore if configured
      if (db) {
        try {
          await setDoc(doc(db, 'users', cleanEmail), {
            password: newPassword,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (_) {}
      }

      setIsLoading(false);

      if (updatedLocally || res.success) {
        setStep('success');
      } else {
        setErrorMessage('La contraseña fue verificada pero ocurrió un error al guardarla en la base de datos local.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Error al guardar la nueva contraseña. Por favor intenta de nuevo.');
    }
  };

  // Close modal safely
  const handleClose = () => {
    if (isLoading) return;
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  // Complete success flow and take user to login
  const handleFinalizeLogin = () => {
    const cleanEmail = email.trim().toLowerCase();
    handleClose();
    if (onSuccessLogin) {
      onSuccessLogin(cleanEmail);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0052cc] via-[#2684ff] to-[#38bdf8]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-5 mt-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              step === 'success' 
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                : 'bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400'
            }`}>
              {step === 'email' && <KeyRound size={20} />}
              {step === 'code' && <MailCheck size={20} />}
              {step === 'new_password' && <Lock size={20} />}
              {step === 'success' && <CheckCircle2 size={20} />}
            </div>
            <div>
              <h3 id="forgot-password-title" className="font-bold text-slate-900 dark:text-white text-base">
                {step === 'email' && 'Recuperar Contraseña'}
                {step === 'code' && 'Ingresa el Código'}
                {step === 'new_password' && 'Nueva Contraseña'}
                {step === 'success' && '¡Contraseña Cambiada!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 'email' && 'Paso 1 de 3: Ingresa tu correo registrado'}
                {step === 'code' && 'Paso 2 de 3: Valida el código de 6 dígitos'}
                {step === 'new_password' && 'Paso 3 de 3: Define tu nueva clave'}
                {step === 'success' && 'Recuperación completada exitosamente'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Error Notice in Red */}
        {errorMessage && (
          <div 
            className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-fadeIn"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div className="font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Global Success Banner in Green */}
        {successBanner && (
          <div 
            className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn"
            role="status"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="font-medium leading-tight">{successBanner}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: Enter Registered Email                                            */}
        {/* ========================================================================= */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label 
                htmlFor="recovery-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Correo Electrónico Registrado
              </label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="ejemplo: usuario@correo.com"
                required
                disabled={isLoading}
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] dark:focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verificaremos que el correo exista en la base de datos de ViaNova antes de enviar el código.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex-1 py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verificando y enviando...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Enviar Código</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Enter 6-digit verification code                                   */}
        {/* ========================================================================= */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <MailCheck size={15} className="text-[#0052cc] dark:text-sky-400" />
                  Código de 6 dígitos enviado
                </span>
                <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                  countdown < 60 
                    ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 animate-pulse' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-sky-300'
                }`}>
                  <Clock size={12} />
                  {formatTime(countdown)}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80">
                Enviado a: <strong className="underline text-[#0052cc] dark:text-sky-300">{email}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="verification-code-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 text-center"
              >
                Ingresa el código numérico recibido
              </label>
              <input
                id="verification-code-input"
                ref={codeInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="------"
                required
                disabled={isLoading}
                autoFocus
                className="w-full tracking-[0.45em] text-center font-mono text-2xl font-black py-3 px-4 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 focus:border-[#0052cc] dark:focus:border-sky-500 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span>Válido durante 10 minutos</span>
                <span>{code.length}/6 dígitos</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isLoading || code.length !== 6 || countdown <= 0}
                className="w-full py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verificando código...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verificar Código</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setErrorMessage('');
                  }}
                  disabled={isLoading}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1 font-medium text-[11px]"
                >
                  <ArrowLeft size={13} />
                  <span>Cambiar correo</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-[#0052cc] dark:text-sky-400 hover:underline font-bold transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                  <span>Reenviar código</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Create New Password                                               */}
        {/* ========================================================================= */}
        {step === 'new_password' && (
          <form onSubmit={handleSubmitNewPassword} className="space-y-4">
            <div className="space-y-1">
              <label 
                htmlFor="new-password"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={isLoading}
                  autoFocus
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] dark:focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Alternar visibilidad"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label 
                htmlFor="confirm-new-password"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Repite la nueva contraseña"
                  required
                  disabled={isLoading}
                  className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] dark:focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Alternar visibilidad"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Validation helper */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
              <div className={`flex items-center gap-1.5 ${newPassword.length >= 6 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                <CheckCircle2 size={13} className={newPassword.length >= 6 ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Mínimo 6 caracteres</span>
              </div>
              <div className={`flex items-center gap-1.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                <CheckCircle2 size={13} className={newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Las contraseñas coinciden</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Guardando en la base de datos...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Guardar Nueva Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Success State (Requirement 10, 11, 12, 13)                         */}
        {/* ========================================================================= */}
        {step === 'success' && (
          <div className="space-y-5 py-2 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-scaleUp">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                ¡Contraseña cambiada correctamente!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                Tu contraseña ha sido actualizada con éxito en la base de datos de <strong>ViaNova Colombia</strong>. El código utilizado ha sido invalidado por seguridad.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 text-left">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Cuenta actualizada:
              </p>
              <p className="font-mono text-[11px] text-[#0052cc] dark:text-sky-400 break-all">
                {email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalizeLogin}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Iniciar Sesión Ahora</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
