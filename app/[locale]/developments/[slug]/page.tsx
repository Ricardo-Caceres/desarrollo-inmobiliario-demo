import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PaymentPlanCard from '@/components/PaymentPlanCard'
import DevelopmentIllustration from '@/components/illustrations/DevelopmentIllustration'
import IllustratedMap from '@/components/illustrations/IllustratedMap'
import SectionHeading from '@/components/SectionHeading'
import UnitTypeCard from '@/components/UnitTypeCard'
import { hasLocale, locales } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getContentRepository } from '@/lib/content'
import { cityLabel, statusLabel } from '@/lib/content/labels'
import {
  availableUnits,
  formatDelivery,
  formatPrice,
  localize,
  minAvailablePrice,
  priceRange,
  unitsByType,
} from '@/lib/content/queries'
import { buildAlternates, robotsFor } from '@/lib/seo'

export const dynamicParams = false

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const developments = await getContentRepository().listDevelopments()
  return locales.flatMap((locale) => developments.map((d) => ({ locale, slug: d.slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(locale)) return {}
  const dev = await getContentRepository().getDevelopment(slug)
  if (!dev) return {}
  const path = `/developments/${slug}`
  return {
    title: dev.name,
    description: `${localize(dev.tagline, locale)} — demo`,
    alternates: buildAlternates(path, locale),
    robots: robotsFor(path),
  }
}

export default async function DevelopmentPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(locale)) notFound()
  const dev = await getContentRepository().getDevelopment(slug)
  if (!dev) notFound()
  const dict = getDictionary(locale)
  const d = dict.development

  const range = priceRange(dev)
  const byType = unitsByType(dev)
  const keyFacts = [
    { label: d.status, value: statusLabel(dev.status, dict) },
    { label: d.delivery, value: formatDelivery(dev.deliveryDate, locale) },
    { label: d.from, value: range ? formatPrice(range.min, dev.currency, locale) : d.soldOut },
    { label: d.available, value: `${availableUnits(dev).length} / ${dev.units.length}` },
  ]
  const section = 'mx-auto max-w-6xl px-6 py-16 md:py-24'

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              {localize(dev.neighborhood, locale)} · {cityLabel(dev.city, dict)}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">{dev.name}</h1>
            <p className="mt-6 max-w-md font-display text-2xl text-muted md:text-3xl">{localize(dev.tagline, locale)}</p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8">
              {keyFacts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs uppercase tracking-[0.15em] text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-base">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="border border-line bg-surface px-4 pt-8 md:px-8">
            <DevelopmentIllustration city={dev.city} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className={section}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-16">
          <SectionHeading title={d.aboutTitle} />
          <p className="text-lg leading-relaxed text-muted">{localize(dev.description, locale)}</p>
        </div>
      </section>

      {dev.amenities.length > 0 && (
        <section className="border-t border-line">
          <div className={section}>
            <SectionHeading title={d.amenitiesTitle} />
            <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {dev.amenities.map((amenity) => (
                <li key={amenity.id} className="flex items-start gap-3 border-b border-line pb-5">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-accent-strong" />
                  <span>{localize(amenity.label, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className={section}>
          <SectionHeading title={d.unitTypesTitle} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dev.unitTypes.map((type) => (
              <UnitTypeCard
                key={type.id}
                locale={locale}
                unitType={type}
                currency={dev.currency}
                fromPrice={minAvailablePrice(byType.get(type.id) ?? [])}
                dict={dict}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className={section}>
          <SectionHeading title={d.paymentPlansTitle} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {dev.paymentPlans.map((plan) => (
              <PaymentPlanCard key={plan.id} locale={locale} plan={plan} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className={`${section} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
          <div>
            <SectionHeading title={d.locationTitle} />
            <p className="mt-6 text-lg text-muted">{localize(dev.address, locale)}</p>
            <Link
              href={`/${locale}#developments`}
              className="mt-10 inline-block text-sm text-accent underline-offset-4 hover:underline"
            >
              <span aria-hidden="true">← </span>
              {d.allDevelopments}
            </Link>
          </div>
          <IllustratedMap
            city={dev.city}
            greenLabel={dict.mapGreen[dev.city]}
            pinLabel={localize(dev.neighborhood, locale)}
            className="h-auto w-full"
          />
        </div>
      </section>
    </>
  )
}
