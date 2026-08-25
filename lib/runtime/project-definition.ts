import type { GameDefinition } from '@/lib/game-definition'
import type { GameProject } from '@/lib/data/game-lab-types'
import { validateGameDefinition } from '@/lib/game-definition'

export function projectToGameDefinition(project: GameProject): GameDefinition {
  const foundation = (project.foundation ?? {}) as Record<string, unknown>
  const candidate = foundation.gameDefinition ?? foundation
  const result = validateGameDefinition(candidate)
  if (result.valid) return candidate as GameDefinition

  // Newly-created projects store the editable foundation shape first. Keep the
  // workspace usable until the first valid game definition is generated.
  const hasLegacyFoundation = ['levels', 'entities', 'items', 'abilities', 'rules'].some((key) => key in foundation)
  const hasExplicitDefinition = 'gameDefinition' in foundation || (!hasLegacyFoundation && ('schemaVersion' in foundation || Array.isArray(foundation.scenes)))
  if (hasExplicitDefinition) throw new Error(`Invalid game definition: ${result.errors.join('; ')}`)

  return {
    schemaVersion: '0.1',
    metadata: {
      id: project.id,
      name: project.name,
      description: project.description || 'A new game project.',
      genre: project.genre || 'Other',
      version: '0.1.0',
      startingSceneId: 'main-scene',
    },
    settings: {
      viewport: { width: 960, height: 540 },
      background: '#101827',
      gravity: { x: 0, y: 980 },
    },
    assets: [],
    scenes: [{ id: 'main-scene', name: 'Main Scene', entities: [] }],
  }
}
