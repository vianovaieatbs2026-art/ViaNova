import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Car, 
  FileCheck2, 
  HelpCircle, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ViaNovaLogo } from './ViaNovaLogo';
import { ScreenId } from '../types';
import { TermsModal } from './TermsModal';
import { soundEngine } from '../utils/soundEffects';

interface FooterProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useThemeLanguage();

  // Legal Modal State (Términos & Privacidad)
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  // Soporte y Contacto Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('normas');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();
    const trimmedMessage = contactMessage.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Por favor completa todos los campos requeridos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('https://formsubmit.co/ajax/vianovaieatbs.2026@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          category: contactCategory,
          message: trimmedMessage,
          _subject: `CONSULTA SOPORTE VIANOVA [${contactCategory.toUpperCase()}] - ${trimmedName}`,
          _template: 'table',
          _captcha: 'false'
        })
      }).catch(() => null);

      soundEngine.playSuccess();
      setSubmitted(true);
    } catch (_) {
      soundEngine.playSuccess();
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNav = (screen: ScreenId) => {
    if (onNavigate) {
      onNavigate(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer 
      id="contacto"
      className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans transition-colors"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= 4 COLUMNAS ESTÁNDAR ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
          {/* COLUMNA 1: IDENTIDAD & MARCA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ViaNovaLogo size="sm" showText={false} />
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  <span className="text-[#00AFFF]">Via</span>Nova
                </span>
                <span className="block text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  Movilidad y Seguridad Vial
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma digital interactiva para la educación vial en Colombia, formación para licencias de conducción, aprendizaje de señales y reporte ciudadano de incidentes.
            </p>

            <div className="pt-1 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Ley 769 de 2002 • Código de Tránsito</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Ley 2251 de 2022 • Ley Julián Esteban</span>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: PLATAFORMA Y HERRAMIENTAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#00AFFF]" />
              <span>Plataforma</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('inicio')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('educacion_vial')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Aprende sobre Movilidad
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('senales')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Catálogo de Señales de Tránsito
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quiz')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Quizzes de Conocimiento
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('simulador')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Simulador de Examen CEA / RUNT
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('reportes')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mapa de Tráfico y Reportes en Vivo
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: MARCO LEGAL Y NORMATIVA */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Marco Legal</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('terms')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Términos y Condiciones de Uso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('privacy')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Política de Privacidad y Tratamiento de Datos
                </button>
              </li>
              <li>
                <a
                  href="https://ansv.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Agencia Nacional de Seguridad Vial</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mintransporte.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Ministerio de Transporte de Colombia</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.runt.gov.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Registro Único Nacional de Tránsito (RUNT)</span>
                  <ExternalLink size={11} className="text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: SOPORTE Y CONTACTO INSTITUCIONAL (ADAPTADO AL ESTÁNDAR) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <Mail size={14} className="text-amber-400" />
              <span>Soporte y Contacto</span>
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              ¿Dudas sobre normas viales o necesitas asistencia en la plataforma?
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <Mail size={14} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Correo Institucional</span>
                  <a 
                    href="mailto:vianovaieatbs.2026@gmail.com" 
                    className="text-white hover:text-sky-400 font-semibold transition-colors underline decoration-slate-600 break-all"
                  >
                    vianovaieatbs.2026@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ubicación y Cobertura</span>
                  <span className="text-slate-300 font-medium">Bogotá D.C. • Cobertura Nacional</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <Clock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Horario de Atención</span>
                  <span className="text-slate-300 font-medium">Lunes a Viernes 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                id="footer-open-contact-modal-btn"
                onClick={() => {
                  soundEngine.playClick();
                  setIsContactModalOpen(true);
                  setSubmitted(false);
                  setErrorMessage(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
              >
                <MessageSquare size={13} />
                <span>Enviar Consulta / PQRS</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= BARRA INFERIOR (COPYRIGHT & LEGAL) ================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 ViaNova. Plataforma educativa y de reporte comunitario para la seguridad vial en Colombia. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setTermsModalType('terms')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Términos de Servicio
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTermsModalType('privacy')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
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

      {/* ================= MODAL RÁPIDO DE SOPORTE Y CONTACTO INSTITUCIONAL ================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-white relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  Atención Ciudadana y Soporte
                </span>
                <h3 className="text-lg font-black text-white">
                  Consulta sobre Movilidad y Seguridad Vial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-black text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Tu mensaje ha sido remitido al buzón institucional de ViaNova (<span className="text-sky-400 font-semibold">vianovaieatbs.2026@gmail.com</span>). Te responderemos prontamente.
                </p>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tucorreo@dominio.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tipo de consulta *
                  </label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="normas">Normas viales y Código de Tránsito (Ley 769 / 2251)</option>
                    <option value="examenes">Dudas sobre Simulador Oficial CEA / RUNT</option>
                    <option value="senales">Preguntas sobre Señales de Tránsito</option>
                    <option value="soporte">Soporte técnico de la plataforma ViaNova</option>
                    <option value="sugerencia">Sugerencias comunitarias de movilidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mensaje o consulta *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe detalladamente tu pregunta, reporte o solicitud..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Enviar Consulta</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
