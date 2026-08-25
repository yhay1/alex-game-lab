import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AssetRegistry } from './asset-registry'

test('registry reports unknown assets clearly', () => {
  const registry = new AssetRegistry([])
  assert.equal(registry.get('missing'), undefined)
  assert.equal(registry.getStatus('missing'), undefined)
})

test('registry memoizes terminal load state', async () => {
  const registry = new AssetRegistry([{ id: 'font', type: 'font', path: '/font.woff2' }])
  const first = await registry.load('font')
  const second = await registry.load('font')
  assert.equal(first, second)
})

test('registry rejects non-browser image loading gracefully', async () => {
  const registry = new AssetRegistry([{ id: 'font', type: 'font', path: '/font.woff2' }])
  const result = await registry.load('font')
  assert.equal(result.status, 'error')
  assert.match(result.error?.message ?? '', /not loadable/)
})
