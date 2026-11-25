import { useId } from 'react'
import type { Locale } from '@/i18n/config'
import { formatNumber, localize } from '@/lib/content/queries'
import type { Room } from '@/lib/content/schema'
import { buildIsometricPlan } from '@/lib/floor-plan/isometric'

type Props = {
  locale: Locale
  rooms: Room[]
  /** Nombre accesible del dibujo, p. ej. «Plano: Estudio». */
  title: string
  sqm: string
}

// Opacidad del piso por tipo: lo húmedo y lo exterior se distinguen sin salir de la paleta dorada.
const floorOpacity: Record<Room['kind'], number> = {
  living: 0.1,
  kitchen: 0.16,
  bedroom: 0.06,
  study: 0.06,
  bathroom: 0.24,
  powder: 0.24,
  laundry: 0.16,
  terrace: 0.03,
  pool: 0.34,
}

export default function FloorPlan({ locale, rooms, title, sqm }: Props) {
  const titleId = useId()
  const plan = buildIsometricPlan(rooms)
  const number = new Map(rooms.map((r, i) => [r.id, i + 1]))

  return (
    <figure data-slot="floor-plan" className="flex flex-col gap-4">
      <div className="border border-line bg-black px-2 py-4 text-accent">
        <svg viewBox={plan.viewBox} role="img" aria-labelledby={titleId} className="h-auto w-full">
          <title id={titleId}>{title}</title>
          <g strokeLinejoin="round">
            {plan.floors.map((f) => (
              <polygon
                key={f.id}
                points={f.points}
                fill="currentColor"
                fillOpacity={floorOpacity[f.kind]}
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={0.75}
                strokeDasharray={f.kind === 'terrace' ? '3 3' : undefined}
              />
            ))}
            {plan.walls.map((w) => (
              <g key={w.key}>
                <polygon points={w.points} fill="currentColor" fillOpacity={w.kind === 'wall' ? 0.14 : 0.04} />
                <polyline points={w.top} fill="none" stroke="currentColor" strokeWidth={w.kind === 'wall' ? 1.5 : 1} strokeOpacity={w.kind === 'wall' ? 0.9 : 0.5} />
              </g>
            ))}
          </g>
          <g aria-hidden="true">
            {plan.floors.map((f) => (
              <g key={f.id} transform={`translate(${f.marker[0]} ${f.marker[1]})`}>
                <circle r={11} fill="#000" stroke="currentColor" strokeWidth={1} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={12} fill="currentColor">
                  {number.get(f.id)}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      <figcaption>
        <ol className="flex flex-col gap-1.5 text-xs text-muted">
          {rooms.map((r) => (
            <li key={r.id} className="flex items-baseline gap-2">
              <span className="w-4 shrink-0 text-right text-accent tabular-nums">{number.get(r.id)}</span>
              <span className="flex-1">{localize(r.label, locale)}</span>
              <span className="tabular-nums">
                {formatNumber(r.w * r.h, locale)} {sqm}
              </span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  )
}
