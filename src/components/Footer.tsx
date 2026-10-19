import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  ExternalLink
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';
import { ScreenId } from '../types';
import { TermsModal } from './TermsModal';

interface FooterProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useThemeLanguage();

  // Legal Modal State (Términos & Privacidad)
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  const handleNav = (screen: ScreenId) => {
    if (onNavigate) {
      onNavigate(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer 
      id="contacto"
      className="w-full bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans transition-colors duration-200"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= 3 COLUMNAS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* COLUMNA 1: IDENTIDAD & MARCA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ViaNovaLogo size="sm" showText={false} />
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  <span className="text-[#0052cc] dark:text-sky-400">Via</span>Nova
                </span>
                <span className="block text-[10px] uppercase font-bold text-[#0052cc] dark:text-sky-400 tracking-wider">
                  Movilidad y Seguridad Vial
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Plataforma digital interactiva para la educación vial en Colombia, formación para licencias de conducción, aprendizaje de señales y reporte ciudadano de incidentes.
            </p>

            <div className="pt-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400"></span>
                <span>Ley 769 de 2002 • Código de Tránsito</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                <span>Ley 2251 de 2022 • Ley Julián Esteban</span>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: PLATAFORMA Y HERRAMIENTAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0052cc] dark:text-sky-400" />
              <span>Plataforma</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('inicio')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('senales')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Catálogo de Señales de Tránsito
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quiz')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Quizzes de Conocimiento
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('reportes')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reportes de Movilidad
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: MARCO LEGAL Y NORMATIVA */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Marco Legal</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('terms')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Términos y Condiciones de Uso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('privacy')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  Política de Privacidad y Tratamiento de Datos
                </button>
              </li>
              <li>
                <a
                  href="https://ansv.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Agencia Nacional de Seguridad Vial</span>
                  <ExternalLink size={11} className="text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mintransporte.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Ministerio de Transporte de Colombia</span>
                  <ExternalLink size={11} className="text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.runt.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Registro Único Nacional de Tránsito (RUNT)</span>
                  <ExternalLink size={11} className="text-slate-400 dark:text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= BARRA INFERIOR (COPYRIGHT & LEGAL) ================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 ViaNova. Reportes de movilidad y seguridad vial en Colombia. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setTermsModalType('terms')}
              className="text-slate-500 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer"
            >
              Términos de Servicio
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTermsModalType('privacy')}
              className="text-slate-500 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer"
            >
              Privacidad
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE TÉRMINOS & PRIVACIDAD ================= */}
      <TermsModal
        isOpen={termsModalType !== null}
        type={termsModalType || 'terms'}
        onClose={() => setTermsModalType(null)}
      />
    </footer>
  );
};
