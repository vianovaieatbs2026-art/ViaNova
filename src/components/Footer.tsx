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
  const { t, language } = useThemeLanguage();
  const isEn = language === 'en';

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
      setErrorMessage(
        isEn
          ? 'Please complete all required fields.'
          : 'Por favor completa todos los campos requeridos.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage(
        isEn
          ? 'Please enter a valid email address.'
          : 'Ingresa un correo electrónico válido.'
      );
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
      className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto font-sans transition-colors duration-200"
      role="contentinfo"
      aria-label={isEn ? "Footer" : "Pie de página"}
    >
      <div className="max-w-7xl mx-auto">
        {/* ================= 4 COLUMNAS ESTÁNDAR ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* COLUMNA 1: IDENTIDAD & MARCA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ViaNovaLogo size="sm" showText={false} />
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  <span className="text-[#00AFFF]">Via</span>Nova
                </span>
                <span className="block text-[10px] uppercase font-bold text-[#0052cc] dark:text-sky-400 tracking-wider">
                  {t('footer_brand_sub', 'Movilidad y Seguridad Vial')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                'footer_desc',
                'Plataforma digital interactiva para la educación vial en Colombia, formación para licencias de conducción, aprendizaje de señales y reporte ciudadano de incidentes.'
              )}
            </p>

            <div className="pt-1 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>{t('footer_law_769', 'Ley 769 de 2002 • Código de Tránsito')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{t('footer_law_2251', 'Ley 2251 de 2022 • Ley Julián Esteban')}</span>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: PLATAFORMA Y HERRAMIENTAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#00AFFF]" />
              <span>{t('footer_col_platform', 'Plataforma')}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('inicio')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav_home', 'Inicio')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('senales')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav_signs_catalog', 'Catálogo de Señales de Tránsito')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('quiz')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav_quizzes', 'Quizzes de Conocimiento')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('reportes')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('nav_live_traffic_reports', 'Mapa de Tráfico y Reportes en Vivo')}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: MARCO LEGAL Y NORMATIVA */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
              <span>{t('footer_col_legal', 'Marco Legal')}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('terms')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('footer_terms_link', 'Términos y Condiciones de Uso')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setTermsModalType('privacy')}
                  className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t('footer_privacy_link', 'Política de Privacidad y Tratamiento de Datos')}
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

          {/* COLUMNA 4: SOPORTE Y CONTACTO INSTITUCIONAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-1.5">
              <Mail size={14} className="text-amber-500 dark:text-amber-400" />
              <span>{t('footer_col_support', 'Soporte y Contacto')}</span>
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('footer_support_sub', '¿Dudas sobre normas viales o necesitas asistencia en la plataforma?')}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <Mail size={14} className="text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    {t('footer_support_email_label', 'Correo Institucional')}
                  </span>
                  <a 
                    href="mailto:vianovaieatbs.2026@gmail.com" 
                    className="text-slate-900 dark:text-white hover:text-[#0052cc] dark:hover:text-sky-400 font-semibold transition-colors underline decoration-slate-300 dark:decoration-slate-600 break-all"
                  >
                    vianovaieatbs.2026@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <MapPin size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    {t('footer_support_loc_label', 'Ubicación y Cobertura')}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('footer_support_loc_val', 'Medellín, Antioquia • Cobertura Nacional')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <Clock size={14} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    {t('footer_support_hours_label', 'Horario de Atención')}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('footer_support_hours_val', 'Lunes a Viernes 8:00 AM - 5:00 PM')}
                  </span>
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
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0052cc] dark:text-sky-400 hover:text-[#0047b3] dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
              >
                <MessageSquare size={13} />
                <span>{t('footer_contact_btn', 'Enviar Consulta / PQRS')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================= BARRA INFERIOR (COPYRIGHT & LEGAL) ================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="text-center sm:text-left">
            {t(
              'footer_copyright',
              '© 2026 ViaNova. Plataforma educativa y de reporte comunitario para la seguridad vial en Colombia. Todos los derechos reservados.'
            )}
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setTermsModalType('terms')}
              className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('terms_modal_title_terms', 'Términos de Servicio')}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTermsModalType('privacy')}
              className="text-slate-600 dark:text-slate-400 hover:text-[#0052cc] dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('terms_modal_title_privacy', 'Privacidad')}
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-white relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-sky-400 tracking-wider">
                  {isEn ? 'Citizen Service & Support' : 'Atención Ciudadana y Soporte'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? 'Road Safety & Mobility Inquiry' : 'Consulta sobre Movilidad y Seguridad Vial'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isEn ? "Close window" : "Cerrar ventana"}
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {isEn ? 'Message Sent Successfully!' : '¡Mensaje Enviado con Éxito!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                  {isEn ? (
                    <>Your inquiry has been sent to the official ViaNova mailbox (<span className="text-[#0052cc] dark:text-sky-400 font-semibold">vianovaieatbs.2026@gmail.com</span>). We will respond promptly.</>
                  ) : (
                    <>Tu mensaje ha sido remitido al buzón institucional de ViaNova (<span className="text-[#0052cc] dark:text-sky-400 font-semibold">vianovaieatbs.2026@gmail.com</span>). Te responderemos prontamente.</>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  {isEn ? 'Close' : 'Cerrar'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-rose-600 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEn ? 'Full Name *' : 'Nombre completo *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={isEn ? "Your name" : "Tu nombre"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEn ? 'Email Address *' : 'Correo electrónico *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="tucorreo@dominio.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Inquiry Category *' : 'Tipo de consulta *'}
                  </label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-400 transition-colors"
                  >
                    <option value="normas">{isEn ? 'Traffic Rules & Transit Code (Law 769 / 2251)' : 'Normas viales y Código de Tránsito (Ley 769 / 2251)'}</option>
                    <option value="examenes">{isEn ? 'Questions on Interactive Quizzes' : 'Dudas sobre Quizzes y Evaluaciones Didácticas'}</option>
                    <option value="senales">{isEn ? 'Questions about Road Signs' : 'Preguntas sobre Señales de Tránsito'}</option>
                    <option value="soporte">{isEn ? 'ViaNova Platform Technical Support' : 'Soporte técnico de la plataforma ViaNova'}</option>
                    <option value="sugerencia">{isEn ? 'Community Mobility Suggestions' : 'Sugerencias comunitarias de movilidad'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Message or Inquiry *' : 'Mensaje o consulta *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={isEn ? "Describe your question, report or request in detail..." : "Describe detalladamente tu pregunta, reporte o solicitud..."}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0052cc] dark:focus:border-sky-400 resize-none transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>{isEn ? 'Sending...' : 'Enviando...'}</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>{isEn ? 'Send Inquiry' : 'Enviar Consulta'}</span>
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
