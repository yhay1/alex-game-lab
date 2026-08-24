import { createClient } from '@/lib/supabase/server'

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type GameProject = {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  status: 'draft' | 'published' | 'archived'
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

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
  if (error) throw error
  return data.user
}

export async function listProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('game_projects').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return data as GameProject[]
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
