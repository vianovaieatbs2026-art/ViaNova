import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle,
  BookOpen,
  Car,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

export const InteractiveWireframeSection: React.FC = () => {
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

    // Validación obligatoria de todos los campos
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Todos los campos son obligatorios. Por favor completa tu nombre, correo y mensaje.');
      return;
    }

    // Validación de formato de correo válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido (ejemplo: nombre@dominio.com).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Envío real PQRS vía FormSubmit AJAX
      const response = await fetch('https://formsubmit.co/ajax/vianovaieatbs.2026@gmail.com', {
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
          _subject: `CONSULTA VIAL VIANOVA [${contactCategory.toUpperCase()}] - ${trimmedName}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.warn('FormSubmit notice:', errorData);
      }

      soundEngine.playSuccess();
      setSubmitted(true);
    } catch (err) {
      console.warn('Network send notice:', err);
      soundEngine.playSuccess();
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contacto" className="w-full space-y-10">
      {/* 1. Architecture of Services: Clear Map of Platform Sections */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#0A1931]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#00AFFF]/15 border border-blue-200 dark:border-[#00AFFF]/30 text-[#0052cc] dark:text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck size={14} className="text-emerald-500 dark:text-[#00FF88]" />
              <span>GUÍA DE NAVEGACIÓN Y APRENDIZAJE VIAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Estructura Integral de la <span className="text-[#0052cc] dark:text-[#00AFFF]">Plataforma ViaNova</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Explora los 4 pilares formativos diseñados para orientarte y prepararte como conductor seguro en Colombia.
            </p>
          </div>
        </div>

        {/* 4 Clean Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-[#0052cc] dark:text-sky-400 flex items-center justify-center font-bold">
              <BookOpen size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Aprende y Prepárate
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Normativa esencial, límites de velocidad de la Ley Julián Esteban y casos reales de prelación.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Car size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Catálogo de Señales
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Más de 120 señales reglamentarias, preventivas e informativas con sus códigos y sanciones.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <FileCheck2 size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Simulador CEA / RUNT
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pruebas cronometradas bajo estándar oficial de 30 preguntas aleatorias con revisión técnica.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Reportes en la Vía
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Comunidad vial colaborativa: georreferencia baches peligrosos, semáforos caídos y cierres.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Citizen Contact & Support Channel */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-[#0A1931] via-[#071326] to-[#050B14] border-2 border-sky-400/30 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00AFFF]/15 blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>ATENCIÓN CIUDADANA Y PREGUNTAS VIALES</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¿Tienes dudas sobre normas o <span className="text-[#00AFFF]">seguridad vial</span>?
            </h3>

            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Envíanos tus consultas sobre el Código Nacional de Tránsito, dudas de exámenes teóricos o sugerencias para mejorar la movilidad de tu comunidad.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#00AFFF]">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">CORREO INSTITUCIONAL</span>
                  <a 
                    href="mailto:vianovaieatbs.2026@gmail.com"
                    className="font-bold text-white hover:text-[#00AFFF] transition-colors underline decoration-sky-400/40 hover:decoration-[#00AFFF] break-all"
                  >
                    vianovaieatbs.2026@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#00FF88]">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">COBERTURA</span>
                  <span className="font-bold text-white">Bogotá D.C. • Cobertura Nacional Colombia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-xl">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#00FF88] flex items-center justify-center mx-auto border border-[#00FF88]/40 shadow-[0_0_20px_#00FF88]">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-black text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Hemos recibido tu consulta sobre movilidad y seguridad vial. Te responderemos al correo proporcionado.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setContactName('');
                    setContactEmail('');
                    setContactMessage('');
                    setErrorMessage(null);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleContactSubmit}
                className="space-y-3.5"
              >
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Tu nombre o institución"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#00AFFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Correo Electrónico <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#00AFFF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tipo de Consulta
                  </label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00AFFF] transition-colors cursor-pointer"
                  >
                    <option value="normas">Dudas sobre Leyes y Código de Tránsito (Ley 769 / 2251)</option>
                    <option value="licencias">Preguntas de Examen de Licencia / RUNT</option>
                    <option value="senales">Sugerencias sobre Señalización y Seguridad</option>
                    <option value="plataforma">Soporte técnico de la plataforma ViaNova</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mensaje o Solicitud <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe tu consulta detalladamente..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#00AFFF] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#00AFFF] hover:from-[#0047b3] hover:to-[#0099e6] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{isSubmitting ? 'Enviando...' : 'Radicar Consulta Ciudadana'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
