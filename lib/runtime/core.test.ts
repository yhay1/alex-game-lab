import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Camera } from './core'

test('camera clamps using zoomed viewport dimensions', () => {
  const camera = new Camera(100, 100)
  camera.zoom = 2
  camera.setFixed({ x: 999, y: 999 }, { x: 0, y: 0, width: 200, height: 200 })
  assert.deepEqual({ x: camera.x, y: camera.y }, { x: 150, y: 150 })
})
