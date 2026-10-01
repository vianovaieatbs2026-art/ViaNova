import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  TrafficCone, 
  BookOpen, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

import { ScreenId } from '../types';

interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  stats: string;
  targetScreen?: ScreenId;
}

interface AnimatedServicesGridProps {
  onActionClick?: (serviceId?: string) => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const AnimatedServicesGrid: React.FC<AnimatedServicesGridProps> = ({ 
  onActionClick, 
  onNavigate 
}) => {
  const services: ServiceItem[] = [
    {
      id: 'simulador',
      title: 'Simulador Teórico Oficial CEA / RUNT',
      tag: 'SIMULADOR DE EXAMEN',
      badgeColor: 'bg-[#00AFFF]/15 text-[#00AFFF]',
      borderColor: 'hover:border-[#00AFFF]',
      glowColor: 'hover:shadow-[0_0_30px_rgba(0,175,255,0.3)]',
      description: 'Entrénate con preguntas oficiales bajo el estándar del Ministerio de Transporte. Cronómetro regresivo y retroalimentación técnica inmediata.',
      icon: <GraduationCap size={32} className="text-[#00AFFF]" />,
      actionText: 'Probar Simulador',
      stats: '30 preguntas aleatorias • 40 min',
      targetScreen: 'simulador'
    },
    {
      id: 'senales',
      title: 'Diccionario de Señales Viales HD',
      tag: 'CATÁLOGO VISUAL',
      badgeColor: 'bg-[#FF6B00]/15 text-[#FF6B00]',
      borderColor: 'hover:border-[#FF6B00]',
      glowColor: 'hover:shadow-[0_0_30px_rgba(255,107,0,0.3)]',
      description: 'Catálogo clasificado: reglamentarias rojas, preventivas amarillas e informativas azules con su código oficial y sanciones del Código Nacional.',
      icon: <TrafficCone size={32} className="text-[#FF6B00]" />,
      actionText: 'Explorar Señales',
      stats: 'Más de 120 señales oficiales',
      targetScreen: 'senales'
    },
    {
      id: 'educacion',
      title: 'Escuela de Convivencia y Leyes',
      tag: 'FORMACIÓN VIAL COLOMBIA',
      badgeColor: 'bg-[#00FF88]/15 text-[#00FF88]',
      borderColor: 'hover:border-[#00FF88]',
      glowColor: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]',
      description: 'Módulos didácticos sobre la Ley Julián Esteban (Ley 2251 de 2022), distancias de frenado, prelación en glorietas y puntos ciegos de carga pesada.',
      icon: <BookOpen size={32} className="text-[#00FF88]" />,
      actionText: 'Acceder a Clases',
      stats: 'Normativa Ley 769 & Ley 2251',
      targetScreen: 'educacion_vial'
    },
    {
      id: 'reportes',
      title: 'Reportes y Geolocalización en Vivo',
      tag: 'MOVILIDAD COLABORATIVA',
      badgeColor: 'bg-[#00AFFF]/15 text-[#00AFFF]',
      borderColor: 'hover:border-[#00AFFF]',
      glowColor: 'hover:shadow-[0_0_30px_rgba(0,175,255,0.3)]',
      description: 'Alertas viales comunitarias en mapa satelital: baches peligrosos, semáforos intermitentes, retenes y cierres viales en tiempo real.',
      icon: <MapPin size={32} className="text-[#00AFFF]" />,
      actionText: 'Ver Mapa en Vivo',
      stats: 'Georreferenciación en tiempo real',
      targetScreen: 'reportes'
    }
  ];

  return (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00AFFF]/15 border border-[#00AFFF]/30 text-[#00AFFF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Zap size={14} className="text-[#00FF88]" />
          <span>SERVICIOS INTEGRALES DE FORMACIÓN Y MOVILIDAD</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Ecosistema Digital de <span className="text-[#00AFFF]">Seguridad Vial</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
          Aprende las normas vigentes, practica en simuladores oficiales, domina las señales y certifícate.
        </p>
      </div>

      {/* Grid with 3D Tilt and Squash & Stretch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.025, 
              y: -6,
              transition: { type: 'spring', stiffness: 350, damping: 18 } 
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              if (item.targetScreen && onNavigate) {
                onNavigate(item.targetScreen);
              } else if (onActionClick) {
                onActionClick(item.id);
              }
            }}
            className={`group p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1931]/90 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 ${item.borderColor} ${item.glowColor} transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md`}
          >
            {/* Top Row: Tag + Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${item.badgeColor} border border-current/20`}>
                  {item.tag}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-[#00AFFF] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>

            {/* Bottom Row: Key Metric + Action CTA */}
            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {item.stats}
              </span>

              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#0052cc] dark:text-[#00AFFF] group-hover:translate-x-1 transition-transform">
                <span>{item.actionText}</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
