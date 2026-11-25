// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import DevelopmentCard from '@/components/DevelopmentCard'
import en from '@/i18n/dictionaries/en'
import es from '@/i18n/dictionaries/es'
import { localContent } from '@/lib/content/local'
import { formatPrice, priceRange } from '@/lib/content/queries'

const lumarel = localContent.developments[0]

afterEach(cleanup)

describe('DevelopmentCard', () => {
  it('muestra nombre, estatus, entrega, «Desde» con precio y enlace en es', () => {
    render(<DevelopmentCard locale="es" development={lumarel} dict={es} />)
    const min = priceRange(lumarel)!.min

    expect(screen.getByRole('heading', { name: 'Lumarel Tulum' })).toBeTruthy()
    expect(screen.getByText('Preventa')).toBeTruthy()
    expect(screen.getByText('junio de 2028')).toBeTruthy()
    expect(screen.getByText('Desde')).toBeTruthy()
    // Intl usa espacios no separables; el matcher de RTL normaliza espacios, así que se compara el texto crudo.
    const price = formatPrice(min, 'USD', 'es')
    expect(screen.getByText((_, el) => el?.tagName === 'DD' && el.textContent === price)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Lumarel Tulum' }).getAttribute('href')).toBe('/es/developments/lumarel-tulum')
  })

  it('usa el idioma y la ruta en en', () => {
    render(<DevelopmentCard locale="en" development={lumarel} dict={en} />)
    expect(screen.getByText('From')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Lumarel Tulum' }).getAttribute('href')).toBe('/en/developments/lumarel-tulum')
  })
})
