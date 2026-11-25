import { locales } from '@/i18n/config'
import { SITE_URL } from './site'

// Rutas (sin prefijo de idioma) que los buscadores pueden indexar. El resto lleva noindex.
const INDEXABLE_PATHS = ['/']

function normalize(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function localizedUrl(locale: string, path: string): string {
  const p = normalize(path)
  return `${SITE_URL}/${locale}${p === '/' ? '' : p}`
}

/** `path` es la ruta sin idioma, p. ej. '/' o '/about-this-demo'. */
export function buildAlternates(path: string, locale: string = 'en') {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = localizedUrl(l, path)
  languages['x-default'] = localizedUrl('en', path)
  return { canonical: localizedUrl(locale, path), languages }
}

export function isIndexablePath(path: string): boolean {
  return INDEXABLE_PATHS.includes(normalize(path))
}

export function robotsFor(path: string) {
  return isIndexablePath(path) ? { index: true, follow: true } : { index: false, follow: false }
}
