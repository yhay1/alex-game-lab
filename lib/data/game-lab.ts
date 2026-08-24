import { createClient } from '@/lib/supabase/server'

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

export type GameAsset = {
  id: string
  project_id: string
  owner_id: string
  name: string
  kind: 'image' | 'audio' | 'font' | 'data' | 'other'
  storage_path: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error && error.name !== 'AuthSessionMissingError') throw error
  return data.user ?? null
}

export async function listProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').select('*').order('updated_at', { ascending: false })
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
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').select('*').eq('id', projectId).single()
  if (error) throw error
  return data as GameProject
}

export async function createProject(input: { name: string; description?: string; genre: GameGenre }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Authentication required')
  const supabase = await createClient()
  const slug = input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`
  const { data, error } = await supabase.from('game_projects').insert({ owner_id: user.id, name: input.name.trim(), slug, description: input.description?.trim() || null, genre: input.genre, foundation: foundationDefaults }).select('*').single()
  if (error) throw error
  return data as GameProject
}

export async function updateProject(projectId: string, input: Partial<Pick<GameProject, 'name' | 'description' | 'genre' | 'status' | 'foundation'>>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').update({ ...input, updated_at: new Date().toISOString() }).eq('id', projectId).select('*').single()
  if (error) throw error
  return data as GameProject
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('game_projects').delete().eq('id', projectId)
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
