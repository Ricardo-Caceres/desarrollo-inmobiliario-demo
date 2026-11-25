import { notFound } from 'next/navigation'
import { hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-5xl md:text-7xl">{dict.meta.siteName}</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{dict.home.tagline}</p>
      <p className="mt-10 text-sm text-accent">{dict.home.notice}</p>
    </section>
  )
}
