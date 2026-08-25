import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applyCustomizePatch, validateCustomizePatch } from './customize'
import type { GameDefinition } from '@/lib/game-definition'

const definition: GameDefinition = { schemaVersion: '0.1', metadata: { id: 'g', name: 'Game', genre: 'Other', version: '1', startingSceneId: 'main' }, settings: { viewport: { width: 100, height: 100 }, background: '#000' }, assets: [], scenes: [{ id: 'main', name: 'Main', entities: [{ id: 'hero', name: 'Hero', components: { transform: { position: { x: 1, y: 2 } }, health: { max: 100 } } }] }] }

test('customize validates numeric ranges', () => assert.ok(validateCustomizePatch({ entityId: 'hero', health: { max: -1 } }).length))
test('customize patches preserve unrelated definition data', () => { const next = applyCustomizePatch(definition, { entityId: 'hero', transform: { x: 24 }, health: { max: 200 } }); const entity = next.scenes[0].entities[0]; assert.equal(entity.components.transform.position.x, 24); assert.equal((entity.components.health as { max: number }).max, 200); assert.equal(next.metadata.name, 'Game') })
test('customize rejects unknown entities', () => assert.throws(() => applyCustomizePatch(definition, { entityId: 'missing' }), /Entity not found/))
