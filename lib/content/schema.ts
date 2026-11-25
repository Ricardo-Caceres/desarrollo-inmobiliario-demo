import { z } from 'zod'

// Texto bilingüe: ambos idiomas son obligatorios.
export const localizedText = z.object({
  en: z.string().trim().min(1),
  es: z.string().trim().min(1),
})
export type LocalizedText = z.infer<typeof localizedText>

const id = z.string().trim().min(1)
const pct = z.number().min(0).max(100)

export const developerSchema = z.object({
  name: z.string().trim().min(1),
  tagline: localizedText,
  about: localizedText,
})

// Rectángulo en planta (metros) que se dibuja como plano isométrico; retícula de 0.5 m.
const meters = z.number().multipleOf(0.5)
export const roomSchema = z.object({
  id,
  kind: z.enum(['living', 'kitchen', 'bedroom', 'bathroom', 'powder', 'terrace', 'pool', 'study', 'laundry']),
  label: localizedText,
  x: meters.min(0),
  y: meters.min(0),
  w: meters.positive(),
  h: meters.positive(),
})
export type Room = z.infer<typeof roomSchema>

// Prototipo: la planta que comparten varias unidades.
// bathrooms cuenta baños completos y .5 por un medio baño; la planta debe dibujar los mismos.
export const unitTypeSchema = z
  .object({
    id,
    name: localizedText,
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().min(1).multipleOf(0.5),
    interiorM2: z.number().positive(),
    terraceM2: z.number().min(0),
    rooms: z.array(roomSchema).min(1),
  })
  .superRefine((type, ctx) => {
    const count = (kind: Room['kind']) => type.rooms.filter((r) => r.kind === kind).length
    const expected = [
      { kind: 'bedroom', drawn: count('bedroom'), declared: type.bedrooms, path: 'bedrooms' },
      { kind: 'bathroom', drawn: count('bathroom'), declared: Math.floor(type.bathrooms), path: 'bathrooms' },
      { kind: 'powder', drawn: count('powder'), declared: type.bathrooms % 1 === 0 ? 0 : 1, path: 'bathrooms' },
    ] as const
    for (const e of expected) {
      if (e.drawn !== e.declared) {
        ctx.addIssue({
          code: 'custom',
          path: [e.path],
          message: `El prototipo ${type.id} declara ${e.declared} ${e.kind} pero su planta dibuja ${e.drawn}`,
        })
      }
    }
    type.rooms.forEach((a, i) => {
      for (const b of type.rooms.slice(i + 1)) {
        if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
          ctx.addIssue({ code: 'custom', path: ['rooms', i], message: `Habitaciones solapadas: ${a.id} y ${b.id}` })
        }
      }
    })
  })

export const unitSchema = z.object({
  id,
  typeId: id,
  floor: z.number().int().min(0),
  view: z.enum(['ocean', 'jungle', 'city', 'park', 'pool']),
  // Unidades enteras de la moneda del desarrollo.
  price: z.number().int().positive(),
  status: z.enum(['available', 'reserved', 'sold']),
})

export const paymentPlanSchema = z
  .object({
    id,
    name: localizedText,
    downPaymentPct: pct,
    installmentsPct: pct,
    onDeliveryPct: pct,
    installmentsMonths: z.number().int().min(0),
    discountPct: pct,
  })
  .superRefine((plan, ctx) => {
    if (plan.downPaymentPct + plan.installmentsPct + plan.onDeliveryPct !== 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['downPaymentPct'],
        message: 'El enganche, las mensualidades y la entrega deben sumar 100%',
      })
    }
    if (plan.installmentsPct > 0 && plan.installmentsMonths <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['installmentsMonths'],
        message: 'Con mensualidades (installmentsPct > 0) se requieren meses > 0',
      })
    }
  })

const amenitySchema = z.object({ id, label: localizedText })

export const developmentSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser kebab-case'),
    name: z.string().trim().min(1),
    city: z.enum(['tulum', 'cdmx']),
    neighborhood: localizedText,
    address: localizedText,
    location: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
    status: z.enum(['presale', 'construction', 'ready']),
    deliveryDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Formato esperado: YYYY-MM'),
    currency: z.enum(['USD', 'MXN']),
    tagline: localizedText,
    description: localizedText,
    amenities: z.array(amenitySchema),
    unitTypes: z.array(unitTypeSchema).min(1),
    units: z.array(unitSchema).min(1),
    paymentPlans: z.array(paymentPlanSchema).min(1),
  })
  .superRefine((dev, ctx) => {
    // Reporta cada id repetido con la ruta de su segunda aparición.
    const checkUnique = (items: { id: string }[], path: (string | number)[], what: string) => {
      const seen = new Set<string>()
      items.forEach((item, i) => {
        if (seen.has(item.id)) {
          ctx.addIssue({ code: 'custom', path: [...path, i, 'id'], message: `${what} duplicado: ${item.id}` })
        }
        seen.add(item.id)
      })
    }
    checkUnique(dev.unitTypes, ['unitTypes'], 'Id de prototipo')
    checkUnique(dev.units, ['units'], 'Id de unidad')
    checkUnique(dev.paymentPlans, ['paymentPlans'], 'Id de plan de pagos')
    checkUnique(dev.amenities, ['amenities'], 'Id de amenidad')
    dev.unitTypes.forEach((type, t) => checkUnique(type.rooms, ['unitTypes', t, 'rooms'], 'Id de habitación'))

    const typeIds = new Set(dev.unitTypes.map((t) => t.id))
    dev.units.forEach((unit, i) => {
      if (!typeIds.has(unit.typeId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['units', i, 'typeId'],
          message: `La unidad ${unit.id} apunta a un prototipo inexistente: ${unit.typeId}`,
        })
      }
    })
  })

export const contentSchema = z
  .object({
    developer: developerSchema,
    developments: z.array(developmentSchema),
  })
  .superRefine((content, ctx) => {
    const seen = new Set<string>()
    content.developments.forEach((dev, i) => {
      if (seen.has(dev.slug)) {
        ctx.addIssue({ code: 'custom', path: ['developments', i, 'slug'], message: `Slug duplicado: ${dev.slug}` })
      }
      seen.add(dev.slug)
    })
  })

export type Developer = z.infer<typeof developerSchema>
export type UnitType = z.infer<typeof unitTypeSchema>
export type Unit = z.infer<typeof unitSchema>
export type PaymentPlan = z.infer<typeof paymentPlanSchema>
export type Development = z.infer<typeof developmentSchema>
export type Content = z.infer<typeof contentSchema>
