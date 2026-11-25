import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import { CAL_URL, PORTFOLIO_URL } from '@/lib/site'

type Props = { locale: Locale; dict: Dictionary['demoBanner'] }

export default function DemoBanner({ locale, dict }: Props) {
  const contactUrl = `${PORTFOLIO_URL}${locale === 'es' ? '/es' : ''}/contact`
  const linkClass = 'underline underline-offset-2 hover:text-black/70'

  return (
    <div className="sticky top-0 z-50 bg-accent px-4 py-2 text-center text-xs font-medium text-black">
      <span>
        {dict.label} · {dict.credit} · {dict.cta}{' '}
      </span>
      <a className={linkClass} href={contactUrl} target="_blank" rel="noopener noreferrer">
        {dict.contact}
      </a>
      {' · '}
      <a className={linkClass} href={CAL_URL} target="_blank" rel="noopener noreferrer">
        {dict.book}
      </a>
    </div>
  )
}
