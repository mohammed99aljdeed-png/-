import React from 'react';

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  glow?: boolean;
  className?: string;
  subtitle?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  size = 'md',
  showText = true,
  glow = true,
  className = '',
  subtitle,
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 42, h: 42 },
    lg: { w: 56, h: 56 },
    xl: { w: 76, h: 76 },
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* NEXORA Geometric Sphere Emblem */}
      <div className="relative flex items-center justify-center shrink-0">
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-md opacity-60 pointer-events-none transition-all duration-300 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle, rgba(255,120,40,0.45) 0%, rgba(194,65,12,0.15) 70%, transparent 100%)',
              transform: 'scale(1.25)',
            }}
          />
        )}
        <svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-300 hover:rotate-3"
          aria-label="NEXORA Logo"
        >
          <defs>
            {/* Inner Amber-Gold Glowing Core Gradient */}
            <radialGradient id="innerOrangeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb300" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#ea580c" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#9a3412" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </radialGradient>

            {/* Glowing Orange Inner Struts Gradient */}
            <linearGradient id="strutOrangeGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            {/* Dark background base for inner sphere */}
            <radialGradient id="sphereDarkBase" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="70%" stopColor="#0c0a09" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Outer White Ribbon Sheen Gradient */}
            <linearGradient id="whiteRibbonSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f4f4f5" />
              <stop offset="100%" stopColor="#e4e4e7" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dark Spherical Backing */}
          <circle cx="50" cy="50" r="46" fill="url(#sphereDarkBase)" stroke="#27272a" strokeWidth="1" />

          {/* Inner Glowing Radiant Core Web (Amber/Orange Network) */}
          <circle cx="54" cy="54" r="28" fill="url(#innerOrangeGlow)" filter="url(#softGlow)" />

          {/* Radiant Orange Internal Spider/Strut Network from IMG_7754 */}
          <g stroke="url(#strutOrangeGrad)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
            {/* Center-bottom junction radiating upwards */}
            <path d="M56 68 C 54 58, 48 50, 42 42" />
            <path d="M56 68 C 58 56, 68 48, 76 44" />
            <path d="M56 68 C 50 62, 38 64, 30 66" />
            <path d="M56 68 C 56 60, 58 52, 60 38" />
            <path d="M42 42 C 46 32, 52 26, 60 22" />
            <path d="M56 68 C 66 66, 76 68, 82 72" />
          </g>

          {/* Crisp White Intersecting Ribbon Bands forming the Sphere Shell */}
          <g stroke="url(#whiteRibbonSheen)" strokeWidth="4.2" strokeLinecap="round" fill="none">
            {/* Outer Circular Boundary */}
            <circle cx="50" cy="50" r="44" strokeWidth="4.5" />

            {/* Longitudinal Arcs */}
            <path d="M50 6 C 30 20, 26 78, 50 94" />
            <path d="M50 6 C 68 20, 72 78, 50 94" />

            {/* Latitudinal / Diagonal Spherical Bands */}
            <path d="M8 50 C 22 34, 76 34, 92 50" />
            <path d="M12 62 C 28 80, 72 80, 88 62" />
            <path d="M14 36 C 30 18, 70 18, 86 36" />
            <path d="M22 22 C 40 40, 60 70, 78 82" />
          </g>
        </svg>
      </div>

      {/* NEXORA Wordmark */}
      {showText && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center">
            <span
              className={`font-black text-white ${titleSizes} tracking-wide font-sans flex items-center`}
              style={{
                fontFamily: "'Readex Pro', 'Cairo', sans-serif",
                letterSpacing: '0.04em',
              }}
            >
              <span className="text-white">N</span>
              <span className="text-white">e</span>
              {/* Highlight 'x' with subtle warm orange glow or bridge */}
              <span className="relative text-white">
                x
                <span
                  className="absolute -top-[3px] left-[-2px] right-[-10px] h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-transparent rounded-full opacity-80"
                  aria-hidden="true"
                />
              </span>
              <span className="text-white">o</span>
              <span className="text-white">r</span>
              <span className="text-white">a</span>
            </span>
          </div>
          {subtitle && (
            <span className="text-[11px] font-medium text-orange-400/90 tracking-wider">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
