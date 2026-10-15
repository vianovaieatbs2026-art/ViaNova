import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  AppLanguage, 
  ThemeMode, 
  ThemeColor, 
  ThemeColorOption, 
  THEME_COLOR_OPTIONS, 
  TRANSLATIONS 
} from '../i18n/translations';
import { translateTextToEnglish, translateTextToSpanish } from '../i18n/autoTranslateMap';

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

/**
 * Global Bidirectional DOM Translation Engine
 * Guarantees 100% full-page translation:
 * - If language is 'en': translates every single Spanish text to English.
 * - If language is 'es': translates every single English text back to Spanish.
 */
let isTranslating = false;

function translateEntireDom(lang: AppLanguage) {
  if (typeof document === 'undefined' || !document.body) return;
  if (isTranslating) return;
  isTranslating = true;

  try {
    const isEn = lang === 'en';

    // 1. Text Nodes Walker
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (
            tag === 'script' ||
            tag === 'style' ||
            tag === 'noscript' ||
            tag === 'svg' ||
            tag === 'path' ||
            tag === 'code' ||
            tag === 'pre'
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('[data-no-translate]')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let current = walker.nextNode();
    while (current) {
      const currentVal = current.nodeValue || '';
      if (isEn) {
        const translated = translateTextToEnglish(currentVal);
        if (translated && translated !== currentVal) {
          current.nodeValue = translated;
        }
      } else {
        const translated = translateTextToSpanish(currentVal);
        if (translated && translated !== currentVal) {
          current.nodeValue = translated;
        }
      }
      current = walker.nextNode();
    }

    // 2. Attributes: placeholder, title, aria-label
    const inputsAndTextareas = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[placeholder], textarea[placeholder]'
    );
    inputsAndTextareas.forEach((el) => {
      if (el.placeholder) {
        const translated = isEn 
          ? translateTextToEnglish(el.placeholder) 
          : translateTextToSpanish(el.placeholder);
        if (translated && translated !== el.placeholder) {
          el.placeholder = translated;
        }
      }
    });

    const titledElements = document.querySelectorAll<HTMLElement>('[title]');
    titledElements.forEach((el) => {
      if (el.title) {
        const translated = isEn 
          ? translateTextToEnglish(el.title) 
          : translateTextToSpanish(el.title);
        if (translated && translated !== el.title) {
          el.title = translated;
        }
      }
    });

    const ariaElements = document.querySelectorAll<HTMLElement>('[aria-label]');
    ariaElements.forEach((el) => {
      const currentAria = el.getAttribute('aria-label');
      if (currentAria) {
        const translated = isEn 
          ? translateTextToEnglish(currentAria) 
          : translateTextToSpanish(currentAria);
        if (translated && translated !== currentAria) {
          el.setAttribute('aria-label', translated);
        }
      }
    });
  } catch (err) {
    // Non-blocking catch
  } finally {
    isTranslating = false;
  }
}

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with local storage fallback (Spanish / English only)
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as AppLanguage;
      if (saved && (saved === 'es' || saved === 'en')) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'es';
  });

  // 2. Theme Mode state (light / dark)
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

  // 3. Theme Accent Color state
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
  const observerRef = useRef<MutationObserver | null>(null);

  const activeThemeConfig = THEME_COLOR_OPTIONS.find(c => c.id === themeColor) || THEME_COLOR_OPTIONS[0];

  // Update Language
  const setLanguage = (newLang: AppLanguage) => {
    const validLang: AppLanguage = newLang === 'en' ? 'en' : 'es';
    setLanguageState(validLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, validLang);
    } catch (e) {
      // ignore
    }
  };

  // Toggle directly between Spanish (es) and English (en) with 1 click
  const toggleLanguage = () => {
    const nextLang: AppLanguage = language === 'en' ? 'es' : 'en';
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

  // Enhanced Universal Bidirectional Translation Function
  const t = (key: string, fallback?: string): string => {
    if (language === 'en') {
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      const esDict = TRANSLATIONS.es;
      if (esDict && esDict[key]) {
        return translateTextToEnglish(esDict[key]);
      }
      if (fallback) {
        return translateTextToEnglish(fallback);
      }
      return translateTextToEnglish(key);
    }

    // Spanish mode
    const esDict = TRANSLATIONS.es;
    if (esDict && esDict[key]) {
      return esDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return translateTextToSpanish(enDict[key]);
    }
    if (fallback) {
      return translateTextToSpanish(fallback);
    }
    return translateTextToSpanish(key);
  };

  // Real-time DOM Translation & Universal Mutation Observer
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;

    // Expose global window helpers
    if (typeof window !== 'undefined') {
      (window as any).translations = TRANSLATIONS;
      (window as any).setLanguage = (l: AppLanguage) => setLanguage(l);
      (window as any).toggleLanguage = toggleLanguage;
      (window as any).translateTextToEnglish = translateTextToEnglish;
      (window as any).translateTextToSpanish = translateTextToSpanish;
      (window as any).currentLanguage = language;
    }

    // Run DOM translation immediately
    translateEntireDom(language);

    // Keep active DOM observer for newly rendered elements in either language
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    let timeoutId: any = null;
    observerRef.current = new MutationObserver(() => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        translateEntireDom(language);
      }, 30);
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [language]);

  // Sync dark mode & theme accent colors
  useEffect(() => {
    const root = document.documentElement;

    // Dark mode class & attribute
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // CSS variables for dynamic theme accent colors
    root.style.setProperty('--color-primary', activeThemeConfig.primaryHex);
    root.style.setProperty('--color-primary-hover', activeThemeConfig.primaryHoverHex);
    root.style.setProperty('--color-accent', activeThemeConfig.accentHex);
    root.style.setProperty('--color-primary-light', activeThemeConfig.bgLightHex);
    root.style.setProperty('--color-primary-border', activeThemeConfig.borderLightHex);
    root.setAttribute('data-color', themeColor);
  }, [themeMode, themeColor, activeThemeConfig]);

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
