import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import DemoBanner from '@/components/DemoBanner'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { hasLocale, locales, toIntlLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { buildAlternates } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'
import '@/styles/globals.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})
const sans = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locale)) return {}
  const dict = getDictionary(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteName, template: '%s · Orvale (demo)' },
    description: dict.meta.description,
    alternates: buildAlternates('/', locale),
    openGraph: { locale: toIntlLocale(locale).replace('-', '_'), siteName: dict.meta.siteName },
  }
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col bg-black font-sans text-white">
        <DemoBanner locale={locale} dict={dict.demoBanner} />
        <SiteHeader locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter dict={dict.footer} />
      </body>
    </html>
  )
}
