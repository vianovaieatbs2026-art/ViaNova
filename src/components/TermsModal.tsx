import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface TermsModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, type, onClose, onAccept }) => {
  const { t, language } = useThemeLanguage();
  const isEn = language === 'en';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        id="terms-modal-container" 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 relative transition-colors"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0052cc] dark:text-sky-400">
              {type === 'terms' ? <FileText size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {type === 'terms' ? t('terms_modal_title_terms', 'Términos de Servicio') : t('terms_modal_title_privacy', 'Política de Privacidad')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('terms_modal_sub', 'Plataforma de Movilidad Segura ViaNova')}
              </p>
            </div>
          </div>
          <button 
            id="terms-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? "Close" : "Cerrar"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {type === 'terms' ? (
            <>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {t('terms_s1_title', '1. Objeto del Servicio')}
                </h3>
                <p>
                  {t(
                    'terms_s1_desc',
                    'ViaNova es una plataforma integral para la capacitación vial, evaluación de conocimientos teóricos y reporte colaborativo de incidencias urbanas para promover la seguridad y eficiencia del tránsito.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {t('terms_s2_title', '2. Cuentas y Responsabilidad')}
                </h3>
                <p>
                  {t(
                    'terms_s2_desc',
                    'El usuario se compromete a ingresar información verídica al registrarse como Conductor, Aspirante, Estudiante o Ciudadano. La veracidad de los reportes viales es fundamental para el funcionamiento del sistema.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {t('terms_s3_title', '3. Certificaciones y Quizzes Didácticos')}
                </h3>
                <p>
                  {t(
                    'terms_s3_desc',
                    'Los quizzes y certificaciones emitidos en ViaNova reflejan el rendimiento formativo y normativo basado en los manuales de tránsito vigentes.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isEn ? '4. Road Coexistence Rules' : '4. Normas de Convivencia Vial'}
                </h3>
                <p>
                  {isEn
                    ? 'The use of the application encourages defensive driving, respect for pedestrians and cyclists, and the reduction of road accidents.'
                    : 'El uso de la aplicación incentiva la conducción preventiva, el respeto por peatones y ciclistas, y la reducción de la siniestralidad vial.'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isEn ? '1. Data Collection' : '1. Recolección de Datos'}
                </h3>
                <p>
                  {isEn
                    ? 'We collect name, email, and user type to personalize your road learning plan and securely process public road incident reports.'
                    : 'Recopilamos nombre, correo y tipo de usuario para personalizar tu plan de aprendizaje vial y procesar de manera segura los reportes de incidentes en vía pública.'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isEn ? '2. Geolocation and Reports' : '2. Geolocalización y Reportes'}
                </h3>
                <p>
                  {isEn
                    ? 'Location in citizen reports is used exclusively to georeference road infrastructure incidents (potholes, traffic lights, blockages) and collaborate with transit authorities.'
                    : 'La ubicación en los reportes ciudadanos se utiliza exclusivamente para georreferenciar incidencias de infraestructura vial (baches, semáforos, bloqueos) y colaborar con las autoridades de transporte.'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isEn ? '3. Security and Confidentiality' : '3. Seguridad y Confidencialidad'}
                </h3>
                <p>
                  {isEn
                    ? 'We implement standard encryption and protection protocols to ensure your passwords and personal data are never disclosed to third parties without consent.'
                    : 'Implementamos cifrado estándar y protocolos de protección para asegurar que tus contraseñas y datos personales nunca sean divulgados a terceros sin consentimiento.'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-end gap-3">
          <button
            id="terms-modal-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {t('terms_modal_close', 'Cerrar')}
          </button>
          {onAccept && (
            <button
              id="terms-modal-accept-btn"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0052cc] hover:bg-[#0047b3] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>{t('terms_modal_accept', 'Aceptar Términos')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
