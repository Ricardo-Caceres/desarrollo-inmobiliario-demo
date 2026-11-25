import 'server-only'
import { createLocalRepository } from './local-repository'
import type { ContentRepository } from './repository'

let repository: ContentRepository | undefined

// Instancia única del repositorio; el adaptador Contentful se conmutará aquí en F8.
export function getContentRepository(): ContentRepository {
  repository ??= createLocalRepository()
  return repository
}
