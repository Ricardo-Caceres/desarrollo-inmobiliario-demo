import type { Unit } from '../schema'

type View = Unit['view']

interface UnitsSpec {
  /** Prefijo del id, p. ej. 'A' genera 'A-101'. */
  prefix: string
  /** Prototipos por nivel, en orden de columna. */
  floors: { floor: number; typeIds: string[] }[]
  /** Precio base por prototipo, en la moneda del desarrollo. */
  basePrice: Record<string, number>
  /** Prima por nivel sobre el primero (0.04 = 4% por piso). */
  floorStep: number
  /** Prima por vista (las no listadas valen 0). */
  viewPremium: Partial<Record<View, number>>
  /** Vista según prototipo y columna. */
  viewFor: (typeId: string, column: number) => View
}

// Genera unidades de forma determinista: sin azar, el estatus sigue un patrón fijo (~60% disponibles).
export function buildUnits(spec: UnitsSpec): Unit[] {
  const firstFloor = Math.min(...spec.floors.map((f) => f.floor))
  const statusCycle: Unit['status'][] = ['available', 'sold', 'available', 'reserved', 'available']
  return spec.floors.flatMap(({ floor, typeIds }) =>
    typeIds.map((typeId, column) => {
      const view = spec.viewFor(typeId, column)
      const factor = (1 + spec.floorStep * (floor - firstFloor)) * (1 + (spec.viewPremium[view] ?? 0))
      return {
        id: `${spec.prefix}-${floor * 100 + column + 1 + (firstFloor === 0 ? 100 : 0)}`,
        typeId,
        floor,
        view,
        price: Math.round((spec.basePrice[typeId] * factor) / 1000) * 1000,
        status: statusCycle[(column + floor) % statusCycle.length],
      }
    }),
  )
}
