import React from 'react';

interface LegalSealProps {
  className?: string;
  size?: number | string;
}

export const LegalSeal: React.FC<LegalSealProps> = ({ className = 'w-8 h-8', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <defs>
        {/* Background Subtle Radial Gradient */}
        <radialGradient id="sealBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F4F6F9" />
        </radialGradient>

        {/* Linear Gradients for Rich Legal Gold */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Deep Authority Navy */}
        <linearGradient id="navyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0A192F" />
        </linearGradient>

        {/* Drop Shadow for Legal Seal Elegance */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0A192F" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Circular Outer Enclosure */}
      <circle cx="256" cy="256" r="236" fill="url(#sealBg)" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="256" cy="256" r="224" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeDasharray="6,4" />
      <circle cx="256" cy="256" r="212" fill="none" stroke="#1E3A8A" strokeWidth="1.5" strokeOpacity="0.4" />

      {/* Outer Ring Inscription Stars/Dots */}
      <g fill="url(#goldGrad)">
        <circle cx="256" cy="38" r="4" />
        <circle cx="256" cy="474" r="4" />
        <circle cx="38" cy="256" r="4" />
        <circle cx="474" cy="256" r="4" />
      </g>

      {/* Central Shield */}
      <g filter="url(#softShadow)">
        <path
          d="M 256, 84 C 334, 84 380, 112 380, 170 C 380, 290 295, 385 256, 420 C 217, 385 132, 290 132, 170 C 132, 112 178, 84 256, 84 Z"
          fill="#FFFFFF"
          stroke="url(#navyGrad)"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <path
          d="M 256, 102 C 322, 102 362, 126 362, 174 C 362, 276 290, 362 256, 396 C 222, 362 150, 276 150, 174 C 150, 126 190, 102 256, 102 Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeOpacity="0.85"
        />
      </g>

      {/* Core Legal Symbol: The Balanced Scales of Justice + Central Column Pillar */}
      <g id="scales-of-justice" transform="translate(0, 4)">
        <path d="M 256, 128 L 256, 334" stroke="url(#navyGrad)" strokeWidth="7" strokeLinecap="round" />
        <polygon points="256,116 264,128 256,140 248,128" fill="url(#goldGrad)" />
        <path d="M 226, 334 L 286, 334" stroke="url(#navyGrad)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 214, 346 L 298, 346" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round" />
        <path d="M 182, 174 C 218, 168 294, 168 330, 174" fill="none" stroke="url(#navyGrad)" strokeWidth="6" strokeLinecap="round" />

        <circle cx="256" cy="171" r="11" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="4" />
        <circle cx="256" cy="171" r="4" fill="url(#navyGrad)" />

        {/* Left Scale */}
        <g id="left-scale">
          <circle cx="182" cy="174" r="4" fill="url(#goldGrad)" />
          <line x1="182" y1="178" x2="160" y2="236" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="182" y1="178" x2="204" y2="236" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 152, 236 C 152, 258 212, 258 212, 236 Z" fill="url(#goldGrad)" />
          <line x1="148" y1="236" x2="216" y2="236" stroke="url(#navyGrad)" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Right Scale */}
        <g id="right-scale">
          <circle cx="330" cy="174" r="4" fill="url(#goldGrad)" />
          <line x1="330" y1="178" x2="308" y2="236" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="330" y1="178" x2="352" y2="236" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 300, 236 C 300, 258 360, 258 360, 236 Z" fill="url(#goldGrad)" />
          <line x1="296" y1="236" x2="364" y2="236" stroke="url(#navyGrad)" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Keyhole */}
        <circle cx="256" cy="276" r="13" fill="#F8FAFC" stroke="url(#navyGrad)" strokeWidth="3" />
        <path d="M 253, 276 L 259, 276 L 261, 298 L 251, 298 Z" fill="url(#navyGrad)" />
      </g>
    </svg>
  );
};
