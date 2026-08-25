import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applySceneMutation } from './scenes'
import type { GameDefinition } from '@/lib/game-definition'

const definition = { schemaVersion: '0.1', metadata: { id: 'p', name: 'P', genre: 'Other', version: '1', startingSceneId: 'a' }, settings: { viewport: { width: 1, height: 1 }, background: '#000' }, assets: [], scenes: [{ id: 'a', name: 'Main', entities: [] }] } satisfies GameDefinition

test('scene mutations create, duplicate, and set default scenes', () => { const created = applySceneMutation(definition, { type: 'create', name: 'Level 2' }); assert.equal(created.scenes.length, 2); const copied = applySceneMutation(created, { type: 'duplicate', sceneId: 'a' }); assert.equal(copied.scenes.length, 3); const defaulted = applySceneMutation(copied, { type: 'set-default', sceneId: copied.scenes[1].id }); assert.equal(defaulted.metadata.startingSceneId, copied.scenes[1].id) })
test('scene mutations protect the final and default scene', () => { assert.throws(() => applySceneMutation(definition, { type: 'delete', sceneId: 'a' }), /At least one/); const two = applySceneMutation(definition, { type: 'create', name: 'Other' }); assert.throws(() => applySceneMutation(two, { type: 'delete', sceneId: 'a' }), /default/) })
