import { describe, expect, it } from 'vitest'
import { localContent } from '@/lib/content/local'
import { availableUnits, formatPrice, localize, priceRange, unitsByType, unitType } from '@/lib/content/queries'

const dev = () => structuredClone(localContent.developments[0])

describe('localize', () => {
  it('elige el idioma pedido', () => {
    const text = { en: 'Hello', es: 'Hola' }
    expect(localize(text, 'en')).toBe('Hello')
    expect(localize(text, 'es')).toBe('Hola')
  })
})

describe('priceRange', () => {
  it('solo considera unidades disponibles', () => {
    const d = dev()
    d.units.forEach((u, i) => {
      u.status = i === 0 ? 'available' : i === 1 ? 'reserved' : 'sold'
      u.price = 100_000 * (i + 1)
    })
    expect(priceRange(d)).toEqual({ min: 100_000, max: 100_000 })
    expect(availableUnits(d)).toHaveLength(1)
  })

  it('devuelve null sin disponibles', () => {
    const d = dev()
    d.units.forEach((u) => (u.status = 'sold'))
    expect(priceRange(d)).toBeNull()
  })
})

describe('unitType y unitsByType', () => {
  it('encuentra el prototipo y agrupa las unidades', () => {
    const d = dev()
    expect(unitType(d, 'studio')?.id).toBe('studio')
    expect(unitType(d, 'nope')).toBeUndefined()
    const grouped = unitsByType(d)
    expect([...grouped.keys()].sort()).toEqual(d.unitTypes.map((t) => t.id).sort())
    expect([...grouped.values()].flat()).toHaveLength(d.units.length)
  })
})

describe('formatPrice', () => {
  it('formatea USD y MXN sin decimales en es y en', () => {
    expect(formatPrice(210_000, 'USD', 'en')).toBe(
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(210_000),
    )
    expect(formatPrice(14_500_000, 'MXN', 'es')).toMatch(/14,500,000/)
    expect(formatPrice(14_500_000, 'MXN', 'en')).not.toMatch(/\./)
    expect(formatPrice(210_000, 'USD', 'es')).toMatch(/210,000/)
  })
})
