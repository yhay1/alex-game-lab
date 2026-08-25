import assert from 'node:assert/strict'
import test from 'node:test'
import { sampleGameDefinition } from '@/lib/sample-game-definition'
import { validateGameDefinition } from '@/lib/game-definition'

test('sample game is a valid canonical definition', () => {
  const result = validateGameDefinition(sampleGameDefinition)
  assert.equal(result.valid, true)
  assert.equal(sampleGameDefinition.scenes[0].entities.length, 4)
})

test('sample game exposes a starting platform and goal collectible', () => {
  const definition = sampleGameDefinition
  const scene = definition.scenes[0]
  assert.ok(scene.entities.some((entity) => entity.id === 'starting-platform'))
  assert.ok(scene.entities.some((entity) => entity.id === 'energy-cell'))
})
