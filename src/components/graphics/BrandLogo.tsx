import { cn } from '@/__lib__/utils';

interface BrandLogoProps {
  readonly className?: string;
  readonly label?: string;
}

/**
 * Logo vectorizado de Mascaritas GDL (máscara de luchador en emblema circular).
 * Renderizado como SVG inline para escalado perfecto en cualquier tamaño.
 */
export function BrandLogo({ className, label = 'Mascaritas GDL' }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className={cn('w-full h-full', className)}
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id="bl-ringGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f5c3a" />
          <stop offset="100%" stopColor="#0a3d27" />
        </radialGradient>

        <linearGradient id="bl-maskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a8a55" />
          <stop offset="100%" stopColor="#0f5c3a" />
        </linearGradient>

        <linearGradient id="bl-redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef5a66" />
          <stop offset="100%" stopColor="#c0262e" />
        </linearGradient>

        <path id="bl-textArc" d="M 90 300 A 160 160 0 0 0 410 300" fill="none" />
      </defs>

      {/* Outer dark green ring */}
      <circle cx="250" cy="250" r="240" fill="url(#bl-ringGrad)" stroke="#062819" strokeWidth="4" />

      {/* Inner cream ring */}
      <circle cx="250" cy="250" r="210" fill="#f3ede0" stroke="#0a3d27" strokeWidth="3" />

      {/* Mask background circle */}
      <circle cx="250" cy="235" r="165" fill="#0f5c3a" stroke="#0a3d27" strokeWidth="2" />

      {/* LUCHADOR MASK */}
      <g>
        {/* Mask head shape */}
        <path
          d="M 250 80 C 330 80, 380 140, 380 230 C 380 290, 360 330, 330 355 L 330 390 L 250 400 L 170 390 L 170 355 C 140 330, 120 290, 120 230 C 120 140, 170 80, 250 80 Z"
          fill="url(#bl-maskGrad)"
          stroke="#0a3d27"
          strokeWidth="3"
        />

        {/* Center seam */}
        <line x1="250" y1="85" x2="250" y2="395" stroke="#0a3d27" strokeWidth="2.5" strokeLinecap="round" />

        {/* Red eye-mask area */}
        <path
          d="M 150 175 C 150 155, 175 145, 205 150 C 225 153, 240 165, 250 175 C 260 165, 275 153, 295 150 C 325 145, 350 155, 350 175 C 350 200, 335 215, 310 220 C 285 224, 260 215, 250 205 C 240 215, 215 224, 190 220 C 165 215, 150 200, 150 175 Z"
          fill="url(#bl-redGrad)"
          stroke="#7a1820"
          strokeWidth="2.5"
        />

        {/* Nose */}
        <path d="M 230 205 L 250 260 L 270 205 Z" fill="#0f5c3a" stroke="#0a3d27" strokeWidth="2" />

        {/* Eyes */}
        <ellipse cx="200" cy="182" rx="22" ry="16" fill="#ffffff" stroke="#0a3d27" strokeWidth="2" />
        <ellipse cx="300" cy="182" rx="22" ry="16" fill="#ffffff" stroke="#0a3d27" strokeWidth="2" />

        {/* Red mouth area */}
        <path
          d="M 165 265 C 165 250, 195 245, 250 248 C 305 245, 335 250, 335 265 L 335 330 C 335 345, 305 355, 250 358 C 195 355, 165 345, 165 330 Z"
          fill="url(#bl-redGrad)"
          stroke="#7a1820"
          strokeWidth="2.5"
        />

        {/* Mouth interior */}
        <path
          d="M 180 275 C 200 270, 225 268, 250 270 C 275 268, 300 270, 320 275 L 320 320 C 300 326, 275 328, 250 327 C 225 328, 200 326, 180 320 Z"
          fill="#0a0a0a"
        />

        {/* Upper teeth */}
        <g fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.2">
          <path d="M 180 275 L 190 305 L 200 275 Z" />
          <path d="M 200 275 L 210 310 L 220 275 Z" />
          <path d="M 220 275 L 230 312 L 240 275 Z" />
          <path d="M 240 275 L 250 313 L 260 275 Z" />
          <path d="M 260 275 L 270 312 L 280 275 Z" />
          <path d="M 280 275 L 290 310 L 300 275 Z" />
          <path d="M 300 275 L 310 305 L 320 275 Z" />
        </g>

        {/* Lower teeth */}
        <g fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.2">
          <path d="M 195 320 L 205 300 L 215 320 Z" />
          <path d="M 215 320 L 225 298 L 235 320 Z" />
          <path d="M 235 320 L 250 296 L 265 320 Z" />
          <path d="M 265 320 L 275 298 L 285 320 Z" />
          <path d="M 285 320 L 295 300 L 305 320 Z" />
        </g>
      </g>

      {/* Side stars */}
      <g fill="#0a0a0a">
        <path d="M 75 250 L 80 263 L 94 263 L 83 271 L 87 284 L 75 276 L 63 284 L 67 271 L 56 263 L 70 263 Z" />
        <path d="M 425 250 L 430 263 L 444 263 L 433 271 L 437 284 L 425 276 L 413 284 L 417 271 L 406 263 L 420 263 Z" />
      </g>

      {/* Bottom curved text */}
      <text
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontSize="38"
        fontWeight="900"
        fill="#0f5c3a"
        letterSpacing="3"
      >
        <textPath href="#bl-textArc" startOffset="50%" textAnchor="middle">
          MASCARITAS GDL
        </textPath>
      </text>
    </svg>
  );
}
