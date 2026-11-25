import type { Development } from '@/lib/content/schema'

type Props = {
  city: Development['city']
  /** Etiqueta de la zona verde (parque/selva), ya localizada. */
  greenLabel?: string
  /** Etiqueta del pin (colonia), ya localizada. */
  pinLabel?: string
  className?: string
}

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Streets({ city }: { city: Props['city'] }) {
  if (city === 'tulum') {
    return (
      <g {...line} strokeOpacity={0.5}>
        <path d="M200 0 C 190 90 215 170 200 300" strokeWidth={2.5} />
        <path d="M0 110 C 100 100 150 130 200 120 S 320 90 400 105" />
        <path d="M0 210 C 80 220 150 195 200 205 S 330 230 400 215" />
        <path d="M290 0 C 285 60 300 120 296 300" />
        <path d="M110 0 C 120 40 100 80 108 120" />
      </g>
    )
  }
  return (
    <g {...line} strokeOpacity={0.5}>
      {[60, 120, 180, 240].map((y) => (
        <path key={y} d={`M0 ${y} H400`} />
      ))}
      {[70, 140, 210, 280, 350].map((x) => (
        <path key={x} d={`M${x} 0 V300`} />
      ))}
      <path d="M0 290 L400 10" strokeWidth={2.5} />
    </g>
  )
}

export default function IllustratedMap({ city, greenLabel, pinLabel, className }: Props) {
  // Zona verde y pin por ciudad: selva al suroeste en Tulum, parque al noreste en CDMX.
  const green =
    city === 'tulum'
      ? 'M20 190 C 20 150 80 140 120 160 C 160 175 170 230 130 260 C 90 285 20 270 20 190 Z'
      : 'M250 30 H350 Q 366 30 366 46 V104 Q 366 118 350 118 H250 Q 236 118 236 104 V46 Q 236 30 250 30 Z'
  const greenLabelPos = city === 'tulum' ? { x: 70, y: 214 } : { x: 301, y: 78 }
  const pin = city === 'tulum' ? { x: 240, y: 160 } : { x: 170, y: 150 }

  return (
    <svg
      viewBox="0 0 400 300"
      className={`text-accent ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0.5" y="0.5" width="399" height="299" fill="currentColor" fillOpacity={0.03} stroke="currentColor" strokeOpacity={0.3} />
      <Streets city={city} />
      <path d={green} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeOpacity={0.6} strokeWidth={1} />
      {greenLabel && (
        <text x={greenLabelPos.x} y={greenLabelPos.y} textAnchor="middle" fontSize="13" fill="currentColor" fillOpacity={0.85} className="font-sans">
          {greenLabel}
        </text>
      )}
      <circle cx={pin.x} cy={pin.y} r="22" fill="currentColor" fillOpacity={0.1} />
      <g transform={`translate(${pin.x} ${pin.y})`}>
        <path d="M0 0 C -8 -12 -13 -19 -13 -26 a13 13 0 1 1 26 0 C 13 -19 8 -12 0 0 Z" fill="currentColor" />
        <circle cy="-26" r="5" fill="#000" />
      </g>
      {pinLabel && (
        <text x={pin.x} y={pin.y + 22} textAnchor="middle" fontSize="13" fill="currentColor" className="font-sans">
          {pinLabel}
        </text>
      )}
    </svg>
  )
}
