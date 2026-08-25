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
