import type { Content } from '../schema'
import { developer } from './developer'
import { lumarelTulum } from './lumarel-tulum'
import { obsidiaPolanco } from './obsidia-polanco'

// La validación real la hace el repositorio al crearse.
export const localContent: Content = {
  developer,
  developments: [lumarelTulum, obsidiaPolanco],
}
