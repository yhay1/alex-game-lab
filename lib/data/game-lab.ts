import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/supabase/database.types'

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

import type { GameProject, GameGenre, ProjectFoundation } from '@/lib/data/game-lab-types'
export type { GameProject, GameGenre, ProjectFoundation } from '@/lib/data/game-lab-types'

export type GameProjectVersion = {
  id: string
  project_id: string
  version_number: number
  label: string | null
  data: Record<string, unknown>
  created_by: string
  created_at: string
}

import type { GameAsset } from '@/lib/data/asset-types'
export type { GameAsset } from '@/lib/data/asset-types'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error && error.name !== 'AuthSessionMissingError') throw error
  return data.user ?? null
}

export async function listProjects() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').select('*').eq('owner_id', user.id).order('updated_at', { ascending: false })
  if (error) throw error
  return data as GameProject[]
}

const foundationDefaults: ProjectFoundation = {
  levels: [],
  entities: [],
  items: [],
  abilities: [],
  rules: [],
  assets: [],
}

export async function getProject(projectId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').select('*').eq('id', projectId).eq('owner_id', user.id).single()
  if (error) throw error
  return data as GameProject
}

export async function createProject(input: { name: string; description?: string; genre: GameGenre }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const slug = input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`
  const { data, error } = await supabase.from('game_projects').insert({ owner_id: user.id, name: input.name.trim(), slug, description: input.description?.trim() || null, genre: input.genre, foundation: foundationDefaults as unknown as import('@/lib/supabase/database.types').Json }).select('*').single()
  if (error) throw error
  return data as GameProject
}

export async function updateProject(projectId: string, input: Partial<Pick<GameProject, 'name' | 'description' | 'genre' | 'status' | 'foundation'>>) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').update({ ...input, foundation: input.foundation as unknown as Json, updated_at: new Date().toISOString() }).eq('id', projectId).eq('owner_id', user.id).select('*').single()
  if (error) throw error
  return data as GameProject
}

export async function deleteProject(projectId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const { error } = await supabase.from('game_projects').delete().eq('id', projectId).eq('owner_id', user.id)
  if (error) throw error
}

export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data as Profile
}

export async function listProjectVersions(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_project_versions').select('*').eq('project_id', projectId).order('version_number', { ascending: false })
  if (error) throw error
  return data as GameProjectVersion[]
}

export async function listProjectAssets(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_assets').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
  if (error) throw error
  return data as GameAsset[]
}
