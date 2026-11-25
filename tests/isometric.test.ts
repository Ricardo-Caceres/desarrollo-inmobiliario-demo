import { describe, expect, it } from 'vitest'
import type { Room } from '@/lib/content/schema'
import { buildIsometricPlan, PLAN_WIDTH, project, wallRuns } from '@/lib/floor-plan/isometric'

const room = (id: string, kind: Room['kind'], x: number, y: number, w: number, h: number): Room => ({
  id,
  kind,
  label: { en: id, es: id },
  x,
  y,
  w,
  h,
})

// Dos cuartos de 2×2 lado a lado y una terraza de 4×1 al frente.
const rooms = [room('a', 'living', 0, 0, 2, 2), room('b', 'bedroom', 2, 0, 2, 2), room('t', 'terrace', 0, 2, 4, 1)]

describe('project', () => {
  it('lleva el origen al origen y separa x e y a 30°', () => {
    expect(project(0, 0, 0, 1)).toEqual([0, 0])
    const [xr, yr] = project(1, 0, 0, 1)
    const [xl, yl] = project(0, 1, 0, 1)
    expect(xr).toBeCloseTo(Math.sqrt(3) / 2)
    expect(xl).toBeCloseTo(-Math.sqrt(3) / 2)
    expect(yr).toBe(0.5)
    expect(yl).toBe(0.5)
  })

  it('la altura sube en pantalla', () => {
    expect(project(0, 0, 2, 10)).toEqual([0, -20])
  })
})

describe('wallRuns', () => {
  const runs = wallRuns(rooms)
  const find = (horizontal: boolean, fixed: number, from: number) =>
    runs.find((r) => r.horizontal === horizontal && r.fixed === fixed && r.from === from)

  it('dibuja una sola vez el muro compartido entre dos cuartos', () => {
    const shared = runs.filter((r) => !r.horizontal && r.fixed === 2 && r.from < 2)
    expect(shared).toEqual([{ horizontal: false, fixed: 2, from: 0, to: 2, enclosed: true }])
  })

  it('une tramos contiguos del mismo tipo en un solo muro', () => {
    expect(find(true, 0, 0)).toEqual({ horizontal: true, fixed: 0, from: 0, to: 4, enclosed: true })
  })

  it('el borde entre interior y terraza es muro; el exterior de la terraza es barandal', () => {
    expect(find(true, 2, 0)?.enclosed).toBe(true)
    expect(find(true, 3, 0)).toEqual({ horizontal: true, fixed: 3, from: 0, to: 4, enclosed: false })
    expect(find(false, 0, 2)?.enclosed).toBe(false)
  })

  it('una planta cerrada de un cuarto da cuatro muros', () => {
    expect(wallRuns([room('x', 'living', 1, 1, 3, 2)])).toHaveLength(4)
  })
})

describe('buildIsometricPlan', () => {
  const plan = buildIsometricPlan(rooms)

  it('un piso por habitación, de lo lejano a lo cercano', () => {
    expect(plan.floors.map((f) => f.id)).toEqual(['a', 'b', 't'])
    expect(plan.floors[0].points.split(' ')).toHaveLength(4)
  })

  it('clasifica muros y barandales', () => {
    expect(plan.walls.filter((w) => w.kind === 'railing')).toHaveLength(3)
    expect(plan.walls.filter((w) => w.kind === 'wall')).toHaveLength(5)
  })

  it('normaliza el ancho del dibujo sin importar el tamaño de la planta', () => {
    const big = buildIsometricPlan(rooms.map((r) => ({ ...r, x: r.x * 5, y: r.y * 5, w: r.w * 5, h: r.h * 5 })))
    const width = (viewBox: string) => Number(viewBox.split(' ')[2])
    expect(width(plan.viewBox)).toBeCloseTo(width(big.viewBox))
    expect(width(plan.viewBox)).toBeGreaterThan(PLAN_WIDTH)
  })

  it('todos los puntos caen dentro del viewBox', () => {
    const [minX, minY, w, h] = plan.viewBox.split(' ').map(Number)
    const pts = [...plan.floors.map((f) => f.points), ...plan.walls.map((w) => w.points)]
      .flatMap((s) => s.split(' '))
      .map((pair) => pair.split(',').map(Number))
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThanOrEqual(minX)
      expect(x).toBeLessThanOrEqual(minX + w)
      expect(y).toBeGreaterThanOrEqual(minY)
      expect(y).toBeLessThanOrEqual(minY + h)
    }
  })
})
