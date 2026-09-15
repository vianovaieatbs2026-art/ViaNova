import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, type, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        id="terms-modal-container" 
        className="bg-white rounded-xl shadow-level-3 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#dae2ff] relative"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#f0f3ff] flex items-center justify-between bg-[#f9f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#dae2ff] flex items-center justify-center text-[#0052cc]">
              {type === 'terms' ? <FileText size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#003d9b]">
                {type === 'terms' ? 'Términos de Servicio' : 'Política de Privacidad'}
              </h2>
              <p className="text-xs text-[#555f72]">Plataforma de Movilidad Segura ViaNova</p>
            </div>
          </div>
          <button 
            id="terms-modal-close-btn"
            onClick={onClose}
            className="text-[#737685] hover:text-[#101c2d] p-1.5 rounded-lg hover:bg-[#e7eeff] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#434654] leading-relaxed">
          {type === 'terms' ? (
            <>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">1. Objeto del Servicio</h3>
                <p>
                  ViaNova es una plataforma integral para la capacitación vial, evaluación de conocimientos teóricos y reporte colaborativo de incidencias urbanas para promover la seguridad y eficiencia del tránsito.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">2. Cuentas y Responsabilidad</h3>
                <p>
                  El usuario se compromete a ingresar información verídica al registrarse como Conductor, Aspirante, Estudiante o Ciudadano. La veracidad de los reportes viales es fundamental para el funcionamiento del sistema.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">3. Certificaciones y Simuladores</h3>
                <p>
                  Los exámenes y certificaciones emitidos en ViaNova reflejan el rendimiento formativo y normativo basado en los manuales de tránsito vigentes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">4. Normas de Convivencia Vial</h3>
                <p>
                  El uso de la aplicación incentiva la conducción preventiva, el respeto por peatones y ciclistas, y la reducción de la siniestralidad vial.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">1. Recolección de Datos</h3>
                <p>
                  Recopilamos nombre, correo y tipo de usuario para personalizar tu plan de aprendizaje vial y procesar de manera segura los reportes de incidentes en vía pública.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">2. Geolocalización y Reportes</h3>
                <p>
                  La ubicación en los reportes ciudadanos se utiliza exclusivamente para georreferenciar incidencias de infraestructura vial (baches, semáforos, bloqueos) y colaborar con las autoridades de transporte.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#101c2d] mb-1">3. Seguridad y Confidencialidad</h3>
                <p>
                  Implementamos cifrado estándar y protocolos de protección para asegurar que tus contraseñas y datos personales nunca sean divulgados a terceros sin consentimiento.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0f3ff] bg-[#f9f9ff] flex items-center justify-end gap-3">
          <button
            id="terms-modal-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#555f72] hover:text-[#101c2d] transition-colors"
          >
            Cerrar
          </button>
          {onAccept && (
            <button
              id="terms-modal-accept-btn"
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0052cc] hover:bg-[#003d9b] rounded-lg transition-colors flex items-center gap-1.5 shadow-level-1"
            >
              <CheckCircle2 size={16} />
              <span>Aceptar Términos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
