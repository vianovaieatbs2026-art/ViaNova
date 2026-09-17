import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppLanguage, 
  ThemeMode, 
  ThemeColor, 
  ThemeColorOption, 
  THEME_COLOR_OPTIONS, 
  TRANSLATIONS 
} from '../i18n/translations';

interface ThemeLanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  activeThemeConfig: ThemeColorOption;
  t: (key: string, fallback?: string) => string;
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'vianova_pref_language';
const STORAGE_MODE_KEY = 'vianova_pref_theme_mode';
const STORAGE_COLOR_KEY = 'vianova_pref_theme_color';

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with local storage fallback
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as AppLanguage;
      if (saved && ['es', 'en', 'pt', 'fr'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'es';
  });

  // 2. Theme Mode state (light / dark) - Defaults to dark pro
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY) as ThemeMode;
      if (saved && ['light', 'dark'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'dark';
  });

  // 3. Theme Accent Color state (blue, emerald, purple, amber, crimson, cyan, indigo, rose)
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLOR_KEY) as ThemeColor;
      if (saved && THEME_COLOR_OPTIONS.some(c => c.id === saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'blue';
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const activeThemeConfig = THEME_COLOR_OPTIONS.find(c => c.id === themeColor) || THEME_COLOR_OPTIONS[0];

  // Update Language
  const setLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
    } catch (e) {
      // ignore
    }
  };

  // Toggle directly between Spanish (es) and English (en) with 1 click
  const toggleLanguage = () => {
    const nextLang: AppLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
  };

  // Update Theme Mode
  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch (e) {
      // ignore
    }
  };

  const toggleThemeMode = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  // Update Theme Color
  const setThemeColor = (newColor: ThemeColor) => {
    setThemeColorState(newColor);
    try {
      localStorage.setItem(STORAGE_COLOR_KEY, newColor);
    } catch (e) {
      // ignore
    }
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.es;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.es;
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  // Update data-i18n elements in DOM dynamically
  const updateDomTranslations = (lang: AppLanguage) => {
    try {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.es;
      const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
      elements.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const text = dict[key] || TRANSLATIONS.es[key] || key;
        
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.placeholder = text;
        } else {
          // If the element has a dedicated text target child, update that
          const targetChild = el.querySelector<HTMLElement>('[data-i18n-text]');
          if (targetChild) {
            targetChild.textContent = text;
          } else if (el.children.length === 0) {
            el.textContent = text;
          } else {
            // If it has children (like icons + text), find the span containing text
            const spans = Array.from(el.querySelectorAll('span'));
            if (spans.length > 0) {
              const textSpan = spans.find(s => !s.querySelector('svg') && s.children.length === 0);
              if (textSpan) {
                textSpan.textContent = text;
              }
            }
          }
        }
      });
    } catch (_) {}
  };

  // Sync with document element, window, and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    
    // Expose global helper requested by user:
    // const translations = { es: {...}, en: {...} } y una función setLanguage('es'|'en')
    if (typeof window !== 'undefined') {
      (window as any).translations = TRANSLATIONS;
      (window as any).setLanguage = (l: AppLanguage) => setLanguage(l);
    }

    // Run DOM translation immediately
    updateDomTranslations(language);

    // 1. Dark mode class & attribute
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // 2. CSS variables for dynamic theme accent colors
    root.style.setProperty('--color-primary', activeThemeConfig.primaryHex);
    root.style.setProperty('--color-primary-hover', activeThemeConfig.primaryHoverHex);
    root.style.setProperty('--color-accent', activeThemeConfig.accentHex);
    root.style.setProperty('--color-primary-light', activeThemeConfig.bgLightHex);
    root.style.setProperty('--color-primary-border', activeThemeConfig.borderLightHex);
    root.setAttribute('data-color', themeColor);
  }, [themeMode, themeColor, activeThemeConfig, language]);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <ThemeLanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        themeColor,
        setThemeColor,
        activeThemeConfig,
        t,
        isSettingsModalOpen,
        openSettingsModal,
        closeSettingsModal
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = (): ThemeLanguageContextType => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
