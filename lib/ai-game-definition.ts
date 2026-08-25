import type { GameDefinition } from './game-definition'
import { validateGameDefinition } from './game-definition'
import { GameRuntime } from './game-runtime'

export type AiGameDefinitionResult = { ok: true; definition: GameDefinition } | { ok: false; errors: string[] }

export function validateAiGameDefinition(output: unknown): AiGameDefinitionResult {
  const result = validateGameDefinition(output)
  return result.valid ? { ok: true, definition: output as GameDefinition } : { ok: false, errors: result.errors }
}

export function loadAiGameDefinition(output: unknown): GameRuntime {
  const result = validateAiGameDefinition(output)
  if (!result.ok) throw new Error(`AI game definition rejected: ${result.errors.join('; ')}`)
  return new GameRuntime(result.definition)
}
