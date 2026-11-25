import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import FloorPlan from '@/components/FloorPlan'
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
      <FloorPlan
        locale={locale}
        rooms={t.rooms}
        title={`${d.floorPlan}: ${localize(t.name, locale)}`}
        sqm={d.sqm}
      />
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
