import type { Developer, Development } from './schema'

// Puerto de contenido: asíncrono para que un CMS remoto encaje sin cambiar a los consumidores.
export interface ContentRepository {
  getDeveloper(): Promise<Developer>
  listDevelopments(): Promise<Development[]>
  getDevelopment(slug: string): Promise<Development | null>
}
