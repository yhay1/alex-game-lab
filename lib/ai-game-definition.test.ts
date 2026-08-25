import assert from 'node:assert/strict'
import { test } from 'node:test'
import { aiGameExamples } from './ai-game-examples'
import { loadAiGameDefinition, validateAiGameDefinition } from './ai-game-definition'

test('AI examples validate and load into runtime', () => { for (const definition of Object.values(aiGameExamples)) { const result = validateAiGameDefinition(definition); assert.equal(result.ok, true); const runtime = loadAiGameDefinition(definition); assert.equal(runtime.getActiveSceneId(), 'main') } })
test('malformed AI output returns useful errors', () => { const result = validateAiGameDefinition({ schemaVersion: '0.1', metadata: { name: '' }, settings: {}, assets: [], scenes: [] }); assert.equal(result.ok, false); if (!result.ok) { assert.ok(result.errors.some((error) => error.includes('metadata.id'))); assert.ok(result.errors.some((error) => error.includes('scene'))) } })
test('rejected AI output cannot enter runtime', () => { assert.throws(() => loadAiGameDefinition({}), /AI game definition rejected/) })
