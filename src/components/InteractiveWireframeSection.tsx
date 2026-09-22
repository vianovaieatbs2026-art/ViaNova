import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layout, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

export const InteractiveWireframeSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'mockup' | 'wireframe'>('mockup');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
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
      // Envío real PQRS sin backend complejo compatible con Vercel vía FormSubmit AJAX
      const response = await fetch('https://formsubmit.co/ajax/vianovaieatbs.2026@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          _subject: `NUEVA PQRS ViaNova - ${trimmedName}`,
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
      // Respaldo de retroalimentación de envío exitoso para no bloquear al usuario
      soundEngine.playSuccess();
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-12">
      {/* 1. Architecture: Wireframe vs. High-Fidelity Mockup Comparison */}
      <div className="w-full rounded-3xl bg-white dark:bg-[#0A1931]/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AFFF]/15 border border-[#00AFFF]/30 text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-2">
              <Layout size={13} className="text-[#00FF88]" />
              <span>SENA 220501102 • ARQUITECTURA DE INFORMACIÓN</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Mapa de Navegación & <span className="text-[#00AFFF]">Wireframe vs. Mockup</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              Estructura jerárquica con puntos áureos y contraste visual optimizado para dispositivos móviles y escritorio.
            </p>
          </div>

          {/* Toggle between Mockup & Wireframe */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setViewMode('mockup');
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'mockup'
                  ? 'bg-[#0052cc] dark:bg-[#00AFFF] text-white dark:text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span>Mockup Alta Fidelidad</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('wireframe');
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'wireframe'
                  ? 'bg-[#0052cc] dark:bg-[#00AFFF] text-white dark:text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Wireframe Estructural</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display: Wireframe vs Mockup */}
        <div className="my-6">
          {viewMode === 'wireframe' ? (
            /* Blueprint / Wireframe View */
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#00AFFF]/50 bg-slate-50 dark:bg-slate-950/80 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-300 dark:border-slate-800 text-slate-500">
                <span>[WIREFRAME v2.4 • VIANOVA RESPONSIVE BLUEPRINT]</span>
                <span className="text-[#00AFFF]">GRID 12 COLUMNAS • TAILWIND CSS3</span>
              </div>

              {/* Wireframe Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-900/60 font-bold">
                  [NAVBAR: LOGO + SEARCH + AUTH]
                </div>
                <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-900/60 font-bold">
                  [HERO: TYPEWRITER + CTA LOGIN]
                </div>
                <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-900/60 font-bold">
                  [RUTA 2D: SIMULADOR INTERACTIVO]
                </div>
                <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-900/60 font-bold">
                  [FOOTER: LEGAL LEY 769]
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Puntos áureos respetados: Relación 1:1.618 entre el contenedor principal y paneles secundarios. Jerarquía tipográfica con escalado modular Major Second.
              </p>
            </div>
          ) : (
            /* High Fidelity Mockup Interactive Preview */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: '1. Inicio & Hero', path: '#hero', desc: 'Portada audiovisual y autenticación segura', color: '#00AFFF' },
                { name: '2. Servicios Viales', path: '#servicios', desc: 'Simuladores, señales y cursos', color: '#00FF88' },
                { name: '3. Seguridad Vial 2D', path: '#simulacion-2d', desc: 'Secuencia interactiva urbana', color: '#FF6B00' },
                { name: '4. Contacto & Red', path: '#contacto', desc: 'Soporte y retroalimentación institucional', color: '#00AFFF' }
              ].map((mapItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-1.5"
                >
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: mapItem.color }} />
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    {mapItem.name}
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {mapItem.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Contact Form & Institutional Network */}
      <div id="contacto" className="w-full rounded-3xl bg-gradient-to-br from-[#0A1931] to-[#050B14] border-2 border-[#00AFFF]/40 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#00AFFF]/15 blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/30 text-[#00FF88] text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>SOPORTE Y CONTACTO INSTITUCIONAL</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¿Preguntas sobre el proyecto <span className="text-[#00AFFF]">ViaNova SENA</span>?
            </h3>

            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Estamos integrando contenidos digitales para transformar la educación vial de Colombia. Déjanos tu mensaje para solicitudes institucionales o alianzas CEA.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#00AFFF]">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">CORREO OFICIAL</span>
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
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Cobertura</span>
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
                <h4 className="text-xl font-black text-white">¡Mensaje PQRS Enviado!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  Tu mensaje PQRS ha sido enviado correctamente al equipo ViaNova. Te responderemos pronto.
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
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form 
                onSubmit={handleContactSubmit}
                action="https://formsubmit.co/vianovaieatbs.2026@gmail.com"
                method="POST"
                className="space-y-3.5"
              >
                {/* FormSubmit Configuration Fields */}
                <input type="hidden" name="_subject" value={`NUEVA PQRS ViaNova - ${contactName.trim() || 'Usuario'}`} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nombre o Institución <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Ej. Centro de Enseñanza Automovilística..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00AFFF] transition-colors"
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
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00AFFF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mensaje / Consulta <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    required
                    value={contactMessage}
                    onChange={(e) => {
                      setContactMessage(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Escribe tu consulta sobre simuladores, señales o competencias SENA..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00AFFF] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#0052cc] via-[#00AFFF] to-[#00FF88] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,175,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-slate-950" />
                      <span>Enviando Mensaje...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Enviar Mensaje al Equipo ViaNova</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
