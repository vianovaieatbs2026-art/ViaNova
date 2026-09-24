import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../lib/firebase';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { findRegisteredUserByEmail } from '../utils/authStorage';
import { supabase } from '../lib/supabase';

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
  onSuccessLogin: _onSuccessLogin
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { t } = useThemeLanguage();

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setErrorMessage('');
      setIsSuccess(false);
      setSuccessMessage('');
      setIsLoading(false);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    setErrorMessage('');
    setIsSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage(t('login_email_invalid', 'Por favor ingresa un correo electrónico válido con formato nombre@dominio.com'));
      return;
    }

    // 2. Verificar que el correo exista en la base de datos de ViaNova
    let registeredName = '';
    const localAccount = findRegisteredUserByEmail(cleanEmail);
    if (localAccount && localAccount.profile) {
      registeredName = localAccount.profile.name || '';
    } else {
      // Comprobar también en Supabase / Auth DB
      try {
        const { data } = await supabase.auth.getUser(cleanEmail);
        if (data?.user?.user_metadata?.name) {
          registeredName = data.user.user_metadata.name;
        }
      } catch (_) {}
    }

    setIsLoading(true);

    try {
      // 3. Ejecutar el envío real del enlace de recuperación
      const result = await sendPasswordReset(cleanEmail, registeredName);

      if (result.success) {
        setIsSuccess(true);
        setSuccessMessage(result.message || 'Hemos enviado el enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y la carpeta de spam.');
      } else {
        setErrorMessage(result.message || 'No se pudo enviar el correo de recuperación. Por favor verifica los datos o intenta más tarde.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocurrió un error inesperado al procesar la recuperación de contraseña.');
    } finally {
      setIsLoading(false);
    }
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
              <h3 id="forgot-password-title" data-i18n="forgot_modal_title" className="font-bold text-slate-900 dark:text-white text-base">
                {t('forgot_modal_title', 'Recuperar Contraseña')}
              </h3>
              <p data-i18n="forgot_modal_desc" className="text-xs text-slate-500 dark:text-slate-400">
                {t('forgot_modal_desc', 'Ingresa tu correo para recibir el enlace de restablecimiento.')}
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

        {/* Estado de Éxito */}
        {isSuccess ? (
          <div className="space-y-4">
            <div 
              className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 space-y-2.5"
              role="status"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                  {t('login_forgot_success_title', '¡Correo enviado!')}
                </span>
              </div>
              <p className="leading-relaxed">
                {successMessage}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Enviado a: <strong className="underline">{email}</strong>
              </p>
              <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-800/70 text-[11px] text-emerald-800/90 dark:text-emerald-200/90 space-y-1">
                <p>
                  • Si no lo visualizas en 1-2 minutos, revisa tu carpeta de <strong>Spam</strong> o Correo no deseado.
                </p>
                <p>
                  • Abre el enlace recibido en tu correo para establecer tu nueva contraseña de forma segura.
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                {t('common_close', 'Cerrar')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label 
                htmlFor="forgot-email"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {t('login_email_label', 'Correo Electrónico')}
              </label>
              <input
                id="forgot-email"
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
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex-1 py-2.5 px-4 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enviando enlace...</span>
                  </>
                ) : (
                  <span>Enviar Enlace de Recuperación</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
