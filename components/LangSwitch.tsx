'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'

type Props = { locale: Locale; label: string }

// Cambia solo el primer segmento (el idioma) y conserva el resto de la ruta.
function swapLocale(pathname: string, target: Locale): string {
  const rest = pathname.split('/').slice(2).join('/')
  return `/${target}${rest ? `/${rest}` : ''}`
}

export default function LangSwitch({ locale, label }: Props) {
  const pathname = usePathname() ?? `/${locale}`

  return (
    <nav aria-label={label} className="flex items-center gap-2 text-sm">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-line">|</span>}
          <Link
            href={swapLocale(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? 'true' : undefined}
            className={l === locale ? 'text-accent' : 'text-muted hover:text-white'}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  )
}
