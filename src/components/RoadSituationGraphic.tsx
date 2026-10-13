import React from 'react';

interface RoadSituationGraphicProps {
  situationType: string;
  className?: string;
  caption?: string;
}

export const RoadSituationGraphic: React.FC<RoadSituationGraphicProps> = ({
  situationType,
  className = '',
  caption
}) => {
  const normType = (situationType || '').toLowerCase();

  // Render SVG situation graphics
  const renderSituation = () => {
    // 1. GLORIETA / ROTONDA: Prelación al circular
    if (normType.includes('glorieta') || normType.includes('rotonda')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          {/* Background Grass / Pavement */}
          <rect width="400" height="240" rx="16" fill="#1e293b" />
          <circle cx="200" cy="120" r="100" fill="#334155" />
          <circle cx="200" cy="120" r="75" fill="#1e293b" />
          {/* Central Island Green */}
          <circle cx="200" cy="120" r="50" fill="#166534" stroke="#15803d" strokeWidth="3" />
          <circle cx="200" cy="120" r="15" fill="#22c55e" />

          {/* Roads entering */}
          {/* West Road */}
          <rect x="0" y="95" width="125" height="50" fill="#334155" />
          <line x1="0" y1="120" x2="105" y2="120" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          {/* South Road */}
          <rect x="175" y="145" width="50" height="95" fill="#334155" />
          <line x1="200" y1="170" x2="200" y2="240" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          {/* East Road */}
          <rect x="275" y="95" width="125" height="50" fill="#334155" />
          <line x1="295" y1="120" x2="400" y2="120" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          {/* North Road */}
          <rect x="175" y="0" width="50" height="95" fill="#334155" />
          <line x1="200" y1="0" x2="200" y2="70" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />

          {/* Roundabout lane line */}
          <circle cx="200" cy="120" r="88" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

          {/* Yield line at South entrance */}
          <line x1="175" y1="170" x2="200" y2="170" stroke="#ffffff" strokeWidth="3" strokeDasharray="4 2" />

          {/* Vehicle A (Inside Roundabout - Has Priority) - Blue Car */}
          <g transform="translate(185, 45) rotate(80)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-12" width="18" height="10" rx="2" fill="#0f172a" />
            <rect x="-9" y="4" width="18" height="8" rx="2" fill="#0f172a" />
            {/* Headlights */}
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>
          {/* Priority Label on Vehicle A */}
          <g transform="translate(230, 42)">
            <rect x="0" y="0" width="120" height="24" rx="12" fill="#0284c7" />
            <text x="60" y="16" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">
              VEHÍCULO A (PRELACIÓN)
            </text>
          </g>

          {/* Vehicle B (Waiting at Entrance - Must Yield) - Orange Car */}
          <g transform="translate(187, 205)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-12" width="18" height="10" rx="2" fill="#0f172a" />
            <rect x="-9" y="4" width="18" height="8" rx="2" fill="#0f172a" />
            {/* Headlights */}
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>
          {/* Yield Label on Vehicle B */}
          <g transform="translate(30, 200)">
            <rect x="0" y="0" width="140" height="24" rx="12" fill="#ea580c" />
            <text x="70" y="16" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">
              VEHÍCULO B (CEDA EL PASO)
            </text>
          </g>

          {/* Arrow showing circular flow */}
          <path d="M 140 100 A 70 70 0 0 1 240 70" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2" />
          <polygon points="246,67 236,65 240,75" fill="#38bdf8" />
        </svg>
      );
    }

    // 2. CEBRA / PASO PEATONAL
    if (normType.includes('cebra') || normType.includes('peaton') || normType.includes('cruce')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          {/* Asphalt */}
          <rect width="400" height="240" rx="16" fill="#334155" />
          {/* Sidewalks */}
          <rect x="0" y="0" width="400" height="40" fill="#94a3b8" />
          <line x1="0" y1="40" x2="400" y2="40" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="0" y="200" width="400" height="40" fill="#94a3b8" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="3" />

          {/* Yellow central double line */}
          <line x1="0" y1="117" x2="220" y2="117" stroke="#facc15" strokeWidth="3" />
          <line x1="0" y1="123" x2="220" y2="123" stroke="#facc15" strokeWidth="3" />
          <line x1="320" y1="117" x2="400" y2="117" stroke="#facc15" strokeWidth="3" />
          <line x1="320" y1="123" x2="400" y2="123" stroke="#facc15" strokeWidth="3" />

          {/* Zebra Crossing Stripes */}
          {[50, 75, 100, 125, 150, 175].map((y, idx) => (
            <rect key={idx} x="240" y={y - 8} width="60" height="16" rx="2" fill="#ffffff" />
          ))}

          {/* Stop Line before Zebra */}
          <line x1="220" y1="40" x2="220" y2="200" stroke="#ffffff" strokeWidth="5" />

          {/* Pedestrian on Zebra Crossing */}
          <g transform="translate(265, 110)">
            <circle cx="0" cy="-14" r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M -6 0 L 6 0 L 4 22 L -4 22 Z" fill="#2563eb" />
            <line x1="-3" y1="22" x2="-6" y2="34" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="3" y1="22" x2="6" y2="34" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          {/* Badge Pedestrian */}
          <g transform="translate(210, 15)">
            <rect x="0" y="0" width="130" height="20" rx="10" fill="#16a34a" />
            <text x="65" y="14" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
              🚶 PEATÓN EN LA VÍA
            </text>
          </g>

          {/* Approaching Car stopped before stop line */}
          <g transform="translate(130, 160) rotate(90)">
            <rect x="-16" y="-28" width="32" height="56" rx="8" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <rect x="-12" y="-16" width="24" height="12" rx="2" fill="#0f172a" />
            <rect x="-12" y="6" width="24" height="10" rx="2" fill="#0f172a" />
            <circle cx="-10" cy="-24" r="3" fill="#fef08a" />
            <circle cx="10" cy="-24" r="3" fill="#fef08a" />
          </g>
          <g transform="translate(40, 205)">
            <rect x="0" y="0" width="140" height="22" rx="11" fill="#dc2626" />
            <text x="70" y="15" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
              🛑 VEHÍCULO DEBE DETENERSE
            </text>
          </g>
        </svg>
      );
    }

    // 3. LÍNEA CONTINUA / ADELANTAMIENTO PROHIBIDO
    if (normType.includes('linea') || normType.includes('adelantar') || normType.includes('continua')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          <rect width="400" height="240" rx="16" fill="#15803d" />
          {/* Curving Highway Asphalt */}
          <path
            d="M 0 170 C 120 170, 180 80, 400 60 L 400 130 C 200 150, 140 230, 0 230 Z"
            fill="#334155"
          />
          {/* Double Solid Yellow Line (No Overtaking) */}
          <path
            d="M 0 197 C 125 197, 188 112, 400 92"
            fill="none"
            stroke="#facc15"
            strokeWidth="3.5"
          />
          <path
            d="M 0 203 C 125 203, 188 118, 400 98"
            fill="none"
            stroke="#facc15"
            strokeWidth="3.5"
          />

          {/* White side border lines */}
          <path d="M 0 173 C 120 173, 180 83, 400 63" fill="none" stroke="#ffffff" strokeWidth="2" />
          <path d="M 0 227 C 140 227, 200 147, 400 127" fill="none" stroke="#ffffff" strokeWidth="2" />

          {/* Car 1 in right lane */}
          <g transform="translate(140, 175) rotate(-22)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-10" width="18" height="8" rx="2" fill="#0f172a" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>

          {/* Car 2 trying to overtake (prohibited) */}
          <g transform="translate(230, 100) rotate(-18)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-10" width="18" height="8" rx="2" fill="#0f172a" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>

          {/* No Overtaking Warning Badge */}
          <g transform="translate(18, 20)">
            <rect x="0" y="0" width="230" height="30" rx="15" fill="#b91c1c" stroke="#fecaca" strokeWidth="1.5" />
            <text x="115" y="20" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">
              🚫 PROHIBIDO ADELANTAR
            </text>
          </g>
          <g transform="translate(255, 20)">
            <rect x="0" y="0" width="130" height="26" rx="8" fill="#1e293b" />
            <text x="65" y="17" fill="#facc15" fontSize="10" fontWeight="900" textAnchor="middle">
              DOBLE LÍNEA AMARILLA
            </text>
          </g>
        </svg>
      );
    }

    // 4. DISTANCIA DE SEGURIDAD / REGLA DE LOS 3 SEGUNDOS
    if (normType.includes('distancia') || normType.includes('seguridad') || normType.includes('frenado')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          {/* Highway */}
          <rect width="400" height="240" rx="16" fill="#1e293b" />
          <rect x="0" y="50" width="400" height="140" fill="#334155" />
          <line x1="0" y1="120" x2="400" y2="120" stroke="#facc15" strokeWidth="3" strokeDasharray="15 10" />
          <line x1="0" y1="52" x2="400" y2="52" stroke="#ffffff" strokeWidth="2" />
          <line x1="0" y1="188" x2="400" y2="188" stroke="#ffffff" strokeWidth="2" />

          {/* Car Front (Leading) */}
          <g transform="translate(320, 85) rotate(90)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-12" width="18" height="10" rx="2" fill="#0f172a" />
            <rect x="-9" y="4" width="18" height="8" rx="2" fill="#0f172a" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>

          {/* Distance Indicator Arrow Line */}
          <line x1="120" y1="85" x2="295" y2="85" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
          <polygon points="295,85 285,80 285,90" fill="#38bdf8" />
          <polygon points="120,85 130,80 130,90" fill="#38bdf8" />

          {/* Car Behind (Following) */}
          <g transform="translate(100, 85) rotate(90)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-9" y="-12" width="18" height="10" rx="2" fill="#0f172a" />
            <rect x="-9" y="4" width="18" height="8" rx="2" fill="#0f172a" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>

          {/* Distance Pill Box */}
          <g transform="translate(155, 60)">
            <rect x="0" y="0" width="105" height="24" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="52" y="16" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">
              ⏱️ 3 SEGUNDOS
            </text>
          </g>

          {/* Regulatory explanation box */}
          <g transform="translate(50, 150)">
            <rect x="0" y="0" width="300" height="30" rx="10" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <text x="150" y="20" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
              Art. 108 CNT: Distancia mínima de seguridad obligatoria
            </text>
          </g>
        </svg>
      );
    }

    // 5. SEMÁFORO AMARILLO
    if (normType.includes('semaforo') || normType.includes('amarillo')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          <rect width="400" height="240" rx="16" fill="#1e293b" />
          <rect x="0" y="120" width="400" height="100" fill="#334155" />
          {/* White Stop Line */}
          <line x1="260" y1="120" x2="260" y2="220" stroke="#ffffff" strokeWidth="6" />

          {/* Traffic Light Post & Head */}
          <rect x="290" y="20" width="10" height="100" fill="#64748b" />
          <rect x="275" y="10" width="40" height="85" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          {/* Red Light (Off) */}
          <circle cx="295" cy="28" r="9" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1" />
          {/* Yellow Light (Active / Glowing!) */}
          <circle cx="295" cy="52" r="11" fill="#facc15" stroke="#fef08a" strokeWidth="2" className="animate-pulse" />
          <circle cx="295" cy="52" r="18" fill="none" stroke="#facc15" strokeWidth="2" opacity="0.4" />
          {/* Green Light (Off) */}
          <circle cx="295" cy="76" r="9" fill="#052e16" stroke="#14532d" strokeWidth="1" />

          {/* Approaching Car */}
          <g transform="translate(140, 170) rotate(90)">
            <rect x="-14" y="-24" width="28" height="48" rx="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <rect x="-10" y="-12" width="20" height="10" rx="2" fill="#0f172a" />
            <circle cx="-8" cy="-22" r="2.5" fill="#fef08a" />
            <circle cx="8" cy="-22" r="2.5" fill="#fef08a" />
          </g>

          {/* Yellow Light Rule Badge */}
          <g transform="translate(30, 25)">
            <rect x="0" y="0" width="220" height="50" rx="12" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
            <text x="110" y="22" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
              LUZ AMARILLA FIJA
            </text>
            <text x="110" y="38" fill="#fef9c3" fontSize="9" fontWeight="bold" textAnchor="middle">
              Advertencia: detenerse si es seguro
            </text>
          </g>
        </svg>
      );
    }

    // 6. MOTOCICLISTA CON CASCO REGLAMENTARIO
    if (normType.includes('casco') || normType.includes('moto')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          <rect width="400" height="240" rx="16" fill="#0f172a" />
          {/* Graphic frame */}
          <rect x="20" y="20" width="360" height="200" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* Certified Helmet Profile */}
          <g transform="translate(130, 110)">
            {/* Outer Helmet Shell */}
            <path
              d="M -50 10 C -50 -50, 40 -55, 55 0 C 58 15, 50 35, 40 40 C 20 48, -30 45, -45 30 Z"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="3"
            />
            {/* Dark Visor */}
            <path
              d="M 5 0 C 15 -15, 40 -10, 48 5 C 45 20, 20 22, 5 15 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Chin Strap (Abrochado) */}
            <path d="M -15 35 Q 0 50 15 35" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <rect x="-4" y="40" width="8" height="6" rx="1" fill="#ef4444" />

            {/* DOT / ECE stamp badge on back */}
            <rect x="-48" y="5" width="16" height="10" rx="2" fill="#ffffff" />
            <text x="-40" y="13" fill="#0f172a" fontSize="6" fontWeight="900" textAnchor="middle">DOT</text>
          </g>

          {/* Requirements Checklist */}
          <g transform="translate(230, 50)">
            <rect x="0" y="0" width="135" height="135" rx="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
            <text x="67" y="22" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">
              RESOLUCIÓN 23385
            </text>
            <text x="12" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold">✓ Casco certificado</text>
            <text x="12" y="65" fill="#e2e8f0" fontSize="9" fontWeight="bold">✓ Cabeza totalmente</text>
            <text x="22" y="77" fill="#94a3b8" fontSize="8">inmersa en el casco</text>
            <text x="12" y="97" fill="#e2e8f0" fontSize="9" fontWeight="bold">✓ Hebilla abrochada</text>
            <text x="12" y="117" fill="#e2e8f0" fontSize="9" fontWeight="bold">✓ Sin celular adentro</text>
          </g>
        </svg>
      );
    }

    // 7. PRELACIÓN A LA DERECHA EN CRUCE SIN SEÑALIZAR
    if (normType.includes('interseccion') || normType.includes('derecha') || normType.includes('cruce_vias')) {
      return (
        <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
          <rect width="400" height="240" rx="16" fill="#1e293b" />
          {/* Cross Intersection */}
          <rect x="0" y="80" width="400" height="80" fill="#334155" />
          <rect x="160" y="0" width="80" height="240" fill="#334155" />
          {/* Road center dashlines */}
          <line x1="0" y1="120" x2="160" y2="120" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="240" y1="120" x2="400" y2="120" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="200" y1="0" x2="200" y2="80" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="200" y1="160" x2="200" y2="240" stroke="#facc15" strokeWidth="2" strokeDasharray="6 4" />

          {/* Car 1 (From the right - Blue - Has Right of Way) */}
          <g transform="translate(100, 100) rotate(90)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>
          {/* Car 2 (From South - Red - Must Yield to Right) */}
          <g transform="translate(180, 200)">
            <rect x="-12" y="-20" width="24" height="40" rx="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="-8" cy="-18" r="2" fill="#fef08a" />
            <circle cx="8" cy="-18" r="2" fill="#fef08a" />
          </g>

          {/* Rule Label */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="200" height="26" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="100" y="17" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">
              PRELACIÓN: VEHÍCULO POR DERECHA
            </text>
          </g>
        </svg>
      );
    }

    // Fallback Default Situation
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-md">
        <rect width="400" height="240" rx="16" fill="#1e293b" />
        <rect x="0" y="80" width="400" height="80" fill="#334155" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#facc15" strokeWidth="3" strokeDasharray="10 8" />
        <text x="200" y="125" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
          SITUACIÓN VIAL EN TRÁNSITO
        </text>
      </svg>
    );
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="w-full max-w-md aspect-[16/10] overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-900 shadow-lg relative group">
        {renderSituation()}
      </div>
      {caption && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-2 text-center max-w-sm px-2">
          {caption}
        </span>
      )}
    </div>
  );
};
