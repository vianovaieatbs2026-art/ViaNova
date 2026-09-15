import React from 'react';

interface TrafficSignGraphicProps {
  signType?: string;
  signCode?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCodeBadge?: boolean;
}

export const TrafficSignGraphic: React.FC<TrafficSignGraphicProps> = ({
  signType = '',
  signCode = '',
  size = 'md',
  className = '',
  showCodeBadge = false
}) => {
  const normalizedType = (signType || signCode || '').toLowerCase().trim();

  // Dimension scaling with xs support and fallback
  const sizeConfigMap = {
    xs: { w: 'w-6 h-6', svgW: 24, svgH: 24, badgeText: 'text-[7px]' },
    sm: { w: 'w-16 h-16', svgW: 64, svgH: 64, badgeText: 'text-[9px]' },
    md: { w: 'w-24 h-24', svgW: 96, svgH: 96, badgeText: 'text-[10px]' },
    lg: { w: 'w-36 h-36', svgW: 144, svgH: 144, badgeText: 'text-xs' },
    xl: { w: 'w-48 h-48', svgW: 192, svgH: 192, badgeText: 'text-sm' }
  };

  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;

  // Render SVG based on Colombian official traffic sign
  const renderSignSvg = () => {
    // 1. SR-01 PARE (Octagon)
    if (normalizedType.includes('sr-01') || normalizedType.includes('pare') || normalizedType.includes('stop')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Outer Octagon */}
          <polygon
            points="29.29,4 70.71,4 96,29.29 96,70.71 70.71,96 29.29,96 4,70.71 4,29.29"
            fill="#c92a2a"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* Inner White Border Octagon */}
          <polygon
            points="30.5,8 69.5,8 92,30.5 92,69.5 69.5,92 30.5,92 8,69.5 8,30.5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* PARE Text */}
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="1"
          >
            PARE
          </text>
        </svg>
      );
    }

    // 2. SR-02 CEDA EL PASO (Inverted Triangle)
    if (normalizedType.includes('sr-02') || normalizedType.includes('ceda')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Outer Red Triangle */}
          <polygon
            points="6,12 94,12 50,88"
            fill="#c92a2a"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner White Triangle */}
          <polygon
            points="18,18 82,18 50,74"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Text CEDA EL PASO */}
          <text
            x="50"
            y="35"
            textAnchor="middle"
            fill="#c92a2a"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="9"
          >
            CEDA
          </text>
          <text
            x="50"
            y="46"
            textAnchor="middle"
            fill="#c92a2a"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="8"
          >
            EL PASO
          </text>
        </svg>
      );
    }

    // 3. SR-30 (50) VELOCIDAD MÁXIMA 50 KM/H
    if (normalizedType.includes('50') && (normalizedType.includes('sr-30') || normalizedType.includes('velocidad') || normalizedType.includes('speed'))) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* White circle with red border */}
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#0f172a"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="30"
          >
            50
          </text>
          <text
            x="50"
            y="70"
            textAnchor="middle"
            fill="#64748b"
            fontFamily="Arial, sans-serif"
            fontWeight="800"
            fontSize="9"
            letterSpacing="0.5"
          >
            KM/H
          </text>
        </svg>
      );
    }

    // 4. SR-30 (30) VELOCIDAD MÁXIMA 30 KM/H (Zona Escolar / Residencial)
    if (normalizedType.includes('30') && (normalizedType.includes('sr-30') || normalizedType.includes('escolar') || normalizedType.includes('velocidad'))) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fill="#c92a2a"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="30"
          >
            30
          </text>
          <text
            x="50"
            y="70"
            textAnchor="middle"
            fill="#64748b"
            fontFamily="Arial, sans-serif"
            fontWeight="800"
            fontSize="9"
            letterSpacing="0.5"
          >
            KM/H
          </text>
        </svg>
      );
    }

    // 5. SR-26 PROHIBIDO PARQUEAR O ESTACIONAR
    if (normalizedType.includes('sr-26') || normalizedType.includes('parquear') || normalizedType.includes('estacionar')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fill="#0f172a"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="44"
          >
            P
          </text>
          {/* Diagonal Red Slash */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="#c92a2a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }

    // 6. SR-04 PROHIBIDO GIRAR A LA IZQUIERDA
    if (normalizedType.includes('sr-04') || normalizedType.includes('izquierda') || normalizedType.includes('left')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          {/* Left Turn Arrow */}
          <path
            d="M 64 68 L 64 48 C 64 38, 54 34, 42 34 L 38 34"
            fill="none"
            stroke="#0f172a"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <polygon points="38,24 24,34 38,44" fill="#0f172a" />
          {/* Diagonal Red Slash */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="#c92a2a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }

    // 7. SR-06 PROHIBIDO GIRAR EN U
    if (normalizedType.includes('sr-06') || normalizedType.includes('giro en u') || normalizedType.includes('u-turn')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          {/* U-Turn Arrow */}
          <path
            d="M 62 68 L 62 44 C 62 30, 38 30, 38 44 L 38 52"
            fill="none"
            stroke="#0f172a"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <polygon points="30,50 38,64 46,50" fill="#0f172a" />
          {/* Diagonal Red Slash */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="#c92a2a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }

    // 8. SR-28 PROHIBIDO MOTOCICLETAS
    if (normalizedType.includes('sr-28') || normalizedType.includes('motos') || normalizedType.includes('motocicletas')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#c92a2a" strokeWidth="8" />
          {/* Motorcycle Silhouette */}
          {/* Wheels */}
          <circle cx="34" cy="58" r="10" fill="none" stroke="#0f172a" strokeWidth="3" />
          <circle cx="66" cy="58" r="10" fill="none" stroke="#0f172a" strokeWidth="3" />
          {/* Frame & Handlebars */}
          <path
            d="M 34 58 L 48 48 L 60 48 L 66 58 M 48 48 L 42 38 L 48 38 M 56 42 L 56 58"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Seat */}
          <rect x="52" y="44" width="8" height="3" rx="1.5" fill="#0f172a" />
          {/* Diagonal Red Slash */}
          <line x1="20" y1="20" x2="80" y2="80" stroke="#c92a2a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }

    // 9. SR-42 CIRCULACIÓN EN GLORIETA / ROTONDA (Blue Circle with White Arrows)
    if (normalizedType.includes('sr-42') || normalizedType.includes('glorieta') || normalizedType.includes('rotonda')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#0052cc" stroke="#ffffff" strokeWidth="3" />
          {/* 3 Circular arrows in circle */}
          <g transform="translate(50,50)">
            {/* Arrow 1 */}
            <path d="M 0,-24 A 24 24 0 0 1 20.7,12" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="20.7,12 16,6 27,8" fill="#ffffff" />
            {/* Arrow 2 */}
            <path d="M 20.7,12 A 24 24 0 0 1 -20.7,12" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="-20.7,12 -15,18 -19,7" fill="#ffffff" />
            {/* Arrow 3 */}
            <path d="M -20.7,12 A 24 24 0 0 1 0,-24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="0,-24 -6,-18 5,-22" fill="#ffffff" />
          </g>
        </svg>
      );
    }

    // 10. SP-01 CURVA PELIGROSA A LA DERECHA/IZQUIERDA (Yellow Diamond)
    if (normalizedType.includes('sp-01') || normalizedType.includes('curva') || normalizedType.includes('bend')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Yellow Diamond */}
          <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Curve Symbol */}
          <path
            d="M 50 74 L 50 52 C 50 40, 68 40, 68 32 L 68 28"
            fill="none"
            stroke="#0f172a"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <polygon points="60,30 68,18 76,30" fill="#0f172a" />
        </svg>
      );
    }

    // 11. SP-29 ZONA ESCOLAR / PEATONES (Yellow Diamond)
    if (normalizedType.includes('sp-29') || normalizedType.includes('escolar') || normalizedType.includes('peaton') || normalizedType.includes('colegio')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Parent & Child Silhouette Walking */}
          {/* Parent */}
          <circle cx="42" cy="36" r="4.5" fill="#0f172a" />
          <path d="M 37 44 L 47 44 L 45 62 L 40 62 Z" fill="#0f172a" />
          <line x1="41" y1="62" x2="39" y2="72" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="45" y1="62" x2="47" y2="72" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          {/* Child */}
          <circle cx="58" cy="42" r="3.5" fill="#0f172a" />
          <path d="M 54 48 L 62 48 L 60 62 L 56 62 Z" fill="#0f172a" />
          <line x1="57" y1="62" x2="55" y2="70" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="62" x2="62" y2="70" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Schoolbag on child */}
          <rect x="61" y="50" width="4" height="6" rx="1" fill="#0f172a" />
        </svg>
      );
    }

    // 12. SP-40 RESALTO / POLICÍA ACOSTADO (Yellow Diamond)
    if (normalizedType.includes('sp-40') || normalizedType.includes('resalto') || normalizedType.includes('policia')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Speed Hump (Resalto) Silhouette */}
          <path
            d="M 22 58 L 36 58 C 42 46, 58 46, 64 58 L 78 58"
            fill="none"
            stroke="#0f172a"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // 13. SP-47 SEMÁFORO PRÓXIMO (Yellow Diamond)
    if (normalizedType.includes('sp-47') || normalizedType.includes('semaforo') || normalizedType.includes('traffic light')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Traffic Light Housing */}
          <rect x="42" y="30" width="16" height="40" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* 3 Lights: Red, Yellow, Green */}
          <circle cx="50" cy="37" r="4" fill="#ef4444" />
          <circle cx="50" cy="50" r="4" fill="#f59e0b" />
          <circle cx="50" cy="63" r="4" fill="#10b981" />
        </svg>
      );
    }

    // 14. SP-55 CICLISTAS EN LA VÍA (Yellow Diamond)
    if (normalizedType.includes('sp-55') || normalizedType.includes('ciclista') || normalizedType.includes('bicicleta')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Bicycle */}
          <circle cx="35" cy="56" r="9" fill="none" stroke="#0f172a" strokeWidth="3" />
          <circle cx="65" cy="56" r="9" fill="none" stroke="#0f172a" strokeWidth="3" />
          <path
            d="M 35 56 L 48 44 L 60 44 L 65 56 M 48 44 L 43 36 L 49 36 M 57 40 L 57 56"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // 15. SI-01 PRIMEROS AUXILIOS / HOSPITAL (Blue Rectangle with White Border and Red Cross)
    if (normalizedType.includes('si-01') || normalizedType.includes('hospital') || normalizedType.includes('auxilios')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <rect x="8" y="10" width="84" height="80" rx="8" fill="#0052cc" stroke="#ffffff" strokeWidth="3" />
          <rect x="22" y="24" width="56" height="52" rx="4" fill="#ffffff" />
          {/* Red Cross */}
          <path
            d="M 44 32 L 56 32 L 56 44 L 68 44 L 68 56 L 56 56 L 56 68 L 44 68 L 44 56 L 32 56 L 32 44 L 44 44 Z"
            fill="#dc2626"
          />
        </svg>
      );
    }

    // 16. SI-05 ESTACIÓN DE SERVICIO / GASOLINA (Blue Rectangle)
    if (normalizedType.includes('si-05') || normalizedType.includes('gasolina') || normalizedType.includes('combustible')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <rect x="8" y="10" width="84" height="80" rx="8" fill="#0052cc" stroke="#ffffff" strokeWidth="3" />
          <rect x="22" y="24" width="56" height="52" rx="4" fill="#ffffff" />
          {/* Gas Pump Silhouette */}
          <rect x="34" y="34" width="20" height="34" rx="2" fill="#0f172a" />
          <rect x="38" y="38" width="12" height="10" rx="1" fill="#ffffff" />
          {/* Pump Hose */}
          <path
            d="M 54 44 C 62 44, 64 50, 64 56 L 64 64"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    // 17. ST-01 OBRAS EN LA VÍA / TRABAJOS (Orange Diamond)
    if (normalizedType.includes('st-01') || normalizedType.includes('obras') || normalizedType.includes('trabajos')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Orange Diamond */}
          <polygon points="50,4 96,50 50,96 4,50" fill="#ea580c" stroke="#0f172a" strokeWidth="3" />
          <polygon points="50,9 91,50 50,91 9,50" fill="none" stroke="#0f172a" strokeWidth="1" />
          {/* Construction Worker with Shovel Silhouette */}
          <circle cx="56" cy="34" r="4.5" fill="#0f172a" />
          <path
            d="M 52 42 L 62 42 L 56 60 L 50 60 Z"
            fill="#0f172a"
          />
          <line x1="40" y1="70" x2="60" y2="44" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          {/* Shovel blade */}
          <path d="M 37 68 L 43 65 L 41 73 Z" fill="#0f172a" />
        </svg>
      );
    }

    // Generic Default Sign
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon points="50,4 96,50 50,96 4,50" fill="#facc15" stroke="#0f172a" strokeWidth="3" />
        <text x="50" y="55" textAnchor="middle" fill="#0f172a" fontWeight="bold" fontSize="14">
          {signCode || 'SEÑAL'}
        </text>
      </svg>
    );
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Sign mounting pole simulation */}
      <div className="relative flex flex-col items-center group">
        <div className={`${sizeConfig.w} transition-transform duration-300 group-hover:scale-105`}>
          {renderSignSvg()}
        </div>

        {/* Small reflective metallic glare effect */}
        <div className="absolute inset-0 pointer-events-none rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-transparent opacity-60" />
      </div>

      {showCodeBadge && signCode && (
        <span className={`mt-1.5 font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 ${sizeConfig.badgeText}`}>
          {signCode}
        </span>
      )}
    </div>
  );
};
