import { describe, expect, it } from 'vitest'
import en from '@/i18n/dictionaries/en'
import es from '@/i18n/dictionaries/es'
import { cityLabel, paymentPlanRows, statusLabel } from '@/lib/content/labels'
import type { PaymentPlan } from '@/lib/content/schema'

const plan: PaymentPlan = {
  id: 'p',
  name: { en: 'p', es: 'p' },
  downPaymentPct: 30,
  installmentsPct: 40,
  onDeliveryPct: 30,
  installmentsMonths: 18,
  discountPct: 0,
}

describe('statusLabel y cityLabel', () => {
  it('traducen los enums según el diccionario', () => {
    expect(statusLabel('presale', en)).toBe('Presale')
    expect(statusLabel('construction', es)).toBe('En construcción')
    expect(statusLabel('ready', es)).toBe('Entrega inmediata')
    expect(cityLabel('cdmx', en)).toBe('Mexico City')
    expect(cityLabel('cdmx', es)).toBe('Ciudad de México')
  })
})

describe('paymentPlanRows', () => {
  it('lista enganche, mensualidades con meses, entrega y descuento', () => {
    expect(paymentPlanRows(plan, es)).toEqual([
      { label: 'Enganche', value: '30%' },
      { label: 'Mensualidades', value: '40% · 18 meses' },
      { label: 'Contra entrega', value: '30%' },
      { label: 'Descuento', value: '0%' },
    ])
  })

  it('muestra «—» cuando no hay mensualidades', () => {
    const rows = paymentPlanRows({ ...plan, downPaymentPct: 100, installmentsPct: 0, onDeliveryPct: 0, installmentsMonths: 0 }, en)
    expect(rows[1]).toEqual({ label: 'Monthly installments', value: '—' })
  })
})
