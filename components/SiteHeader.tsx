import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import LangSwitch from './LangSwitch'

type Props = { locale: Locale; dict: Dictionary }

export default function SiteHeader({ locale, dict }: Props) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href={`/${locale}`} className="font-display text-2xl tracking-wide">
          Orvale
        </Link>
        <div className="flex items-center gap-5 sm:gap-8">
          <Link href={`/${locale}#developments`} className="text-sm text-muted hover:text-white">
            {dict.nav.developments}
          </Link>
          <LangSwitch locale={locale} label={dict.nav.language} />
        </div>
      </div>
    </header>
  )
}
