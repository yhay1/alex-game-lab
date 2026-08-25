import assert from 'node:assert/strict'
import { test } from 'node:test'
import { nextVersionNumber, validateVersionData } from './versions'

test('version numbers increment', () => assert.equal(nextVersionNumber([{ version_number: 2 }, { version_number: 4 }]), 5))
test('invalid versions report readiness errors', () => assert.equal(validateVersionData({}).valid, false))
test('valid versions are accepted', () => assert.equal(validateVersionData({ schemaVersion: '0.1', metadata: {}, settings: {}, scenes: [{}], assets: [] }).valid, true))
