import { describe, expect, it } from 'vitest'
import { localContent } from '@/lib/content/local'
import { createLocalRepository } from '@/lib/content/local-repository'

describe('createLocalRepository', () => {
  const repo = createLocalRepository()

  it('devuelve el desarrollador', async () => {
    expect((await repo.getDeveloper()).name).toBe('Orvale Desarrollos')
  })

  it('lista los 2 desarrollos', async () => {
    const list = await repo.listDevelopments()
    expect(list.map((d) => d.slug)).toEqual(['lumarel-tulum', 'obsidia-polanco'])
  })

  it('busca un desarrollo por slug', async () => {
    expect((await repo.getDevelopment('obsidia-polanco'))?.name).toBe('Obsidia Polanco')
  })

  it('devuelve null con un slug desconocido', async () => {
    expect(await repo.getDevelopment('nope')).toBeNull()
  })

  it('lanza al crearse con datos inválidos', () => {
    const bad = structuredClone(localContent)
    bad.developments[0].units[0].typeId = 'no-existe'
    expect(() => createLocalRepository(bad)).toThrow()
  })
})
