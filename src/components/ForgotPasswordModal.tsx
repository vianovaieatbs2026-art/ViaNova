import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, Loader2, ShieldCheck, Eye, EyeOff, Settings, ArrowLeft } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { findRegisteredUserByEmail, updateRegisteredUserPassword } from '../utils/authStorage';
import { supabase } from '../lib/supabase';
import { sendPasswordReset } from '../lib/firebase';
import { 
  sendRecoveryCodeViaEmailJS, 
  verifyRecoveryCodeInStorage, 
  clearRecoveryCodeFromStorage, 
  getEmailJSConfig, 
  saveEmailJSConfig,
  isEmailJSConfigured 
} from '../services/emailjsService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onOpenResetCode?: () => void;
  onSuccessLogin?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onOpenResetCode: _onOpenResetCode,
  onSuccessLogin
}) => {
  const { t } = useThemeLanguage();

  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [enteredCode, setEnteredCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedCodeHint, setGeneratedCodeHint] = useState<number | null>(null);

  // EmailJS Settings collapsible
  const [showSettings, setShowSettings] = useState(false);
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [serviceIdInput, setServiceIdInput] = useState('');
  const [templateIdInput, setTemplateIdInput] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setEnteredCode('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(false);
      setStep('request');
      setGeneratedCodeHint(null);
      setShowSettings(false);
      setSettingsSaved(false);

      const cfg = getEmailJSConfig();
      setPublicKeyInput(cfg.publicKey === 'TU_PUBLIC_KEY_AQUI' ? '' : cfg.publicKey);
      setServiceIdInput(cfg.serviceId === 'TU_SERVICE_ID' ? '' : cfg.serviceId);
      setTemplateIdInput(cfg.templateId === 'TU_TEMPLATE_ID' ? '' : cfg.templateId);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    setErrorMessage('');
    onClose();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailJSConfig({
      publicKey: publicKeyInput.trim() || 'TU_PUBLIC_KEY_AQUI',
      serviceId: serviceIdInput.trim() || 'TU_SERVICE_ID',
      templateId: templateIdInput.trim() || 'TU_TEMPLATE_ID'
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Step 1: Enviar código de 6 dígitos con EmailJS
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage(t('login_email_invalid', 'Por favor ingresa un correo electrónico válido.'));
      return;
    }

    // 1. Validar que el correo esté asociado a una cuenta existente
    let exists = false;
    let registeredName = '';

    const localAccount = findRegisteredUserByEmail(cleanEmail);
    if (localAccount?.profile) {
      exists = true;
      registeredName = localAccount.profile.name || '';
    }

    if (!exists) {
      try {
        const { data, error } = await supabase.auth.getUser(cleanEmail);
        if (!error && data?.user) {
          exists = true;
          registeredName = data.user.user_metadata?.name || '';
        }
      } catch (_) {}
    }

    if (!exists) {
      try {
        const srvCheck = await fetch('/api/auth/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail })
        });
        const srvData = await srvCheck.json().catch(() => ({}));
        if (srvCheck.ok && srvData.exists) {
          exists = true;
          registeredName = srvData.user?.name || '';
        }
      } catch (_) {}
    }

    if (!exists) {
      setIsLoading(false);
      setErrorMessage(t('forgot_err_not_found', 'No existe ninguna cuenta registrada con este correo electrónico. Por favor verifica tu correo o regístrate.'));
      return;
    }

    setIsLoading(true);

    try {
      // 1. Envío mediante EmailJS y guardado en localStorage (codigo_real, correo_real, expiración 15m)
      const emailjsResult = await sendRecoveryCodeViaEmailJS(cleanEmail);
      setGeneratedCodeHint(emailjsResult.code);

      // 2. Envío complementario mediante servidor Express y Firebase
      sendPasswordReset(cleanEmail, registeredName).catch(() => {});

      setIsLoading(false);
      setSuccessMessage(
        emailjsResult.isRealEmailSent 
          ? `¡Listo! Código de recuperación enviado a ${cleanEmail}. Revisa tu bandeja de entrada y carpeta de spam (válido por 15 minutos).`
          : `¡Listo! Código de recuperación generado para ${cleanEmail} (válido por 15 minutos).`
      );
      setStep('verify');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Error al procesar el envío del código.');
    }
  };

  // Step 2: Validar código y restablecer contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = enteredCode.trim().replace(/\D/g, '');

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Por favor ingresa el código numérico de 6 dígitos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);

    // 1. Verificar el código en localStorage (codigo_real, correo_real, validez de 15 minutos y un solo uso)
    const verification = verifyRecoveryCodeInStorage(cleanEmail, cleanCode);
    if (!verification.success) {
      setIsLoading(false);
      setErrorMessage(verification.message);
      return;
    }

    // 2. Actualizar contraseña localmente en almacenamiento seguro
    updateRegisteredUserPassword(cleanEmail, newPassword);

    // 3. Actualizar contraseña en el servidor backend
    try {
      await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, newPassword })
      });
      await fetch('/api/confirm-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode, newPassword })
      });
    } catch (_) {}

    // 4. Limpiar código usado de localStorage para invalidarlo permanentemente contra reúsos
    clearRecoveryCodeFromStorage();

    setIsLoading(false);
    setSuccessMessage('¡Contraseña restablecida exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.');
    setStep('success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0052cc] dark:text-sky-400">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 id="forgot-password-title" className="font-bold text-slate-900 dark:text-white text-base">
                {step === 'success'
                  ? '¡Contraseña Restablecida!'
                  : step === 'verify'
                  ? 'Ingresar Código de 6 Dígitos'
                  : 'ViaNova - Recuperar Contraseña'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 'verify' 
                  ? `Código enviado a ${email}` 
                  : 'Recupera tu acceso de forma rápida y segura.'}
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

        {/* Mensaje de Error */}
        {errorMessage && (
          <div 
            className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* ESTADO: ÉXITO FINAL */}
        {step === 'success' && (
          <div className="space-y-4">
            <div 
              className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 space-y-2"
              role="status"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                  ¡Cambio completado!
                </span>
              </div>
              <p className="leading-relaxed">
                {successMessage}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Cuenta: <strong>{email}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSuccessLogin) {
                  onSuccessLogin(email);
                } else {
                  handleClose();
                }
              }}
              className="w-full py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center"
            >
              Iniciar Sesión Ahora
            </button>
          </div>
        )}

        {/* ESTADO: PASO 1 - ENVIAR CÓDIGO */}
        {step === 'request' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label 
                htmlFor="forgot-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {t('login_email_label', 'Correo del usuario')}
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Correo del usuario"
                required
                disabled={isLoading}
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] dark:focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
              />
            </div>

            {/* EmailJS Configuration Accordion */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Settings size={13} />
                  <span>Configuración EmailJS {isEmailJSConfigured() ? '✓ (Activo)' : '(Opcional)'}</span>
                </span>
                <span>{showSettings ? '▲' : '▼'}</span>
              </button>

              {showSettings && (
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                      EmailJS Public Key
                    </label>
                    <input
                      type="text"
                      value={publicKeyInput}
                      onChange={(e) => setPublicKeyInput(e.target.value)}
                      placeholder="TU_PUBLIC_KEY_AQUI"
                      className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                      Service ID
                    </label>
                    <input
                      type="text"
                      value={serviceIdInput}
                      onChange={(e) => setServiceIdInput(e.target.value)}
                      placeholder="TU_SERVICE_ID"
                      className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                      Template ID
                    </label>
                    <input
                      type="text"
                      value={templateIdInput}
                      onChange={(e) => setTemplateIdInput(e.target.value)}
                      placeholder="TU_TEMPLATE_ID"
                      className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-3 py-1 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Guardar Claves
                    </button>
                    {settingsSaved && (
                      <span className="text-[11px] text-emerald-600 font-bold">¡Guardado!</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer text-center"
              >
                {t('common_cancel', 'Cancelar')}
              </button>
              <button
                id="btnEnviar"
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex-1 py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enviando código...</span>
                  </>
                ) : (
                  <span>Enviar código</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ESTADO: PASO 2 - INGRESAR CÓDIGO Y NUEVA CONTRASEÑA */}
        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{successMessage}</p>
                  {generatedCodeHint && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                      <span>Código de recuperación:</span>
                      <strong className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded text-xs">{generatedCodeHint}</strong>
                      <button
                        type="button"
                        onClick={() => setEnteredCode(String(generatedCodeHint))}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer ml-auto transition-colors"
                      >
                        Usar este código
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label 
                htmlFor="verification-code"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Código de Verificación (6 dígitos)
              </label>
              <input
                id="verification-code"
                type="text"
                maxLength={6}
                value={enteredCode}
                onChange={(e) => {
                  setEnteredCode(e.target.value.replace(/\D/g, ''));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ejemplo: 489201"
                required
                disabled={isLoading}
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-base font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="new-pwd"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="new-pwd"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="confirm-pwd"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirm-pwd"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Repite la nueva contraseña"
                  required
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep('request')}
                disabled={isLoading}
                className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Volver</span>
              </button>
              <button
                type="submit"
                disabled={isLoading || !enteredCode.trim() || !newPassword.trim()}
                className="flex-1 py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Restableciendo...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Restablecer Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
