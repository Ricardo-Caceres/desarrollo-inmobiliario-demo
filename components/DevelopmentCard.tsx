import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import { cityLabel, statusLabel } from '@/lib/content/labels'
import { availableUnits, formatDelivery, formatPrice, localize, priceRange } from '@/lib/content/queries'
import type { Development } from '@/lib/content/schema'
import DevelopmentIllustration from './illustrations/DevelopmentIllustration'

type Props = {
  locale: Locale
  development: Development
  dict: Pick<Dictionary, 'status' | 'cities' | 'development'>
}

export default function DevelopmentCard({ locale, development: dev, dict }: Props) {
  const range = priceRange(dev)
  const facts = [
    { label: dict.development.delivery, value: formatDelivery(dev.deliveryDate, locale) },
    {
      label: dict.development.from,
      value: range ? formatPrice(range.min, dev.currency, locale) : dict.development.soldOut,
    },
    { label: dict.development.available, value: `${availableUnits(dev).length} / ${dev.units.length}` },
  ]

  return (
    <article className="group relative flex flex-col border border-line bg-surface transition-colors focus-within:border-accent-strong hover:border-accent-strong">
      <div className="border-b border-line bg-black px-4 pt-6">
        <DevelopmentIllustration city={dev.city} className="h-auto w-full" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{statusLabel(dev.status, dict)}</p>
        <h3 className="mt-3 font-display text-3xl md:text-4xl">
          <Link href={`/${locale}/developments/${dev.slug}`} className="after:absolute after:inset-0">
            {dev.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">
          {localize(dev.neighborhood, locale)} · {cityLabel(dev.city, dict)}
        </p>
        <p className="mt-4 text-muted">{localize(dev.tagline, locale)}</p>
        <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs uppercase tracking-[0.15em] text-muted">{fact.label}</dt>
              <dd className="mt-1 text-sm text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
