import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  User, 
  ShieldCheck, 
  Trash2,
  UserPlus,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { ScreenId, UserProfile } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { HeaderSearchBar } from './HeaderSearchBar';
import { soundEngine } from '../utils/soundEffects';

interface NavigationProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenDeleteAccountModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  user,
  onLogout,
  onOpenDeleteAccountModal,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(soundEngine.isMuted());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    themeMode, 
    toggleThemeMode, 
    language, 
    toggleLanguage,
    t 
  } = useThemeLanguage();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dashboard navigation items requested by user:
  // Inicio, Quiz, Señales, Simulador, Google Maps, Mi Perfil
  const navItems: { id: ScreenId; labelKey: string; defaultLabel: string }[] = [
    { id: 'inicio', labelKey: 'nav_home', defaultLabel: 'Inicio' },
    { id: 'quiz', labelKey: 'nav_quiz', defaultLabel: 'Quiz' },
    { id: 'senales', labelKey: 'nav_signs', defaultLabel: 'Señales' },
    { id: 'simulador', labelKey: 'nav_simulator', defaultLabel: 'Simulador' },
    { id: 'reportes', labelKey: 'nav_google_maps', defaultLabel: 'Google Maps' },
    { id: 'perfil', labelKey: 'nav_profile', defaultLabel: 'Mi Perfil' },
  ];

  const handleNavClick = (screen: ScreenId) => {
    onNavigate(screen);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-slate-800 sticky top-0 z-50 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main top bar container */}
        <div className="h-20 flex items-center justify-between gap-3 lg:gap-5">
          
          {/* Brand Logo & Tagline (Left) */}
          <div 
            onClick={() => handleNavClick(user ? 'inicio' : 'landing')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0 group"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-xs bg-white border border-slate-100">
              <img 
                src="/logo.png" 
                alt="Vianova" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/vianova-logo.svg';
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-black text-[#0a192f] dark:text-white tracking-tight leading-none text-xl sm:text-2xl">
                <span className="text-[#0052cc] dark:text-sky-400">Via</span>Nova
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#64748b] dark:text-slate-400 font-extrabold tracking-wider uppercase mt-1 hidden xs:block">
                {t('brand_tagline', 'MOVILIDAD INTELIGENTE')}
              </span>
            </div>
          </div>

          {/* Autocomplete Search Bar (Center / Desktop) */}
          {user && (
            <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm">
              <HeaderSearchBar onNavigate={handleNavClick} />
            </div>
          )}

          {/* Center Nav Items */}
          {user ? (
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 overflow-x-auto no-scrollbar py-2">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1.5 px-1 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#0052cc] dark:text-sky-400'
                        : 'text-[#475569] dark:text-slate-300 hover:text-[#0052cc] dark:hover:text-white'
                    }`}
                  >
                    <span>{t(item.labelKey, item.defaultLabel)}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#0052cc] dark:bg-sky-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            /* Unauthenticated Visitor Section Links */
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 py-2">
              {[
                { id: 'hero', label: 'Inicio' },
                { id: 'servicios', label: 'Servicios' },
                { id: 'simulacion-2d', label: 'Seguridad Vial 2D' },
                { id: 'storyboard', label: 'Storyboard SENA' },
                { id: 'contacto', label: 'Contacto' },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    if (currentScreen !== 'landing') {
                      onNavigate('landing');
                      setTimeout(() => {
                        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#0052cc] dark:hover:text-[#00AFFF] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Audio Synthesizer Sound Toggle */}
            <button
              type="button"
              id="header-sound-toggle-btn"
              onClick={() => {
                const muted = soundEngine.toggleMute();
                setIsAudioMuted(muted);
                if (!muted) soundEngine.playSuccess();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
              title={isAudioMuted ? 'Activar efectos de audio sutiles' : 'Silenciar audio'}
              aria-label="Efectos de audio"
            >
              {isAudioMuted ? (
                <VolumeX size={16} className="text-slate-400 shrink-0" />
              ) : (
                <Volume2 size={16} className="text-[#00FF88] shrink-0" />
              )}
              <span className="hidden xl:inline font-bold">
                {isAudioMuted ? 'Mute' : 'Audio'}
              </span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              id="header-theme-toggle-btn"
              onClick={toggleThemeMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
              title={themeMode === 'dark' ? t('theme_light', 'Modo Claro') : t('theme_dark', 'Modo Oscuro')}
              aria-label={t('nav_theme_switch', 'Cambiar tema')}
            >
              {themeMode === 'dark' ? (
                <Sun size={16} className="text-amber-400 shrink-0" />
              ) : (
                <Moon size={16} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
              )}
              <span className="hidden xl:inline font-bold">
                {themeMode === 'dark' ? t('theme_light', 'Claro') : t('theme_dark', 'Oscuro')}
              </span>
            </button>

            {/* Language Selector Toggle */}
            <button
              type="button"
              id="header-lang-toggle-btn"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
              title="Cambiar idioma / Switch language"
              aria-label="Idioma / Language"
            >
              <Globe size={16} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
              <span className="font-bold">{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Authenticated User Controls */}
            {user ? (
              <>
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    id="header-profile-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="max-w-[90px] sm:max-w-[130px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div 
                      id="user-profile-menu-dropdown"
                      className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 px-1.5 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* User info summary */}
                      <div className="px-3 py-2.5">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {t('nav_user_connected', 'Usuario Conectado')}
                        </p>
                        <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0052cc] dark:text-sky-400 text-xs font-bold border border-blue-200 dark:border-blue-900/50">
                          <ShieldCheck size={13} />
                          <span className="capitalize">{user.licenseCategory || 'Aspirante Licencia'}</span>
                        </div>
                      </div>

                      {/* Quick screen links in dropdown */}
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => handleNavClick('perfil')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <User size={15} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
                          <span>{t('nav_view_full_profile', 'Mi Perfil & Credencial')}</span>
                        </button>
                      </div>

                      {/* Actions: Logout & Delete */}
                      <div className="py-1 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut size={15} className="text-slate-500 shrink-0" />
                          <span>{t('nav_logout', 'Cerrar Sesión')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            if (onOpenDeleteAccountModal) {
                              onOpenDeleteAccountModal();
                            } else {
                              handleNavClick('perfil');
                            }
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} className="text-rose-600 dark:text-rose-400 shrink-0" />
                          <span>{t('nav_delete_account', 'Eliminar Cuenta')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger toggle */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-700 dark:text-slate-200 lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Abrir menú"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </>
            ) : (
              /* Unauthenticated Visitor Actions */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  id="nav-login-btn"
                  onClick={() => handleNavClick('login')}
                  className="text-slate-700 dark:text-slate-200 hover:text-[#0052cc] dark:hover:text-sky-400 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  {t('nav_login', 'Iniciar Sesión')}
                </button>
                <button
                  type="button"
                  id="nav-register-btn"
                  onClick={() => handleNavClick('registro')}
                  className="bg-[#0052cc] hover:bg-[#0047b3] active:scale-98 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus size={15} />
                  <span>{t('landing_cta_register', 'Crear Cuenta')}</span>
                </button>

                {/* Mobile Hamburger for Visitors */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-700 dark:text-slate-200 lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Abrir menú"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Search Bar & Menu Drawer */}
        {user ? (
          <>
            {/* Mobile Search Bar row */}
            <div className="block md:hidden pb-3">
              <HeaderSearchBar onNavigate={handleNavClick} />
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 border border-blue-200 dark:border-blue-900/40'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t(item.labelKey, item.defaultLabel)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Mobile Drawer for Visitors */
          mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hero', label: 'Inicio' },
                  { id: 'servicios', label: 'Servicios' },
                  { id: 'simulacion-2d', label: 'Seguridad Vial 2D' },
                  { id: 'storyboard', label: 'Storyboard SENA' },
                  { id: 'multimedia', label: 'Cápsulas Video' },
                  { id: 'contacto', label: 'Contacto' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      soundEngine.playClick();
                      if (currentScreen !== 'landing') {
                        onNavigate('landing');
                        setTimeout(() => {
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="p-2.5 rounded-xl text-xs font-bold text-left bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </header>
  );
};
