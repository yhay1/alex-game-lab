import test from 'node:test'
import assert from 'node:assert/strict'
import { projectToGameDefinition } from './project-definition'
import { sampleGameDefinition } from '@/lib/sample-game-definition'

test('project definition loader accepts a canonical definition', () => {
  const project = { foundation: sampleGameDefinition } as never
  assert.equal(projectToGameDefinition(project).metadata.name, 'Neon Rooftop Run')
})

test('project definition loader rejects malformed foundation', () => {
  assert.throws(() => projectToGameDefinition({ foundation: { scenes: [] } } as never), /Invalid game definition/)
})

test('project definition loader falls back for editable foundations', () => {
  const definition = projectToGameDefinition({ id: 'project-1', name: 'Untitled', foundation: { prompt: 'A platformer' } } as never)
  assert.equal(definition.schemaVersion, '0.1')
  assert.equal(definition.scenes.length, 1)
})
