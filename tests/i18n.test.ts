import { describe, expect, it } from 'vitest'
import { hasLocale, toIntlLocale } from '@/i18n/config'
import en from '@/i18n/dictionaries/en'
import es from '@/i18n/dictionaries/es'

function flatten(obj: object, prefix = ''): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') Object.assign(acc, flatten(value, path))
    else acc[path] = value
    return acc
  }, {})
}

describe('diccionarios', () => {
  const flatEn = flatten(en)
  const flatEs = flatten(es)

  it('en y es tienen las mismas claves', () => {
    expect(Object.keys(flatEs).sort()).toEqual(Object.keys(flatEn).sort())
  })

  it('ninguna cadena está vacía', () => {
    for (const flat of [flatEn, flatEs]) {
      for (const [key, value] of Object.entries(flat)) {
        expect(typeof value, key).toBe('string')
        expect((value as string).trim(), key).not.toBe('')
      }
    }
  })
})

describe('config i18n', () => {
  it('hasLocale acepta solo en y es', () => {
    expect(hasLocale('en')).toBe(true)
    expect(hasLocale('es')).toBe(true)
    expect(hasLocale('fr')).toBe(false)
  })

  it('toIntlLocale mapea a en-US y es-MX', () => {
    expect(toIntlLocale('en')).toBe('en-US')
    expect(toIntlLocale('es')).toBe('es-MX')
  })
})
