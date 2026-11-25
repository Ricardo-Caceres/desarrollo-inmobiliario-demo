// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import UnitTypeCard from '@/components/UnitTypeCard'
import en from '@/i18n/dictionaries/en'
import es from '@/i18n/dictionaries/es'
import { localContent } from '@/lib/content/local'

const lumarel = localContent.developments[0]
const penthouse = lumarel.unitTypes.find((t) => t.id === 'penthouse')!

afterEach(cleanup)

describe('plano isométrico en UnitTypeCard', () => {
  it('dibuja un SVG con nombre accesible y una leyenda por habitación en es', () => {
    render(<UnitTypeCard locale="es" unitType={penthouse} currency="USD" fromPrice={null} dict={es} />)

    const img = screen.getByRole('img', { name: 'Plano: Penthouse con alberca privada' })
    expect(img.querySelectorAll('polygon').length).toBeGreaterThan(penthouse.rooms.length)

    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items).toHaveLength(penthouse.rooms.length)
    const n = (id: string) => penthouse.rooms.findIndex((r) => r.id === id) + 1
    const texts = items.map((li) => li.textContent)
    expect(texts).toContain(`${n('ensuite')}Baño en suite10 m²`)
    expect(texts).toContain(`${n('pool')}Alberca privada21 m²`)
  })

  it('usa etiquetas en inglés en en', () => {
    render(<UnitTypeCard locale="en" unitType={penthouse} currency="USD" fromPrice={null} dict={en} />)
    expect(screen.getByRole('img', { name: 'Floor plan: Penthouse with Private Pool' })).toBeTruthy()
    expect(screen.getByText('Private pool')).toBeTruthy()
  })
})
