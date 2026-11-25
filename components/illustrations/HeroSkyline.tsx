type Props = { className?: string }

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// Horizonte abstracto: sol a medio ocultar, líneas de horizonte que se desvanecen y siluetas mínimas.
const towers = [
  { x: 640, w: 46, h: 190 },
  { x: 700, w: 34, h: 130 },
  { x: 748, w: 54, h: 240 },
  { x: 816, w: 38, h: 150 },
  { x: 868, w: 44, h: 200 },
  { x: 930, w: 30, h: 100 },
  { x: 976, w: 50, h: 160 },
]

export default function HeroSkyline({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 500"
      className={`text-accent ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMaxYMax slice"
    >
      <g {...line}>
        <circle cx="520" cy="360" r="120" strokeOpacity={0.5} fill="currentColor" fillOpacity={0.05} />
        <circle cx="520" cy="360" r="170" strokeOpacity={0.2} />
        <circle cx="520" cy="360" r="230" strokeOpacity={0.1} />
        {towers.map((t, i) => (
          <g key={t.x}>
            <rect x={t.x} y={400 - t.h} width={t.w} height={t.h} strokeOpacity={0.55} fill="#000" />
            {Array.from({ length: Math.floor(t.h / 22) }, (_, j) => (
              <path key={j} d={`M${t.x} ${400 - t.h + 22 * (j + 1)} H${t.x + t.w}`} strokeOpacity={(i + j) % 4 === 0 ? 0.4 : 0.12} />
            ))}
          </g>
        ))}
        <path d="M80 400 H1200" strokeOpacity={0.9} />
        {[412, 426, 444, 466, 492].map((y, i) => (
          <path key={y} d={`M${200 + i * 60} ${y} H1200`} strokeOpacity={0.35 - i * 0.06} />
        ))}
        <path d="M0 400 H80" strokeOpacity={0.3} />
      </g>
    </svg>
  )
}
