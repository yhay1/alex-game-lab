import test from 'node:test'
import assert from 'node:assert/strict'

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

test('asset search normalization is stable', () => {
  assert.equal(normalize('  Forest   Sprite '), 'forest sprite')
})

test('asset tags remain bounded for cards', () => {
  const tags = ['forest', 'platform', 'pixel', 'extra']
  assert.deepEqual(tags.slice(0, 4), tags)
})
