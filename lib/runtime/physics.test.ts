import { test } from 'node:test'
import assert from 'node:assert/strict'
import { integrate, resolveVertical, simulatePhysics } from './physics'
import type { RuntimeEntity } from './types'

const body = (overrides: Partial<RuntimeEntity> = {}): RuntimeEntity => ({ id: 'player', position: { x: 10, y: 0 }, size: { x: 10, y: 10 }, color: '#fff', physics: { velocity: { x: 0, y: 0 }, gravity: 100, maxFallSpeed: 200, friction: 1, grounded: false }, ...overrides })

test('integrates gravity and caps falling speed', () => { const entity = body(); integrate(entity, 1); assert.equal(entity.position.y, 100); integrate(entity, 2); assert.equal(entity.physics?.velocity.y, 200) })
test('resolves landing on a static platform', () => { const entity = body({ position: { x: 10, y: 95 } }); const platform = body({ id: 'platform', position: { x: 0, y: 100 }, size: { x: 100, y: 20 }, solid: true, physics: undefined }); const result = resolveVertical(entity, [platform], { x: 10, y: 80 }); assert.equal(result.grounded, true); assert.equal(entity.position.y, 90) })
test('simulates dynamic entities without moving solids', () => { const platform = body({ id: 'platform', solid: true, physics: undefined }); const entity = body({ id: 'crate', position: { x: 10, y: 20 } }); simulatePhysics([platform, entity], 0.1); assert.equal(platform.position.y, 0); assert.ok(entity.position.y > 20) })
