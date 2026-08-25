import type { GameDefinition } from '@/lib/game-definition'
import type { GameProject } from '@/lib/data/game-lab-types'
import { validateGameDefinition } from '@/lib/game-definition'

export function projectToGameDefinition(project: GameProject): GameDefinition {
  const foundation = (project.foundation ?? {}) as Record<string, unknown>
  const candidate = foundation.gameDefinition ?? foundation
  if (!candidate || typeof candidate !== 'object') throw new Error('Project has no game definition')
  const result = validateGameDefinition(candidate)
  if (result.valid) return candidate as GameDefinition
  throw new Error(`Invalid game definition: ${result.errors.join('; ')}`)
}
