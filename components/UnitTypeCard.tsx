import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import { formatNumber, formatPrice, localize } from '@/lib/content/queries'
import type { Development, UnitType } from '@/lib/content/schema'

type Props = {
  locale: Locale
  unitType: UnitType
  currency: Development['currency']
  /** Precio mínimo entre sus unidades disponibles; null si está agotado. */
  fromPrice: number | null
  dict: Pick<Dictionary, 'development'>
}

// Hueco del plano: F4 monta aquí el plano isométrico (data-slot="floor-plan").
function FloorPlanSlot() {
  return (
    <div
      data-slot="floor-plan"
      className="flex aspect-[4/3] items-center justify-center border border-line bg-black text-accent"
    >
      <svg viewBox="0 0 64 48" className="h-16 w-20 opacity-70" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
          <rect x="4" y="4" width="56" height="40" />
          <path d="M26 4 V26 H4 M26 26 H44 V44 M44 26 H60 M26 14 H34" />
          <path d="M44 36 a6 6 0 0 1 -6 -6" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  )
}

export default function UnitTypeCard({ locale, unitType: t, currency, fromPrice, dict }: Props) {
  const d = dict.development
  const specs = [
    { label: d.bedrooms, value: formatNumber(t.bedrooms, locale) },
    { label: d.bathrooms, value: formatNumber(t.bathrooms, locale) },
    { label: d.interior, value: `${formatNumber(t.interiorM2, locale)} ${d.sqm}` },
    { label: d.terrace, value: `${formatNumber(t.terraceM2, locale)} ${d.sqm}` },
  ]

  return (
    <article className="flex flex-col gap-6 border border-line bg-surface p-6">
      <FloorPlanSlot />
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-3xl">{localize(t.name, locale)}</h3>
        <p className="text-right text-sm">
          {fromPrice === null ? (
            <span className="text-muted">{d.soldOut}</span>
          ) : (
            <>
              <span className="mr-1 text-muted">{d.from}</span>
              <span className="text-accent">{formatPrice(fromPrice, currency, locale)}</span>
            </>
          )}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-4 border-t border-line pt-6">
        {specs.map((s) => (
          <div key={s.label}>
            <dt className="text-xs uppercase tracking-[0.15em] text-muted">{s.label}</dt>
            <dd className="mt-1 text-sm">{s.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
