import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { sendPasswordReset } from '../lib/firebase';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const { t } = useThemeLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initial email when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setErrorMessage('');
      setSuccessMessage('');
      setIsSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(t('login_err_empty_email', 'Correo inválido'));
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await sendPasswordReset(cleanEmail);
      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
        setSuccessMessage(t('forgot_modal_success', 'Revisa tu correo, te enviamos un enlace para restablecer tu contraseña. Revisa también spam.'));
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setErrorMessage(t('login_err_not_found', 'No existe una cuenta con ese correo'));
      } else if (code === 'auth/invalid-email') {
        setErrorMessage(t('login_err_empty_email', 'Correo inválido'));
      } else if (code === 'auth/too-many-requests') {
        setErrorMessage('Demasiados intentos, espera unos minutos');
      } else {
        setErrorMessage('Ocurrió un error al enviar el correo. Inténtalo de nuevo.');
      }
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setErrorMessage('');
    setSuccessMessage('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all"
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

        {/* Error message in RED */}
        {errorMessage && (
          <div 
            className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Success State in GREEN */}
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
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                data-i18n="forgot_modal_btn_back"
                className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0043a8] text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>{t('forgot_modal_btn_back', 'Volver al inicio de sesión')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form requesting ONLY the email input */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="forgot-email-input" 
                data-i18n="forgot_modal_email_label"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t('forgot_modal_email_label', 'Correo Electrónico')}
              </label>
              <input
                id="forgot-email-input"
                type="email"
                required
                autoFocus
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0052cc] bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-60 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleClose}
                data-i18n="forgot_modal_btn_cancel"
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer disabled:opacity-50 transition-colors"
              >
                {t('forgot_modal_btn_cancel', 'Cancelar')}
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                data-i18n="forgot_modal_btn_send"
                className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0043a8] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>{t('forgot_modal_btn_send', 'Enviar Enlace')}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
