import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer 
      id="institutional-footer" 
      className="w-full bg-white dark:bg-[#0f172a] border-t border-[#e2e8f0] dark:border-slate-800 py-6 sm:py-8 px-4 sm:px-6 mt-auto transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Legal Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <ViaNovaLogo size="sm" showText={false} />
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-[#0052cc] dark:text-sky-400 text-lg">ViaNova</span>
              <span className="text-slate-400 dark:text-slate-600 font-bold">•</span>
              <span className="text-base text-slate-800 dark:text-slate-200 font-bold">
                {t('portalTagline', 'Sistema Integral de Movilidad y Educación Vial')}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('footer_legend', 'Normativa alineada con el Código Nacional de Tránsito (Ley 769 de 2002) y Ley Julián Esteban (Ley 2251 de 2022).')}
            </p>
          </div>
        </div>

        {/* Institutional Verification Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{t('footer_colombia_active', 'Servicio Oficial Colombia 🇨🇴')}</span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
        {t('footer_bottom', '© 2026 ViaNova. Plataforma educativa y de reporte comunitario para la seguridad vial en Colombia.')}
      </div>
    </footer>
  );
};
