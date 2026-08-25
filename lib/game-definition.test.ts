import assert from 'node:assert/strict'
import test from 'node:test'
import { validateGameDefinition } from './game-definition'
import { sampleGameDefinition } from './sample-game-definition'

test('accepts the starter game definition', () => {
  assert.deepEqual(validateGameDefinition(sampleGameDefinition), { valid: true })
})

test('rejects a missing starting scene', () => {
  const result = validateGameDefinition({ ...sampleGameDefinition, metadata: { ...sampleGameDefinition.metadata, startingSceneId: 'missing' } })
  assert.equal(result.valid, false)
  if (!result.valid) assert.ok(result.errors.includes('metadata.startingSceneId must reference a scene.'))
})

test('rejects duplicate entity ids and unknown sprite assets', () => {
  const scene = sampleGameDefinition.scenes[0]
  const result = validateGameDefinition({ ...sampleGameDefinition, scenes: [{ ...scene, entities: [{ ...scene.entities[0], id: scene.entities[1].id, components: { ...scene.entities[0].components, sprite: { assetId: 'missing-sprite' } } }, scene.entities[1]] }] })
  assert.equal(result.valid, false)
  if (!result.valid) assert.ok(result.errors.some((error) => error.includes('unique non-empty ids')) && result.errors.some((error) => error.includes('unknown sprite asset')))
})
