import { MASK_PALETTES } from '@/__data__/masks';
import { cn } from '@/__lib__/utils';
import type { AccentColor, MaskStyle, MaskPalette } from '@/__types__';

interface MaskArtProps {
  readonly maskStyle: MaskStyle;
  readonly accentColor: AccentColor;
  readonly className?: string;
  readonly label?: string;
}

const HEAD_PATH =
  'M120 20 C180 20 210 60 210 120 C210 160 198 200 180 225 L180 260 L120 275 L60 260 L60 225 C42 200 30 160 30 120 C30 60 60 20 120 20 Z';

const WIDE_HEAD_PATH =
  'M120 20 C185 20 214 62 214 122 C214 168 202 214 180 242 L150 266 L120 276 L90 266 L60 242 C38 214 26 168 26 122 C26 62 55 20 120 20 Z';

const WIDE_STYLES: ReadonlyArray<MaskStyle> = ['diablo', 'serpiente'];

interface EyeSpec {
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
  readonly useContrast: boolean;
}

const EYE_SPEC: Record<MaskStyle, EyeSpec> = {
  tiburon: { cy: 132, rx: 22, ry: 11, useContrast: false },
  diablo: { cy: 138, rx: 24, ry: 12, useContrast: false },
  galactico: { cy: 133, rx: 20, ry: 10, useContrast: true },
  aguila: { cy: 134, rx: 23, ry: 11, useContrast: false },
  serpiente: { cy: 136, rx: 21, ry: 12, useContrast: true },
  pantera: { cy: 132, rx: 24, ry: 10, useContrast: false },
};

function Eyes({ spec, palette }: { readonly spec: EyeSpec; readonly palette: MaskPalette }) {
  const stroke = spec.useContrast ? palette.contrast : palette.accent;

  return (
    <g>
      <ellipse
        cx="88"
        cy={spec.cy}
        rx={spec.rx}
        ry={spec.ry}
        fill="#050505"
        stroke={stroke}
        strokeWidth="2.5"
      />
      <ellipse
        cx="152"
        cy={spec.cy}
        rx={spec.rx}
        ry={spec.ry}
        fill="#050505"
        stroke={stroke}
        strokeWidth="2.5"
      />
      <circle cx="88" cy={spec.cy} r="3" fill={palette.accent} />
      <circle cx="152" cy={spec.cy} r="3" fill={palette.accent} />
    </g>
  );
}

function TopFeature({
  maskStyle,
  palette,
}: {
  readonly maskStyle: MaskStyle;
  readonly palette: MaskPalette;
}) {
  switch (maskStyle) {
    case 'tiburon':
      return (
        <g>
          <path d="M104 36 L120 6 L136 36 Z" fill={palette.accent} />
          <g stroke={palette.accent} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M62 108 Q48 116 46 130" />
            <path d="M60 128 Q44 136 42 150" />
            <path d="M178 108 Q192 116 194 130" />
            <path d="M180 128 Q196 136 198 150" />
          </g>
        </g>
      );
    case 'diablo':
      return (
        <g>
          <path d="M58 46 L26 4 L68 34 Z" fill={palette.accent} />
          <path d="M182 46 L214 4 L172 34 Z" fill={palette.accent} />
          <path d="M92 40 Q120 20 148 40" stroke={palette.contrast} strokeWidth="3" fill="none" />
        </g>
      );
    case 'galactico':
      return (
        <g>
          <path d="M95 44 L104 20 L120 34 L136 20 L145 44 L130 54 L120 42 L110 54 Z" fill={palette.accent} />
          <path d="M104 20 L136 20 L131 25 L109 25 Z" fill={palette.contrast} />
          <g fill={palette.contrast} opacity="0.75">
            <circle cx="56" cy="86" r="1.6" />
            <circle cx="190" cy="78" r="1.2" />
            <circle cx="48" cy="186" r="1.4" />
            <circle cx="196" cy="196" r="1.6" />
            <circle cx="84" cy="168" r="1" />
            <circle cx="162" cy="172" r="1" />
          </g>
        </g>
      );
    case 'aguila':
      return (
        <g>
          <path d="M90 38 L104 8 L120 28 L136 8 L150 38 L130 50 L120 38 L110 50 Z" fill={palette.accent} />
          <g fill={palette.contrast} opacity="0.85">
            <path d="M36 118 Q58 106 88 118 L86 128 Q58 118 38 128 Z" />
            <path d="M204 118 Q182 106 152 118 L154 128 Q182 118 202 128 Z" />
          </g>
        </g>
      );
    case 'serpiente':
      return (
        <g>
          <path d="M74 46 Q120 26 166 46" stroke={palette.accent} strokeWidth="3" fill="none" />
          <g fill={palette.accent} opacity="0.85">
            <path d="M44 96 Q56 88 68 96 Q56 104 44 96 Z" />
            <path d="M172 96 Q184 88 196 96 Q184 104 172 96 Z" />
            <path d="M40 128 Q52 120 64 128 Q52 136 40 128 Z" />
            <path d="M176 128 Q188 120 200 128 Q188 136 176 128 Z" />
            <path d="M48 162 Q60 154 72 162 Q60 170 48 162 Z" />
            <path d="M168 162 Q180 154 192 162 Q180 170 168 162 Z" />
          </g>
        </g>
      );
    case 'pantera':
      return (
        <g>
          <path d="M40 62 Q36 22 74 40 Q60 56 40 62 Z" fill={palette.accent} />
          <path d="M200 62 Q204 22 166 40 Q180 56 200 62 Z" fill={palette.accent} />
          <path d="M42 56 Q40 34 64 44 Q54 54 42 56 Z" fill={palette.baseDark} />
          <path d="M198 56 Q200 34 176 44 Q186 54 198 56 Z" fill={palette.baseDark} />
        </g>
      );
  }
}

function MouthFeature({
  maskStyle,
  palette,
}: {
  readonly maskStyle: MaskStyle;
  readonly palette: MaskPalette;
}) {
  switch (maskStyle) {
    case 'tiburon':
      return (
        <g>
          <path
            d="M84 178 L100 204 L116 178 L132 204 L148 178 L156 208 L76 208 Z"
            fill="#f4f4f5"
            stroke={palette.baseDark}
            strokeWidth="1"
          />
          <path d="M78 208 Q120 222 162 208" stroke={palette.accent} strokeWidth="2" fill="none" />
        </g>
      );
    case 'diablo':
      return (
        <g>
          <path
            d="M78 180 Q120 152 162 180 L162 208 Q120 234 78 208 Z"
            fill={palette.baseDark}
            stroke={palette.contrast}
            strokeWidth="2"
          />
          <g fill="#f4f4f5">
            <path d="M92 190 L100 214 L108 190 Z" />
            <path d="M110 190 L118 218 L126 190 Z" />
            <path d="M128 190 L136 214 L144 190 Z" />
          </g>
        </g>
      );
    case 'galactico':
      return (
        <g>
          <path
            d="M80 184 Q120 168 160 184 L158 206 Q120 222 82 206 Z"
            fill={palette.accent}
            opacity="0.55"
          />
          <path
            d="M100 190 L108 200 L116 190 L124 200 L132 190 L140 200"
            stroke="#f4f4f5"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case 'aguila':
      return (
        <g>
          <path d="M120 168 L138 200 L120 214 L102 200 Z" fill={palette.accent} />
          <path d="M120 178 L130 200 L120 208 L110 200 Z" fill={palette.baseDark} />
          <path d="M84 210 Q120 224 156 210" stroke={palette.contrast} strokeWidth="2" fill="none" />
        </g>
      );
    case 'serpiente':
      return (
        <g>
          <path
            d="M82 186 Q120 170 158 186 Q120 212 82 186 Z"
            fill={palette.baseDark}
            stroke={palette.accent}
            strokeWidth="2"
          />
          <path d="M104 186 L112 202 L120 186 Z" fill="#f4f4f5" />
          <path d="M136 186 L128 202 L120 186 Z" fill="#f4f4f5" />
          <path
            d="M120 200 L120 216 M120 216 L110 226 M120 216 L130 226"
            stroke={palette.contrast}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case 'pantera':
      return (
        <g>
          <path
            d="M96 184 Q120 172 144 184 Q140 206 120 212 Q100 206 96 184 Z"
            fill={palette.baseDark}
            stroke={palette.accent}
            strokeWidth="1.8"
          />
          <path d="M120 184 L120 196 L112 202 M120 196 L128 202" stroke={palette.accent} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <g stroke={palette.contrast} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9">
            <path d="M94 192 L66 186" />
            <path d="M94 200 L68 200" />
            <path d="M146 192 L174 186" />
            <path d="M146 200 L172 200" />
          </g>
        </g>
      );
  }
}

export function MaskArt({ maskStyle, accentColor, className, label }: MaskArtProps) {
  const palette = MASK_PALETTES[accentColor];
  const gradientId = `mask-body-${maskStyle}-${accentColor}`;
  const shineId = `mask-shine-${maskStyle}-${accentColor}`;
  const isWide = WIDE_STYLES.includes(maskStyle);

  return (
    <svg
      viewBox="0 0 240 300"
      className={cn('w-full h-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.base} />
          <stop offset="100%" stopColor={palette.baseDark} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={isWide ? WIDE_HEAD_PATH : HEAD_PATH}
        fill={`url(#${gradientId})`}
        stroke={palette.accent}
        strokeWidth="2"
      />
      <path
        d={isWide ? WIDE_HEAD_PATH : HEAD_PATH}
        fill={`url(#${shineId})`}
        stroke="none"
        opacity="0.9"
      />

      <TopFeature maskStyle={maskStyle} palette={palette} />
      <Eyes spec={EYE_SPEC[maskStyle]} palette={palette} />
      <MouthFeature maskStyle={maskStyle} palette={palette} />
    </svg>
  );
}
