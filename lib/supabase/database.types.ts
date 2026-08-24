export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: { Row: { id: string; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }; Insert: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id'>> & { id: string }; Update: Partial<Database['public']['Tables']['profiles']['Row']> }
      game_projects: { Row: { id: string; owner_id: string; name: string; slug: string; description: string | null; status: 'draft' | 'published' | 'archived'; thumbnail_url: string | null; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['game_projects']['Row'], 'id' | 'created_at' | 'updated_at'>; Update: Partial<Database['public']['Tables']['game_projects']['Insert']> }
      game_project_versions: { Row: { id: string; project_id: string; version_number: number; label: string | null; data: Json; created_by: string; created_at: string }; Insert: Omit<Database['public']['Tables']['game_project_versions']['Row'], 'id' | 'created_at'>; Update: Partial<Database['public']['Tables']['game_project_versions']['Insert']> }
      game_assets: { Row: { id: string; project_id: string; owner_id: string; name: string; kind: 'image' | 'audio' | 'font' | 'data' | 'other'; storage_path: string | null; metadata: Json; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['game_assets']['Row'], 'id' | 'created_at' | 'updated_at'>; Update: Partial<Database['public']['Tables']['game_assets']['Insert']> }
    }
  }
}
