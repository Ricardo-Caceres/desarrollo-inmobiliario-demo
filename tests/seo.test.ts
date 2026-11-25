import { describe, expect, it } from 'vitest'
import { buildAlternates, isIndexablePath } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

describe('buildAlternates', () => {
  it('devuelve en, es y x-default absolutos para la home', () => {
    const { canonical, languages } = buildAlternates('/', 'es')
    expect(canonical).toBe(`${SITE_URL}/es`)
    expect(languages).toEqual({
      en: `${SITE_URL}/en`,
      es: `${SITE_URL}/es`,
      'x-default': `${SITE_URL}/en`,
    })
  })

  it('conserva la ruta en subpáginas', () => {
    expect(buildAlternates('/about-this-demo').languages.es).toBe(`${SITE_URL}/es/about-this-demo`)
  })
})

describe('isIndexablePath', () => {
  it('la home es indexable', () => {
    expect(isIndexablePath('/')).toBe(true)
  })

  it('otras rutas no lo son todavía', () => {
    expect(isIndexablePath('/nope')).toBe(false)
  })
})
