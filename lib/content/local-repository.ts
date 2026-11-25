import { localContent } from './local'
import type { ContentRepository } from './repository'
import { contentSchema } from './schema'

// Valida una sola vez al crearse (falla rápido si los datos están mal) y responde desde memoria.
export function createLocalRepository(content: unknown = localContent): ContentRepository {
  const data = contentSchema.parse(content)
  return {
    getDeveloper: async () => data.developer,
    listDevelopments: async () => data.developments,
    getDevelopment: async (slug) => data.developments.find((d) => d.slug === slug) ?? null,
  }
}
