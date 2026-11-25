export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

const intlLocales: Record<Locale, string> = { en: 'en-US', es: 'es-MX' }

export function toIntlLocale(locale: Locale): string {
  return intlLocales[locale]
}
