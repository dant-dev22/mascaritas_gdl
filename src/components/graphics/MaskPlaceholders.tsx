import type { Product } from '@/__types__';

interface MaskSvgProps {
  readonly productId: Product['id'];
  readonly className?: string;
}

export function MaskPlaceholderSvg({ productId, className }: MaskSvgProps) {
  if (productId === 'prod-001') return <SargentoTiburon className={className} />;
  if (productId === 'prod-002') return <DiabloVerde className={className} />;
  return <ElGalactico className={className} />;
}

interface BaseProps {
  readonly className?: string;
}

function SargentoTiburon({ className }: BaseProps) {
  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="p1body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2A2000" />
          <stop offset="100%" stopColor="#120C00" />
        </linearGradient>
      </defs>
      <path
        d="M120 20 C180 20 210 60 210 120 C210 160 198 200 180 225 L180 260 L120 275 L60 260 L60 225 C42 200 30 160 30 120 C30 60 60 20 120 20 Z"
        fill="url(#p1body)"
        stroke="#F4C542"
        strokeWidth="2"
      />
      <path d="M90 40 L120 15 L150 40 L140 55 L120 48 L100 55 Z" fill="#F4C542" />
      <ellipse cx="90" cy="130" rx="22" ry="11" fill="#000" stroke="#F4C542" strokeWidth="2.5" />
      <ellipse cx="150" cy="130" rx="22" ry="11" fill="#000" stroke="#F4C542" strokeWidth="2.5" />
      <path d="M95 175 L105 200 L115 175 L125 200 L135 175 L145 200 L155 175 L150 210 L90 210 Z" fill="#fff" />
      <path d="M100 175 H150" stroke="#000" strokeWidth="1" />
      <path d="M60 115 L95 108 L93 118 L62 125 Z" fill="#E63946" />
      <path d="M180 115 L145 108 L147 118 L178 125 Z" fill="#E63946" />
    </svg>
  );
}

function DiabloVerde({ className }: BaseProps) {
  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="p2body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003322" />
          <stop offset="100%" stopColor="#001810" />
        </linearGradient>
      </defs>
      <path
        d="M120 20 C180 20 210 60 210 120 C210 165 200 210 180 240 L150 265 L120 275 L90 265 L60 240 C40 210 30 165 30 120 C30 60 60 20 120 20 Z"
        fill="url(#p2body)"
        stroke="#00A86B"
        strokeWidth="2"
      />
      <path d="M55 45 L30 5 L65 35 Z" fill="#00A86B" />
      <path d="M185 45 L210 5 L175 35 Z" fill="#00A86B" />
      <ellipse cx="90" cy="140" rx="24" ry="12" fill="#000" stroke="#fff" strokeWidth="2" />
      <ellipse cx="150" cy="140" rx="24" ry="12" fill="#000" stroke="#fff" strokeWidth="2" />
      <circle cx="88" cy="140" r="3" fill="#E63946" />
      <circle cx="148" cy="140" r="3" fill="#E63946" />
      <path
        d="M80 180 Q120 150 160 180 L160 210 Q120 235 80 210 Z"
        fill="#0A0A0A"
        stroke="#E63946"
        strokeWidth="2"
      />
      <g fill="#fff">
        <path d="M92 192 L100 215 L108 192 Z" />
        <path d="M108 192 L116 218 L124 192 Z" />
        <path d="M124 192 L132 218 L140 192 Z" />
        <path d="M140 192 L148 215 L156 192 Z" />
      </g>
      <g stroke="#00A86B" strokeWidth="1" fill="none" opacity="0.4">
        <path d="M50 100 Q70 92 90 100" />
        <path d="M150 100 Q170 92 190 100" />
        <path d="M45 125 Q65 117 85 125" />
        <path d="M155 125 Q175 117 195 125" />
      </g>
    </svg>
  );
}

function ElGalactico({ className }: BaseProps) {
  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="p3body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a14" />
        </linearGradient>
        <radialGradient id="p3star" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <path
        d="M120 20 C180 20 210 60 210 120 C210 170 195 220 170 255 L120 275 L70 255 C45 220 30 170 30 120 C30 60 60 20 120 20 Z"
        fill="url(#p3body)"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <g fill="#fff" opacity="0.8">
        <circle cx="55" cy="70" r="1.5" />
        <circle cx="190" cy="85" r="1" />
        <circle cx="45" cy="190" r="1.2" />
        <circle cx="200" cy="200" r="1.5" />
        <circle cx="100" cy="55" r="0.8" />
        <circle cx="150" cy="50" r="1" />
      </g>
      <path d="M95 45 L105 15 L120 30 L135 15 L145 45 L130 55 L120 42 L110 55 Z" fill="#00A86B" />
      <path d="M105 15 L135 15 L130 20 L110 20 Z" fill="#E63946" />
      <path d="M78 130 Q110 122 110 145 Q78 140 78 130 Z" fill="#000" stroke="#E63946" strokeWidth="2.5" />
      <path d="M162 130 Q130 122 130 145 Q162 140 162 130 Z" fill="#000" stroke="#E63946" strokeWidth="2.5" />
      <circle cx="88" cy="136" r="2.5" fill="#fff" />
      <circle cx="152" cy="136" r="2.5" fill="#fff" />
      <path d="M80 185 Q120 170 160 185 L158 205 Q120 220 82 205 Z" fill="#00A86B" opacity="0.6" />
      <path
        d="M100 190 L108 200 L116 190 L124 200 L132 190 L140 200 L148 190"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M120 90 L124 100 L135 102 L126 110 L128 122 L120 116 L112 122 L114 110 L105 102 L116 100 Z" fill="#F4C542" />
    </svg>
  );
}

export function HeroMaskPlaceholder({ className }: BaseProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1F1F1F" />
          <stop offset="100%" stopColor="#0F0F0F" />
        </linearGradient>
        <linearGradient id="heroAccents" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00A86B" />
          <stop offset="100%" stopColor="#008F5A" />
        </linearGradient>
      </defs>
      <path
        d="M150 30 C210 30 250 70 250 130 C250 180 235 230 210 260 C190 275 170 280 150 280 C130 280 110 275 90 260 C65 230 50 180 50 130 C50 70 90 30 150 30 Z"
        fill="url(#heroBody)"
        stroke="#2A2A2A"
        strokeWidth="1.5"
      />
      <path d="M90 70 L120 40 L140 70 Z" fill="url(#heroAccents)" />
      <path d="M210 70 L180 40 L160 70 Z" fill="url(#heroAccents)" />
      <path d="M130 55 L150 25 L170 55 Z" fill="#E63946" />
      <ellipse cx="110" cy="150" rx="28" ry="14" fill="#050505" stroke="#00A86B" strokeWidth="3" />
      <ellipse cx="190" cy="150" rx="28" ry="14" fill="#050505" stroke="#00A86B" strokeWidth="3" />
      <path d="M78 130 L142 118 L138 128 L80 140 Z" fill="#E63946" />
      <path d="M222 130 L158 118 L162 128 L220 140 Z" fill="#E63946" />
      <path d="M150 165 L135 200 L165 200 Z" fill="#0A0A0A" stroke="#3A3A3A" strokeWidth="1" />
      <path d="M115 215 Q150 230 185 215 L180 228 Q150 242 120 228 Z" fill="url(#heroAccents)" />
      <g stroke="#A0A0A5" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M70 140 L50 130" />
        <path d="M70 155 L48 155" />
        <path d="M70 170 L50 180" />
        <path d="M230 140 L250 130" />
        <path d="M230 155 L252 155" />
        <path d="M230 170 L250 180" />
      </g>
    </svg>
  );
}
