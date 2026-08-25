import type { GameDefinition } from '@/lib/game-definition'

export type VersionAction = 'publish' | 'restore'

export function validateVersionData(value: unknown): { valid: boolean; errors: string[]; definition?: GameDefinition } {
  if (!value || typeof value !== 'object') return { valid: false, errors: ['Version data must be an object'] }
  const candidate = value as Record<string, unknown>
  const errors: string[] = []
  if (candidate.schemaVersion !== '0.1') errors.push('schemaVersion must be 0.1')
  if (!candidate.metadata) errors.push('metadata is required')
  if (!candidate.settings) errors.push('settings is required')
  if (!Array.isArray(candidate.scenes) || candidate.scenes.length === 0) errors.push('At least one scene is required')
  return errors.length ? { valid: false, errors } : { valid: true, errors: [], definition: candidate as GameDefinition }
}

export function nextVersionNumber(rows: Array<{ version_number: number }>) {
  return rows.reduce((max, row) => Math.max(max, row.version_number), 0) + 1
}

export function publishedVersionId(metadata: unknown) {
  return metadata && typeof metadata === 'object' && typeof (metadata as { published_version_id?: unknown }).published_version_id === 'string'
    ? (metadata as { published_version_id: string }).published_version_id : null
}

export function versionLabel(versionNumber: number) { return `Version ${versionNumber}` }
