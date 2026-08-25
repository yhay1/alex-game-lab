import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GameRuntime } from './game-runtime'
import { sampleGameDefinition } from './sample-game-definition'

test('loads the starting scene without mutating the definition', () => {
  const runtime = new GameRuntime(sampleGameDefinition)
  assert.equal(runtime.getActiveSceneId(), 'main-scene')
  assert.equal(runtime.getActiveScene().getEntities().length, 2)
  assert.deepEqual(sampleGameDefinition.scenes[0].entities[0].components.transform.position, { x: 160, y: 240 })
})

test('supports entity lifecycle and isolated state', () => {
  const runtime = new GameRuntime(sampleGameDefinition)
  const scene = runtime.getActiveScene()
  runtime.initialize()
  const entity = scene.createEntity({ id: 'coin', name: 'Coin', components: { transform: { position: { x: 1, y: 1 }, rotation: 0, scale: { x: 1, y: 1 } } } })
  scene.updateEntityState('coin', { collected: true })
  assert.equal(scene.getEntity('coin')?.state.collected, true)
  assert.equal(scene.destroyEntity(entity.id), true)
  assert.equal(scene.getEntity('coin'), undefined)
  runtime.destroy()
  assert.equal(runtime.isInitialized(), false)
})

test('switches scenes and rejects invalid lifecycle operations', () => {
  const definition = { ...sampleGameDefinition, scenes: [...sampleGameDefinition.scenes, { ...sampleGameDefinition.scenes[0], id: 'menu-scene', name: 'Menu' }] }
  const runtime = new GameRuntime(definition)
  assert.throws(() => runtime.update(1), /not initialized/)
  assert.equal(runtime.switchScene('menu-scene').id, 'menu-scene')
  assert.throws(() => runtime.switchScene('missing'), /Unknown scene/)
})
