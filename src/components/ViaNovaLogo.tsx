import React from 'react';

interface ViaNovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  variant?: 'badge' | 'inline' | 'icon-only';
  className?: string;
}

export const ViaNovaLogo: React.FC<ViaNovaLogoProps> = ({ 
  size = 'md', 
  showText = false,
  variant = 'badge',
  className = '' 
}) => {
  const sizeMap = {
    sm: { dimension: 44, textSize: 'text-lg', subSize: 'text-[9px]' },
    md: { dimension: 80, textSize: 'text-xl', subSize: 'text-[11px]' },
    lg: { dimension: 100, textSize: 'text-2xl', subSize: 'text-xs' },
    xl: { dimension: 130, textSize: 'text-3xl', subSize: 'text-sm' },
    '2xl': { dimension: 180, textSize: 'text-4xl', subSize: 'text-base' }
  };

  const { dimension } = sizeMap[size];

  // SVG representation matching the official ViaNova logo from the user's image
  const LogoSVG = () => (
    <svg 
      viewBox="0 0 400 400" 
      className="w-full h-full"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Ring Gradients */}
        <linearGradient id="vnRingGrad" x1="50" y1="20" x2="350" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0047b3" />
          <stop offset="35%" stopColor="#0066ff" />
          <stop offset="70%" stopColor="#00aaff" />
          <stop offset="100%" stopColor="#003399" />
        </linearGradient>

        {/* Inner Glow / Background */}
        <radialGradient id="vnBgGlow" cx="50%" cy="45%" r="55%" fx="50%" fy="35%">
          <stop offset="0%" stopColor="#f8fbff" />
          <stop offset="75%" stopColor="#eef5ff" />
          <stop offset="100%" stopColor="#e3eeff" />
        </radialGradient>

        {/* Left Tech Circuit Arm Gradient */}
        <linearGradient id="vnCircuitGrad" x1="90" y1="180" x2="210" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00b4d8" />
          <stop offset="60%" stopColor="#0077b6" />
          <stop offset="100%" stopColor="#023e8a" />
        </linearGradient>

        {/* Road Gradient */}
        <linearGradient id="vnRoadGrad" x1="180" y1="230" x2="310" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#03045e" />
          <stop offset="30%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Road Edge Highlights */}
        <linearGradient id="vnRoadEdge" x1="180" y1="230" x2="310" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0077b6" />
          <stop offset="100%" stopColor="#00b4d8" />
        </linearGradient>

        {/* Wordmark Gradient for "Via" */}
        <linearGradient id="vnViaTextGrad" x1="60" y1="270" x2="190" y2="270" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0072ff" />
          <stop offset="100%" stopColor="#00b4d8" />
        </linearGradient>

        {/* Swoosh Arc Gradient */}
        <linearGradient id="vnSwooshGrad" x1="180" y1="100" x2="280" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0096c7" />
          <stop offset="100%" stopColor="#48cae4" />
        </linearGradient>

        {/* Drop shadow for pin */}
        <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" floodColor="#003366" />
        </filter>
      </defs>

      {/* Outer Circle Ring */}
      <circle cx="200" cy="200" r="186" fill="url(#vnBgGlow)" stroke="url(#vnRingGrad)" strokeWidth="16" />

      {/* ===================== LOGO EMBLEM: THE V-SHAPED TECH ROAD ===================== */}

      {/* Top Arc / Dynamic Swoosh over the road */}
      <path 
        d="M 185 130 C 215 90, 255 85, 290 92" 
        stroke="url(#vnSwooshGrad)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* --- LEFT CIRCUIT ARM OF THE "V" --- */}
      {/* Circuit Nodes & Traces */}
      {/* Trace 1 (Top left) */}
      <circle cx="112" cy="144" r="5" fill="#0077b6" />
      <path d="M 117 144 L 142 144 L 160 162" stroke="#0077b6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Trace 2 (Upper mid) */}
      <circle cx="104" cy="166" r="5" fill="#0096c7" />
      <path d="M 109 166 L 138 166 L 152 180" stroke="#0096c7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Trace 3 (Mid left main) */}
      <circle cx="98" cy="182" r="5" fill="#0077b6" />
      <path d="M 103 182 L 132 182 L 148 198" stroke="#0077b6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Trace 4 (Lower mid) */}
      <circle cx="120" cy="202" r="5" fill="#0096c7" />
      <path d="M 125 202 L 155 202 L 168 212" stroke="#0096c7" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Trace 5 (Bottom left) */}
      <circle cx="124" cy="208" r="4.5" fill="#023e8a" />
      <path d="M 128 208 L 158 208 L 174 216" stroke="#023e8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Main Solid Left Blue 'V' Wing */}
      <path 
        d="M 118 112 
           L 174 112 
           L 204 205 
           L 182 205 
           Z" 
        fill="url(#vnCircuitGrad)" 
      />
      <path 
        d="M 148 112 
           L 188 112 
           L 214 188 
           L 196 188 
           Z" 
        fill="#0056b3" 
        opacity="0.35"
      />

      {/* --- RIGHT ROAD ARM OF THE "V" --- */}
      {/* Outer Blue Contour of Road */}
      <path 
        d="M 194 218 
           C 180 210, 172 195, 176 178
           C 180 155, 204 135, 235 118 
           C 255 107, 280 102, 310 102
           L 305 110
           C 275 110, 250 116, 232 126
           C 205 142, 192 160, 190 178
           C 188 196, 196 208, 208 214
           Z"
        fill="url(#vnRoadEdge)" 
      />

      {/* Dark Asphalt Road Surface */}
      <path 
        d="M 192 216 
           C 182 206, 182 190, 190 174 
           C 200 152, 222 134, 252 118 
           C 274 107, 296 103, 312 103 
           L 308 114 
           C 290 115, 270 120, 250 128 
           C 226 142, 210 158, 202 174 
           C 196 188, 200 200, 208 208 
           Z" 
        fill="url(#vnRoadGrad)" 
      />

      {/* White Dashed Road Markings (Lane Divider) */}
      <line x1="205" y1="198" x2="209" y2="190" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <line x1="214" y1="180" x2="220" y2="168" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="228" y1="156" x2="238" y2="144" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="250" y1="134" x2="264" y2="124" stroke="#ffffff" strokeWidth="4.2" strokeLinecap="round" />
      <line x1="278" y1="116" x2="296" y2="110" stroke="#ffffff" strokeWidth="4.2" strokeLinecap="round" />

      {/* --- LOCATION PIN ON ROAD DESTINATION (Top Right) --- */}
      <g filter="url(#pinShadow)">
        <path 
          d="M 302 78 
             C 292 78, 284 86, 284 96 
             C 284 108, 302 122, 302 122 
             C 302 122, 320 108, 320 96 
             C 320 86, 312 78, 302 78 Z" 
          fill="#0056b3" 
        />
        {/* Inner white dot of the map pin */}
        <circle cx="302" cy="94" r="5.5" fill="#ffffff" />
      </g>

      {/* ===================== BRAND TYPOGRAPHY ===================== */}

      {/* "ViaNova" Main Brand Wordmark */}
      <g id="ViaNovaWordmark">
        {/* "Via" with vibrant electric blue gradient */}
        <text 
          x="55" 
          y="278" 
          fill="url(#vnViaTextGrad)" 
          fontSize="68" 
          fontWeight="900" 
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
          letterSpacing="-0.03em"
        >
          Via
        </text>

        {/* "Nova" in deep navy black */}
        <text 
          x="170" 
          y="278" 
          fill="#0a192f" 
          fontSize="68" 
          fontWeight="900" 
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
          letterSpacing="-0.03em"
        >
          Nova
        </text>
      </g>

      {/* Subtitle / Slogan: "MOVILIDAD INTELIGENTE PARA TU CIUDAD" */}
      <g id="Slogan">
        {/* Left accent line */}
        <line x1="62" y1="298" x2="88" y2="298" stroke="#0052cc" strokeWidth="1.8" strokeLinecap="round" />
        
        {/* Slogan Text */}
        <text 
          x="200" 
          y="301" 
          textAnchor="middle" 
          fill="#0a192f" 
          fontSize="11" 
          fontWeight="800" 
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
          letterSpacing="0.14em"
        >
          MOVILIDAD INTELIGENTE PARA TU CIUDAD
        </text>

        {/* Right accent line */}
        <line x1="312" y1="298" x2="338" y2="298" stroke="#0052cc" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <div 
          className="rounded-full shadow-sm relative shrink-0 flex items-center justify-center bg-white overflow-hidden"
          style={{ width: dimension, height: dimension }}
        >
          <LogoSVG />
        </div>
        <div className="flex flex-col">
          <div className="font-extrabold tracking-tight leading-none text-[#0a192f] text-lg">
            <span className="text-[#0072ff]">Via</span>Nova
          </div>
          <span className="text-[9px] text-[#555f72] font-bold tracking-wider uppercase">
            Movilidad Inteligente
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div 
        className="rounded-full shadow-md relative flex items-center justify-center bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
        style={{ width: dimension, height: dimension }}
      >
        <LogoSVG />
      </div>

      {showText && (
        <div className="mt-3 text-center">
          <div className="font-black text-[#0a192f] tracking-tight leading-none text-2xl">
            <span className="text-[#0072ff]">Via</span>Nova
          </div>
          <span className="text-[10px] text-[#555f72] font-bold tracking-widest uppercase block mt-1">
            Movilidad Inteligente para tu Ciudad
          </span>
        </div>
      )}
    </div>
  );
};
