import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  QrCode, 
  FileBadge, 
  CheckCircle2, 
  User, 
  Car,
  Share2,
  LogIn,
  UserPlus,
  LogOut,
  Trash2,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { UserProfile } from '../types';
import { ViaNovaLogo } from './ViaNovaLogo';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface ProfileScreenProps {
  user: UserProfile | null;
  onBackToDashboard: () => void;
  onNavigateToAuth: (mode: 'login' | 'registro') => void;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onDeleteAccountRequested?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  user, 
  onBackToDashboard,
  onNavigateToAuth,
  onLogout,
  onUpdateUser,
  onDeleteAccountRequested
}) => {
  const [copied, setCopied] = useState(false);
  const { 
    themeMode, 
    activeThemeConfig, 
    t 
  } = useThemeLanguage();

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 animate-fade-in text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2e8f0] dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-6 transition-colors">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ 
              backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : activeThemeConfig.bgLightHex, 
              color: activeThemeConfig.primaryHex 
            }}
          >
            <User size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white">
              {t('profile_title', 'Mi Perfil & Credencial Digital')}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Aún no has iniciado sesión en <strong>ViaNova</strong>. Ingresa con tu cuenta o regístrate para acceder a tu credencial digital de conductor seguro con código QR, guardar tus certificaciones y registrar reportes viales.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToAuth('login')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              style={{ backgroundColor: activeThemeConfig.primaryHex }}
            >
              <LogIn size={16} />
              <span>{t('nav_login', 'Iniciar Sesión')}</span>
            </button>
            <button
              onClick={() => onNavigateToAuth('registro')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-[#334155] dark:text-slate-200 text-xs font-bold hover:bg-[#f8fafc] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>{t('nav_register', 'Crear Cuenta Nueva')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-fade-in">
      {/* Back button & Clean Title (without duplicate settings buttons) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="text-xs font-bold text-[#64748b] dark:text-slate-400 hover:underline flex items-center gap-1.5 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{t('prof_btn_back_dash', 'Volver al Inicio')}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white">
            {t('profile_title', 'Credencial Digital & Perfil')}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1">
            {t('profile_sub', 'Expediente oficial del usuario en la plataforma de movilidad ViaNova.')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs text-[#0f172a] dark:text-white"
          >
            <Share2 size={14} className="text-[#0052cc] dark:text-sky-400" />
            <span>{copied ? t('common_copied', '¡Copiado!') : t('common_share', 'Compartir')}</span>
          </button>
        </div>
      </div>

      {/* Digital Card Preview */}
      <div 
        className="rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${activeThemeConfig.primaryHex} 0%, #0f172a 100%)`
        }}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                <ViaNovaLogo size="sm" showText={false} />
              </div>
              <div>
                <span className="text-[9px] tracking-widest font-black uppercase text-sky-200 block">
                  REPÚBLICA DE COLOMBIA • MOVILIDAD INTELIGENTE
                </span>
                <h2 className="text-base font-black tracking-tight text-white">{t('profile_digital_id', 'VIANOVA DRIVER DIGITAL ID')}</h2>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">{t('profile_registered_holder', 'Titular Registrado')}</span>
              <p className="text-2xl font-black tracking-wide">{user.name}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1 text-xs">
              <div>
                <span className="text-sky-200 uppercase block text-[10px] font-bold">{t('profile_runt_id', 'Identificador RUNT')}</span>
                <span className="font-mono font-bold text-sm">{user.licenseNumber || 'CO-RUNT-84920'}</span>
              </div>
              <div>
                <span className="text-sky-200 uppercase block text-[10px] font-bold">{t('profile_license_cat', 'Categoría Licencia')}</span>
                <span className="font-bold">{user.licenseCategory || 'B1 (Automóviles)'}</span>
              </div>
              <div>
                <span className="text-sky-200 uppercase block text-[10px] font-bold">{t('profile_status_on_road', 'Estado en Vía')}</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-300">
                  <CheckCircle2 size={12} /> {t('profile_status_enabled', 'Habilitado 2026')}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Validation Box */}
          <div className="bg-white text-[#0f172a] p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center shrink-0 self-center md:self-auto border border-white/20">
            <div 
              className="w-24 h-24 rounded-xl flex items-center justify-center border"
              style={{ 
                backgroundColor: activeThemeConfig.bgLightHex, 
                borderColor: activeThemeConfig.borderLightHex,
                color: activeThemeConfig.primaryHex 
              }}
            >
              <QrCode size={72} />
            </div>
            <span className="text-[9px] font-bold text-[#64748b] mt-2 text-center uppercase tracking-wider">
              {t('profile_qr_badge', 'Validación QR Digital')}
            </span>
          </div>
        </div>
      </div>

      {/* User Information & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
            <User size={18} style={{ color: activeThemeConfig.primaryHex }} />
            <span>{t('profile_user_data', 'Datos del Usuario')}</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-[#f1f5f9] dark:border-slate-800">
              <span className="text-[#64748b] dark:text-slate-400">{t('profile_full_name', 'Nombre Completo')}</span>
              <span className="font-bold text-[#0f172a] dark:text-white">{user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f1f5f9] dark:border-slate-800">
              <span className="text-[#64748b] dark:text-slate-400">{t('profile_email', 'Correo Electrónico')}</span>
              <span className="font-bold text-[#0f172a] dark:text-white">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f1f5f9] dark:border-slate-800">
              <span className="text-[#64748b] dark:text-slate-400">{t('profile_type', 'Tipo de Perfil')}</span>
              <span className="font-bold capitalize" style={{ color: activeThemeConfig.primaryHex }}>{user.userType}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#64748b] dark:text-slate-400">Horas de Capacitación</span>
              <span className="font-bold text-[#0f172a] dark:text-white">{user.completedHours} hrs</span>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
            <Award size={18} style={{ color: activeThemeConfig.primaryHex }} />
            <span>{t('profile_achievements', 'Insignias de Movilidad Segura en Colombia')}</span>
          </h3>

          <div className="space-y-3">
            <div 
              className="p-3 rounded-2xl border flex items-center gap-3 transition-colors"
              style={{ 
                backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : activeThemeConfig.bgLightHex,
                borderColor: activeThemeConfig.borderLightHex 
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
                style={{ backgroundColor: activeThemeConfig.primaryHex }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs" style={{ color: activeThemeConfig.primaryHex }}>Conductor Responsable Ley 2251</h4>
                <p className="text-[11px] text-[#475569] dark:text-slate-300">Respeto de límites de 50 km/h en ciudad y 30 km/h en zonas escolares.</p>
              </div>
            </div>

            <div 
              className="p-3 rounded-2xl border flex items-center gap-3 transition-colors"
              style={{ 
                backgroundColor: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : activeThemeConfig.bgLightHex,
                borderColor: activeThemeConfig.borderLightHex 
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
                style={{ backgroundColor: activeThemeConfig.primaryHoverHex }}
              >
                <FileBadge size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs" style={{ color: activeThemeConfig.primaryHoverHex }}>Experto en Señalética Nacional</h4>
                <p className="text-[11px] text-[#475569] dark:text-slate-300">Aprobación del catálogo de señales reglamentarias y preventivas.</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <Car size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-rose-700 dark:text-rose-300">Protector de Peatones & Ciclistas</h4>
                <p className="text-[11px] text-[#475569] dark:text-slate-300">Distancia reglamentaria de 1.5 metros y prioridad en cruces peatonales.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Management & Security Zone (Danger Zone) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <h3 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
          <Shield size={18} className="text-slate-500" />
          <span>Gestión de Cuenta y Seguridad</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Administra tu sesión activa o retira de forma permanente tus datos de la plataforma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cerrar Sesión Activa</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Finaliza la sesión actual en este navegador de manera segura.</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
          <div>
            <h4 className="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>Zona de Peligro: Eliminar Cuenta Permanentemente</span>
            </h4>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
              Borra de forma irreversible tu cuenta y todos tus datos de las tablas profiles, progreso y quiz_results.
            </p>
          </div>
          <button
            type="button"
            id="profile-delete-account-btn"
            onClick={() => {
              if (onDeleteAccountRequested) {
                onDeleteAccountRequested();
              }
            }}
            className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            <Trash2 size={14} />
            <span>Eliminar cuenta permanentemente</span>
          </button>
        </div>
      </div>

    </div>
  );
};
