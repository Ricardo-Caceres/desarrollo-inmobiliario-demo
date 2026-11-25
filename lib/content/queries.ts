import type { Locale } from '@/i18n/config'
import { toIntlLocale } from '@/i18n/config'
import type { Development, LocalizedText, Unit, UnitType } from './schema'

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale]
}

export function availableUnits(dev: Development): Unit[] {
  return dev.units.filter((u) => u.status === 'available')
}

/** Rango de precios solo sobre unidades disponibles; null si no hay ninguna. */
export function priceRange(dev: Development): { min: number; max: number } | null {
  const prices = availableUnits(dev).map((u) => u.price)
  if (prices.length === 0) return null
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export function unitType(dev: Development, typeId: string): UnitType | undefined {
  return dev.unitTypes.find((t) => t.id === typeId)
}

export function unitsByType(dev: Development): Map<string, Unit[]> {
  const map = new Map<string, Unit[]>()
  for (const unit of dev.units) {
    const list = map.get(unit.typeId)
    if (list) list.push(unit)
    else map.set(unit.typeId, [unit])
  }
  return map
}

export function formatPrice(amount: number, currency: Development['currency'], locale: Locale): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Precio mínimo entre las unidades disponibles de una lista; null si no hay ninguna. */
export function minAvailablePrice(units: Unit[]): number | null {
  const prices = units.filter((u) => u.status === 'available').map((u) => u.price)
  return prices.length === 0 ? null : Math.min(...prices)
}

/** '2028-06' → «June 2028» / «junio de 2028». Se fija UTC para que el mes no dependa de la zona horaria. */
export function formatDelivery(deliveryDate: string, locale: Locale): string {
  const [year, month] = deliveryDate.split('-').map(Number)
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(toIntlLocale(locale), { maximumFractionDigits: 1 }).format(value)
}
