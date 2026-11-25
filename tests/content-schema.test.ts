import { describe, expect, it } from 'vitest'
import { localContent } from '@/lib/content/local'
import { contentSchema, localizedText } from '@/lib/content/schema'

const clone = () => structuredClone(localContent)

describe('contenido local', () => {
  it('valida con contentSchema', () => {
    expect(contentSchema.safeParse(localContent).success).toBe(true)
  })

  it('ambos desarrollos tienen unidades disponibles', () => {
    for (const dev of localContent.developments) {
      expect(dev.units.some((u) => u.status === 'available')).toBe(true)
    }
  })

  it('las habitaciones de cada prototipo no se solapan', () => {
    for (const dev of localContent.developments) {
      for (const type of dev.unitTypes) {
        type.rooms.forEach((a, i) => {
          for (const b of type.rooms.slice(i + 1)) {
            const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
            expect(overlap, `${dev.slug}/${type.id}: ${a.id} vs ${b.id}`).toBe(false)
          }
        })
      }
    }
  })
})

describe('contentSchema rechaza', () => {
  it('una unidad con typeId inexistente', () => {
    const c = clone()
    c.developments[0].units[0].typeId = 'no-existe'
    const result = contentSchema.safeParse(c)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['developments', 0, 'units', 0, 'typeId'])
  })

  it('ids de unidad duplicados', () => {
    const c = clone()
    c.developments[0].units[1].id = c.developments[0].units[0].id
    expect(contentSchema.safeParse(c).success).toBe(false)
  })

  it('slugs duplicados', () => {
    const c = clone()
    c.developments[1].slug = c.developments[0].slug
    expect(contentSchema.safeParse(c).success).toBe(false)
  })

  it('un plan de pagos que no suma 100', () => {
    const c = clone()
    c.developments[0].paymentPlans[1].downPaymentPct = 25
    expect(contentSchema.safeParse(c).success).toBe(false)
  })

  it('un plan con mensualidades y 0 meses', () => {
    const c = clone()
    c.developments[0].paymentPlans[2].installmentsMonths = 0
    expect(contentSchema.safeParse(c).success).toBe(false)
  })

  it('un texto localizado vacío', () => {
    expect(localizedText.safeParse({ en: 'Hi', es: '  ' }).success).toBe(false)
    const c = clone()
    c.developments[0].tagline.es = ''
    expect(contentSchema.safeParse(c).success).toBe(false)
  })
})
