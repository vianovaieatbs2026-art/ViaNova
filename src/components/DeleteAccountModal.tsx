import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  ShieldAlert,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { deleteUserAccount } from '../lib/supabase';
import { firebaseLogin } from '../lib/firebase';
import { findRegisteredUserByEmail } from '../utils/authStorage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: (message?: string) => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  userId,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmWord, setConfirmWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { t } = useThemeLanguage();

  // Reset fields when opened
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setConfirmWord('');
      setError('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isWordValid = confirmWord.trim() === 'ELIMINAR';
  const isFormValid = isWordValid && password.trim().length > 0;

  const handleConfirmDelete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    // 1. Verify confirmation word
    if (confirmWord.trim() !== 'ELIMINAR') {
      setError('Debes escribir la palabra "ELIMINAR" exactamente en mayúsculas.');
      return;
    }

    // 2. Verify password input
    if (!password || password.trim() === '') {
      setError('Debes ingresar tu contraseña actual.');
      return;
    }

    setIsDeleting(true);

    try {
      // 3. Authenticate current password against storage or Firebase Auth
      const account = findRegisteredUserByEmail(userEmail);
      let isPasswordCorrect = false;

      if (account?.password && account.password.trim() !== '') {
        if (account.password === password.trim()) {
          isPasswordCorrect = true;
        } else {
          // Check if password was synced with Firebase
          const fbRes = await firebaseLogin(userEmail, password.trim());
          if (fbRes.success) {
            isPasswordCorrect = true;
          }
        }
      } else {
        // Check with Firebase Auth
        const fbRes = await firebaseLogin(userEmail, password.trim());
        if (fbRes.success) {
          isPasswordCorrect = true;
        }
      }

      if (!isPasswordCorrect) {
        setIsDeleting(false);
        setError('La contraseña actual es incorrecta. Por favor verifica tus credenciales.');
        return;
      }

      // 4. Proceed with full account and relational data deletion
      await deleteUserAccount(userId, userEmail);

      setIsDeleting(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al eliminar cuenta:', err);
      setIsDeleting(false);
      setError(err?.message || 'Error al eliminar la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div 
        id="delete-account-confirm-modal"
        className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden"
      >
        {/* Header with Danger Warning */}
        <div className="bg-rose-600 dark:bg-rose-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 id="delete-modal-title" className="text-base font-black leading-tight">
                {t('del_modal_title', 'Eliminar Cuenta Permanentemente')}
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                {t('del_modal_sub', 'Acción destructiva e irreversible')}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-delete-modal-btn"
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmDelete} className="p-6 space-y-4">
          {/* Warning banner */}
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-1.5">
            <div className="font-extrabold flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              <ShieldAlert size={17} className="shrink-0" />
              <span>Esta acción es irreversible y borrará todo tu progreso.</span>
            </div>
            <p className="text-[11px] text-rose-800/90 dark:text-rose-300/80 leading-relaxed">
              Se eliminará tu acceso y todos tus datos personales asociados a <strong className="font-mono">{userEmail}</strong>.
            </p>
          </div>

          {/* Security Requirement 1: Current Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="delete-account-password"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              1. Ingresa tu contraseña actual:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={15} />
              </span>
              <input
                id="delete-account-password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isDeleting}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Tu contraseña actual"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Security Requirement 2: Type ELIMINAR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="delete-account-confirm-word"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                2. Escribe <span className="font-mono text-rose-600 dark:text-rose-400 font-extrabold">ELIMINAR</span> para confirmar:
              </label>
              {isWordValid && (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 size={13} />
                  <span>Correcto</span>
                </span>
              )}
            </div>
            <input
              id="delete-account-confirm-word"
              type="text"
              required
              disabled={isDeleting}
              value={confirmWord}
              onChange={(e) => {
                setConfirmWord(e.target.value);
                if (error) setError('');
              }}
              placeholder="ELIMINAR"
              autoComplete="off"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertTriangle size={15} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              id="cancel-delete-account-btn"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 disabled:opacity-50 text-center"
            >
              {t('btn_cancel', 'Cancelar')}
            </button>

            <button
              type="submit"
              id="confirm-delete-account-btn"
              disabled={!isFormValid || isDeleting}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isFormValid && !isDeleting
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25 active:scale-95'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Eliminando cuenta...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Eliminar cuenta permanentemente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
