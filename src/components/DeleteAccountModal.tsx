import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  Loader2 
} from 'lucide-react';
import { deleteUserAccountPermanently } from '../utils/authStorage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmWord, setConfirmWord] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useThemeLanguage();

  if (!isOpen) return null;

  const isConfirmed = confirmWord.trim() === 'ELIMINAR' && password.trim().length > 0;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmWord.trim() !== 'ELIMINAR') {
      setError(t('del_word_error', 'Debes escribir la palabra exacta "ELIMINAR" para continuar.'));
      return;
    }

    if (!password.trim()) {
      setError(t('del_pwd_error', 'Debes ingresar tu contraseña para confirmar tu identidad.'));
      return;
    }

    setIsDeleting(true);

    setTimeout(() => {
      const result = deleteUserAccountPermanently(userEmail, password);
      setIsDeleting(false);

      if (!result.success) {
        setError(result.message || t('del_failed_error', 'No fue posible eliminar la cuenta.'));
        return;
      }

      onSuccess(result.message);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setPassword('');
    setConfirmWord('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden"
      >
        {/* Header with Danger Warning */}
        <div className="bg-rose-600 dark:bg-rose-900/80 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight">{t('del_modal_title', 'Eliminar Cuenta Definitivamente')}</h2>
              <p className="text-xs text-rose-100">{t('del_modal_sub', 'Acción permanente e irreversible')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleDelete} className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
            <div className="font-extrabold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
              <ShieldAlert size={16} />
              <span>{t('del_sure_title', '¿Estás completamente seguro?')}</span>
            </div>
            <p className="leading-relaxed">
              Al eliminar la cuenta asociada a <strong className="font-mono text-[11px]">{userEmail}</strong>, se borrarán todos tus registros de conductor, certificaciones oficiales, historial de quizzes y reportes de la base de datos.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <AlertTriangle size={15} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Password confirmation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155] dark:text-slate-300 block">
              {t('del_step1_pwd', '1. Ingresa tu contraseña actual:')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('del_pwd_placeholder', 'Tu contraseña actual')}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Type ELIMINAR */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#334155] dark:text-slate-300 block">
              2. {t('del_step2_word', 'Escribe la palabra')} <span className="text-rose-600 dark:text-rose-400 font-black">ELIMINAR</span> {t('del_step2_word_end', 'para confirmar:')}
            </label>
            <input
              type="text"
              value={confirmWord}
              onChange={(e) => setConfirmWord(e.target.value)}
              placeholder="ELIMINAR"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-bold tracking-widest focus:ring-2 focus:ring-rose-500 focus:outline-hidden uppercase"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('btn_cancel', 'Cancelar')}
            </button>

            <button
              type="submit"
              disabled={!isConfirmed || isDeleting}
              className={`px-4 py-2.5 rounded-xl text-xs font-black text-white flex items-center gap-2 transition-all cursor-pointer ${
                isConfirmed && !isDeleting
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95'
                  : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('del_deleting_btn', 'Eliminando cuenta...')}</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>{t('del_perm_btn', 'Eliminar permanentemente')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
