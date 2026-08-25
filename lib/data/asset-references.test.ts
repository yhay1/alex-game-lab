import test from 'node:test'
import assert from 'node:assert/strict'
import { getActiveAssetMention, insertAssetMention, rankAssetReferences } from './asset-references'

const assets = [{ id: '1', name: 'hero ship', kind: 'sprite', tags: ['player'], storagePath: '1/hero.png', available: true }, { id: '2', name: 'space music', kind: 'audio', tags: ['music'], storagePath: '2/music.mp3', available: true }]

test('detects the active asset mention at the cursor', () => assert.deepEqual(getActiveAssetMention('make @hero', 10)?.query, 'hero'))
test('inserts a stable asset label without losing suffix text', () => assert.deepEqual(insertAssetMention('use @hero now', getActiveAssetMention('use @hero now', 9)!, assets[0], 9).value, 'use @hero ship  now'))
test('ranks exact and prefix names before tag matches', () => assert.deepEqual(rankAssetReferences(assets, 'hero').map((asset) => asset.id), ['1', '2']))
