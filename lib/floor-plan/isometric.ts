import type { Room } from '@/lib/content/schema'

// Geometría pura del plano isométrico: convierte rectángulos en planta (metros) en polígonos SVG.
// Ejes: x crece hacia abajo a la derecha, y hacia abajo a la izquierda, z hacia arriba.

export type Point = readonly [number, number]

export type IsoFloor = { id: string; kind: Room['kind']; points: string; marker: Point }
export type IsoWall = { key: string; kind: 'wall' | 'railing'; points: string; top: string }
export type IsoPlan = { viewBox: string; floors: IsoFloor[]; walls: IsoWall[] }

/** Muros en corte (más bajos que los reales) para que se vea el interior. */
export const WALL_HEIGHT = 1.2
export const RAILING_HEIGHT = 0.5
/** Ancho fijo del dibujo en unidades SVG: marcadores y trazos miden lo mismo en plantas grandes y chicas. */
export const PLAN_WIDTH = 480
const PADDING = 24
const STEP = 0.5 // retícula del esquema
const COS30 = Math.sqrt(3) / 2
const OUTDOOR: ReadonlySet<Room['kind']> = new Set(['terrace', 'pool'])

export function project(x: number, y: number, z: number, scale: number): Point {
  return [(x - y) * COS30 * scale, ((x + y) / 2 - z) * scale]
}

const fmt = (n: number) => String(Math.round(n * 100) / 100)
const toPoints = (pts: Point[]) => pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(' ')

type Run = { horizontal: boolean; fixed: number; from: number; to: number; enclosed: boolean }

/**
 * Bordes únicos de la planta: cada borde de habitación se parte en tramos de 0.5 m, se deduplican
 * (un muro compartido se dibuja una vez) y se vuelven a unir en tramos continuos del mismo tipo.
 * Un tramo es muro si toca al menos un espacio interior; si solo toca terraza o alberca, es barandal.
 */
export function wallRuns(rooms: Room[]): Run[] {
  const halves = (n: number) => Math.round(n / STEP)
  const segments = new Map<string, boolean>()
  const add = (horizontal: boolean, fixed: number, start: number, enclosed: boolean) => {
    const key = `${horizontal ? 'h' : 'v'}:${fixed}:${start}`
    segments.set(key, (segments.get(key) ?? false) || enclosed)
  }
  for (const r of rooms) {
    const enclosed = !OUTDOOR.has(r.kind)
    const [x0, y0, x1, y1] = [halves(r.x), halves(r.y), halves(r.x + r.w), halves(r.y + r.h)]
    for (let i = x0; i < x1; i++) {
      add(true, y0, i, enclosed)
      add(true, y1, i, enclosed)
    }
    for (let j = y0; j < y1; j++) {
      add(false, x0, j, enclosed)
      add(false, x1, j, enclosed)
    }
  }

  const sorted = [...segments].map(([key, enclosed]) => {
    const [dir, fixed, start] = key.split(':')
    return { horizontal: dir === 'h', fixed: Number(fixed), start: Number(start), enclosed }
  })
  sorted.sort((a, b) => Number(a.horizontal) - Number(b.horizontal) || a.fixed - b.fixed || a.start - b.start)

  const runs: Run[] = []
  for (const s of sorted) {
    const last = runs.at(-1)
    const continues =
      last &&
      last.horizontal === s.horizontal &&
      last.fixed === s.fixed * STEP &&
      last.to === s.start * STEP &&
      last.enclosed === s.enclosed
    if (continues) last.to = (s.start + 1) * STEP
    else runs.push({ horizontal: s.horizontal, fixed: s.fixed * STEP, from: s.start * STEP, to: (s.start + 1) * STEP, enclosed: s.enclosed })
  }
  return runs
}

export function buildIsometricPlan(rooms: Room[]): IsoPlan {
  const width = Math.max(...rooms.map((r) => r.x + r.w))
  const depth = Math.max(...rooms.map((r) => r.y + r.h))
  const scale = PLAN_WIDTH / ((width + depth) * COS30)
  const p = (x: number, y: number, z = 0) => project(x, y, z, scale)

  // Lo más lejano (menor x + y) se pinta primero.
  const floors: IsoFloor[] = [...rooms]
    .sort((a, b) => a.x + a.y - (b.x + b.y))
    .map((r) => ({
      id: r.id,
      kind: r.kind,
      points: toPoints([p(r.x, r.y), p(r.x + r.w, r.y), p(r.x + r.w, r.y + r.h), p(r.x, r.y + r.h)]),
      marker: p(r.x + r.w / 2, r.y + r.h / 2),
    }))

  const walls: IsoWall[] = wallRuns(rooms)
    .map((run) => {
      const [a, b]: Point[] = run.horizontal
        ? [[run.from, run.fixed], [run.to, run.fixed]]
        : [[run.fixed, run.from], [run.fixed, run.to]]
      const h = run.enclosed ? WALL_HEIGHT : RAILING_HEIGHT
      return {
        depth: (a[0] + b[0] + a[1] + b[1]) / 2,
        wall: {
          key: `${run.horizontal ? 'h' : 'v'}:${run.fixed}:${run.from}`,
          kind: run.enclosed ? ('wall' as const) : ('railing' as const),
          points: toPoints([p(a[0], a[1]), p(b[0], b[1]), p(b[0], b[1], h), p(a[0], a[1], h)]),
          top: toPoints([p(a[0], a[1], h), p(b[0], b[1], h)]),
        },
      }
    })
    .sort((a, b) => a.depth - b.depth)
    .map((w) => w.wall)

  // Esquinas extremas del volumen: izquierda (0, depth), derecha (width, 0), arriba (0, 0, h), abajo (width, depth).
  const [left] = p(0, depth)
  const [right] = p(width, 0)
  const [, top] = p(0, 0, WALL_HEIGHT)
  const [, bottom] = p(width, depth)
  const viewBox = [left - PADDING, top - PADDING, right - left + PADDING * 2, bottom - top + PADDING * 2].map(fmt).join(' ')

  return { viewBox, floors, walls }
}
