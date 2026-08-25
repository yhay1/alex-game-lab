import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chooseAssetPolicy, detectAssetIntent, rankAssetCandidates } from './asset-intelligence'

test('detects explicit asset intents', () => {
  assert.equal(detectAssetIntent('reuse the player sprite'), 'reuse')
  assert.equal(detectAssetIntent('make a similar forest'), 'similar')
  assert.equal(detectAssetIntent('generate a new icon'), 'generate')
})

test('prioritizes project and favorite assets', () => {
  const result = rankAssetCandidates([{ id: 'a', name: 'hero', tags: ['player'], kind: 'sprite', source_type: 'upload', license: null }, { id: 'b', name: 'hero-alt', tags: [], kind: 'sprite', source_type: 'upload', license: null }], 'hero', ['b'], ['a'])
  assert.equal(result[0].id, 'b')
})

test('requires confirmation for ambiguous reuse', () => {
  const result = chooseAssetPolicy('exact', [{ id: 'a', name: 'one', kind: 'sprite', tags: [], source: 'owned', available: true, score: 1, reason: '' }, { id: 'b', name: 'two', kind: 'sprite', tags: [], source: 'owned', available: true, score: 1, reason: '' }])
  assert.equal(result.action, 'confirm')
})
