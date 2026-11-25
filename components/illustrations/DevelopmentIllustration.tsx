import type { Development } from '@/lib/content/schema'

type Props = { city: Development['city']; className?: string }

// Trazo fino con currentColor (el color lo da text-accent del contenedor); rellenos con opacidad baja.
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Palm({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} {...line} opacity={0.85}>
      <path d="M0 0 Q 5 -40 -2 -80" />
      <path d="M-2 -80 Q -20 -96 -40 -78" />
      <path d="M-2 -80 Q 16 -98 38 -80" />
      <path d="M-2 -80 Q -14 -106 -32 -108" />
      <path d="M-2 -80 Q 12 -106 32 -108" />
      <path d="M-2 -80 L -2 -114" />
    </g>
  )
}

function Tulum() {
  const levels = [0, 1, 2, 3]
  return (
    <>
      <g {...line}>
        <circle cx="318" cy="72" r="26" fill="currentColor" fillOpacity={0.12} />
        <circle cx="318" cy="72" r="38" strokeOpacity={0.35} />
        <path d="M262 112 H374 M276 120 H360" strokeOpacity={0.35} />
      </g>
      {/* edificio bajo: cada nivel retrocede y deja una terraza con barandal */}
      <g {...line}>
        {levels.map((i) => {
          const inset = i * 14
          const x = 96 + inset
          const w = 208 - inset * 2
          const y = 214 - i * 38
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={34} fill="currentColor" fillOpacity={0.06 + i * 0.015} />
              {Array.from({ length: Math.floor((w - 24) / 34) }, (_, j) => (
                <rect
                  key={j}
                  x={x + 14 + j * 34}
                  y={y + 8}
                  width={20}
                  height={20}
                  fill="currentColor"
                  fillOpacity={(i + j) % 3 === 0 ? 0.3 : 0.08}
                />
              ))}
              {/* losa volada y barandal */}
              <path d={`M${x - 10} ${y + 34} H${x + w + 10}`} strokeWidth={2} />
              <path d={`M${x - 10} ${y + 34} V${y + 26} M${x + w + 10} ${y + 34} V${y + 26}`} strokeOpacity={0.6} />
            </g>
          )
        })}
      </g>
      <Palm x={52} y={252} scale={1.1} />
      <Palm x={348} y={252} scale={0.95} />
      <Palm x={72} y={252} scale={0.7} />
      <g {...line} strokeOpacity={0.6}>
        <path d="M20 252 H380" strokeOpacity={1} />
        <path d="M118 252 q8 -14 18 0 M270 252 q8 -12 18 0 M300 252 q6 -10 14 0" />
      </g>
    </>
  )
}

function Cdmx() {
  const floors = 12
  const floorH = 17
  const top = 252 - floors * floorH
  const skyline = [
    { x: 40, w: 36, h: 70 },
    { x: 80, w: 28, h: 110 },
    { x: 112, w: 36, h: 84 },
    { x: 262, w: 32, h: 96 },
    { x: 298, w: 40, h: 124 },
    { x: 342, w: 30, h: 76 },
  ]
  return (
    <>
      <g {...line}>
        <circle cx="330" cy="54" r="16" fill="currentColor" fillOpacity={0.1} />
        {skyline.map((b) => (
          <rect key={b.x} x={b.x} y={252 - b.h} width={b.w} height={b.h} strokeOpacity={0.4} fill="currentColor" fillOpacity={0.04} />
        ))}
      </g>
      {/* torre esbelta de 12 niveles */}
      <g {...line}>
        <rect x="160" y={top} width="80" height={floors * floorH} fill="currentColor" fillOpacity={0.07} />
        <path d={`M170 ${top} V${top - 14} H230 V${top}`} />
        <path d={`M200 ${top - 14} V${top - 40}`} />
        {Array.from({ length: floors - 1 }, (_, i) => (
          <path key={i} d={`M160 ${top + (i + 1) * floorH} H240`} strokeOpacity={0.5} />
        ))}
        {Array.from({ length: floors }, (_, i) =>
          [0, 1, 2].map((j) => (
            <rect
              key={`${i}-${j}`}
              x={168 + j * 24}
              y={top + i * floorH + 4}
              width={16}
              height={9}
              fill="currentColor"
              fillOpacity={(i * 7 + j * 3) % 4 === 0 ? 0.4 : 0.08}
              strokeOpacity={0.7}
            />
          )),
        )}
      </g>
      {/* árboles del parque */}
      <g {...line}>
        {[
          { x: 54, r: 16 },
          { x: 92, r: 12 },
          { x: 134, r: 14 },
          { x: 272, r: 13 },
          { x: 318, r: 17 },
          { x: 356, r: 12 },
        ].map((t) => (
          <g key={t.x}>
            <path d={`M${t.x} 252 V${252 - t.r - 6}`} />
            <circle cx={t.x} cy={252 - t.r * 2 - 6} r={t.r} fill="currentColor" fillOpacity={0.12} />
          </g>
        ))}
        <path d="M20 252 H380" />
      </g>
    </>
  )
}

export default function DevelopmentIllustration({ city, className }: Props) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={`text-accent ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {city === 'tulum' ? <Tulum /> : <Cdmx />}
    </svg>
  )
}
