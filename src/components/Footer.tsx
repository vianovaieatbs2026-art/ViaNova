import React from 'react';
import { Mail, Phone, Clock, Shield, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';

export const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer 
      id="institutional-footer" 
      className="w-full bg-white dark:bg-[#0b1320] border-t border-[#e2e8f0] dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors mt-auto text-xs"
    >
      {/* Main Multi-column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <ViaNovaLogo size="sm" showText={false} />
              <div>
                <span className="font-black text-base text-[#0052cc] dark:text-sky-400">ViaNova</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Movilidad y Educación Vial
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Plataforma pedagógica e interactiva para la formación de conductores, prevención de siniestros viales y promoción de una cultura de respeto en las vías colombianas.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <Shield size={14} className="text-[#0052cc] dark:text-sky-400 shrink-0" />
              <span>Conforme a la Ley 769 de 2002 y Ley 2251 de 2022</span>
            </div>
          </div>

          {/* Column 2: Secciones Educativas */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0052cc] dark:text-sky-400" />
              <span>Ruta de Aprendizaje</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <a href="#inicio" className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors">
                  1. Inicio e Introducción
                </a>
              </li>
              <li>
                <a href="#aprende" className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors">
                  2. Aprende sobre Movilidad
                </a>
              </li>
              <li>
                <a href="#simulador" className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors">
                  3. Práctica y Simuladores
                </a>
              </li>
              <li>
                <a href="#quiz" className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors">
                  4. Quizzes y Evaluaciones
                </a>
              </li>
              <li>
                <a href="#reportes" className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 transition-colors">
                  5. Reportes y Comunidad
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Soporte y Contacto (Convencional estándar) */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#0052cc] dark:text-sky-400" />
              <span>Soporte y Contacto</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-[#0052cc] dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Correo Electrónico:</span>
                  <p className="text-slate-500 dark:text-slate-400">contacto@vianova.edu.co</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="text-[#0052cc] dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Horario de Atención:</span>
                  <p className="text-slate-500 dark:text-slate-400">Lunes a Viernes, 8:00 a.m. - 5:00 p.m.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#0052cc] dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Línea de Orientación Vial:</span>
                  <p className="text-slate-500 dark:text-slate-400">Colombia • (601) 018000-VIANOVA</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Normativa y Privacidad */}
          <div className="space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield size={14} className="text-[#0052cc] dark:text-sky-400" />
              <span>Políticas y Normativa</span>
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 cursor-pointer">
                  Términos de Uso del Servicio
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 cursor-pointer">
                  Política de Privacidad y Datos
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 cursor-pointer">
                  Manual de Señalización Vial (INVIAS)
                </span>
              </li>
              <li>
                <span className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-sky-400 cursor-pointer">
                  Ley Julián Esteban (Seguridad Peatonal)
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright Standard */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070d16] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <p>© 2026 ViaNova. Todos los derechos reservados.</p>
          <p>Plataforma para el fomento de la seguridad vial y la movilidad responsable.</p>
        </div>
      </div>
    </footer>
  );
};
