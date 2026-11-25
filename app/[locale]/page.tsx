import { notFound } from 'next/navigation'
import DevelopmentCard from '@/components/DevelopmentCard'
import HeroSkyline from '@/components/illustrations/HeroSkyline'
import SectionHeading from '@/components/SectionHeading'
import { hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { getContentRepository } from '@/lib/content'
import { localize } from '@/lib/content/queries'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const repository = getContentRepository()
  const [developer, developments] = await Promise.all([repository.getDeveloper(), repository.listDevelopments()])

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <HeroSkyline className="pointer-events-none absolute inset-0 h-full w-full opacity-60 md:opacity-100" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-44">
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">{developer.name}</h1>
          <p className="mt-6 max-w-xl font-display text-2xl text-accent md:text-3xl">
            {localize(developer.tagline, locale)}
          </p>
          <a
            href="#developments"
            className="mt-12 inline-block bg-accent-strong px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-black transition-colors hover:bg-accent"
          >
            {dict.home.viewDevelopments}
          </a>
        </div>
      </section>

      <section id="developments" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <SectionHeading eyebrow={dict.home.developmentsEyebrow} title={dict.home.developmentsTitle} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {developments.map((development) => (
            <DevelopmentCard key={development.slug} locale={locale} development={development} dict={dict} />
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <SectionHeading eyebrow={dict.home.aboutEyebrow} title={dict.home.aboutTitle} />
          <p className="text-lg leading-relaxed text-muted">{localize(developer.about, locale)}</p>
        </div>
      </section>
    </>
  )
}
