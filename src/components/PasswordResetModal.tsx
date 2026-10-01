import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  X,
  Mail,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { verifyResetCode, confirmNewPassword, getLastResetEmail } from '../lib/firebase';
import { updateRegisteredUserPassword } from '../utils/authStorage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { verifyRecoveryCodeInStorage, clearRecoveryCodeFromStorage } from '../services/emailjsService';

interface PasswordResetModalProps {
  isOpen: boolean;
  initialCode?: string;
  onClose: () => void;
  onSuccessLogin: (email: string) => void;
  onRequestNewLink: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  initialCode = '',
  onClose,
  onSuccessLogin,
  onRequestNewLink
}) => {
  const { t } = useThemeLanguage();

  const [rawInput, setRawInput] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [activeCode, setActiveCode] = useState(initialCode);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [step, setStep] = useState<'verifying' | 'input_code' | 'set_password' | 'success' | 'error'>('verifying');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Extract oobCode from string if user pasted a full URL
  const extractCode = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    try {
      if (trimmed.includes('oobCode=')) {
        const match = trimmed.match(/[?&]oobCode=([^&]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }
    } catch (_) {}
    return trimmed;
  };

  // Verify code with Firebase Auth / Backend Service
  const handleVerifyCode = async (codeToVerify: string, emailHint?: string) => {
    const cleanCode = extractCode(codeToVerify);
    if (!cleanCode) {
      setErrorMessage('Por favor ingresa o pega el código o enlace recibido en tu correo.');
      setStep('input_code');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setStep('verifying');

    const emailToUse = (emailHint || candidateEmail || getLastResetEmail()).trim().toLowerCase();

    // Check localStorage recovery code (from EmailJS)
    const storageCheck = verifyRecoveryCodeInStorage(emailToUse, cleanCode);
    if (storageCheck.success) {
      setIsLoading(false);
      setActiveCode(cleanCode);
      const storedEmail = localStorage.getItem('correo_real') || emailToUse;
      setVerifiedEmail(storedEmail);
      setStep('set_password');
      return;
    }

    const res = await verifyResetCode(cleanCode, emailToUse);
    setIsLoading(false);

    if (res.success && res.email) {
      setActiveCode(cleanCode);
      setVerifiedEmail(res.email);
      setStep('set_password');
    } else {
      setErrorMessage(res.message || 'El enlace o código de recuperación no es válido o ha expirado.');
      setStep('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
      const lastEmail = getLastResetEmail();
      if (lastEmail) {
        setCandidateEmail(lastEmail);
      }
      
      if (initialCode && initialCode.trim()) {
        setRawInput(initialCode.trim());
        handleVerifyCode(initialCode.trim(), lastEmail);
      } else {
        setStep('input_code');
      }
    }
  }, [isOpen, initialCode]);

  // Handle password submission
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);

    try {
      const emailToUse = (verifiedEmail || candidateEmail || getLastResetEmail()).trim().toLowerCase();

      // If active code matches stored EmailJS code
      const storedCode = localStorage.getItem('codigo_real');
      if (storedCode && storedCode === activeCode.replace(/\D/g, '')) {
        if (emailToUse) {
          updateRegisteredUserPassword(emailToUse, newPassword);
        }
        clearRecoveryCodeFromStorage();
        setIsLoading(false);

        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          try {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch (_) {}
        }

        setSuccessMessage('¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión con tus nuevas credenciales.');
        setStep('success');
        return;
      }

      const res = await confirmNewPassword(activeCode, newPassword, emailToUse);
      setIsLoading(false);

      if (res.success) {
        // Update local credential cache so the user can immediately log in
        if (emailToUse) {
          updateRegisteredUserPassword(emailToUse, newPassword);
        }

        // Clean query parameters from address bar cleanly
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          try {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch (_) {}
        }

        setSuccessMessage('¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión con tus nuevas credenciales.');
        setStep('success');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Error al conectar con el servidor de autenticación.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-[#0052cc] dark:text-sky-400 shadow-xs shrink-0">
            <KeyRound size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {step === 'success' 
                ? '¡Contraseña Restablecida!' 
                : 'Recuperación de Contraseña'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {step === 'success'
                ? 'Acceso seguro restablecido vía Firebase Auth'
                : 'Enlace oficial de recuperación ViaNova'}
            </p>
          </div>
        </div>

        {/* Step: VERIFYING */}
        {step === 'verifying' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Verificando enlace de recuperación...
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validando el código de seguridad con Firebase Auth
            </p>
          </div>
        )}

        {/* Step: ERROR / EXPIRED */}
        {step === 'error' && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-700 dark:text-rose-300 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="font-bold text-sm">Enlace no válido o expirado</p>
                  <p className="mt-1 leading-relaxed">
                    {errorMessage || 'El enlace de recuperación ya fue utilizado o ha caducado por razones de seguridad.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestNewLink();
                }}
                className="w-full py-3 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail size={15} />
                <span>Solicitar un nuevo enlace de recuperación</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('input_code')}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Pegar otro enlace o código manualmente
              </button>
            </div>
          </div>
        )}

        {/* Step: MANUAL INPUT OF CODE / LINK */}
        {step === 'input_code' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ingresa el <strong>código de 6 dígitos</strong> o el <strong>enlace de recuperación</strong> que te enviamos al correo electrónico:
            </p>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="reset-candidate-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tu Correo Electrónico
              </label>
              <input
                id="reset-candidate-email"
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="manual-code-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Código de Verificación (6 dígitos) o Enlace
              </label>
              <textarea
                id="manual-code-input"
                rows={2}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Ejemplo: 489201 o pega el enlace recibido..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-slate-900 dark:text-white tracking-wider"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Acepta tanto el código numérico como el enlace seguro de Firebase.
              </p>
            </div>

            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300">
              💡 <strong>¿No encuentras el correo?</strong> Revisa tu correo, incluyendo la bandeja de spam o correo no deseado.
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleVerifyCode(rawInput, candidateEmail)}
                disabled={!rawInput.trim() || isLoading}
                className="flex-1 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <ShieldCheck size={14} />}
                <span>Verificar Código</span>
              </button>
            </div>
          </div>
        )}

        {/* Step: SET NEW PASSWORD */}
        {step === 'set_password' && (
          <form onSubmit={handleSubmitNewPassword} className="space-y-4">
            {/* Verified Email Banner */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="font-bold">Enlace verificado con éxito</p>
                <p className="truncate text-slate-600 dark:text-slate-400">
                  Cuenta: <strong className="text-slate-900 dark:text-white">{verifiedEmail}</strong>
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label htmlFor="new-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="new-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres..."
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Usa al menos 6 caracteres (recomendado: mayúsculas, números o símbolos).
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirm-password-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña..."
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full py-3 bg-[#0052cc] hover:bg-[#0047b3] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Actualizando contraseña en Firebase...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Guardar y Restablecer Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step: SUCCESS */}
        {step === 'success' && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-emerald-800 dark:text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>¡Contraseña actualizada exitosamente!</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Tu nueva contraseña ya está sincronizada y protegida en Firebase Auth. Ahora puedes iniciar sesión en ViaNova con tus nuevas credenciales.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSuccessLogin(verifiedEmail);
              }}
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Iniciar Sesión Ahora</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
