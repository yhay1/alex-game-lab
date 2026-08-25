export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }
        Insert: { id: string; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      game_projects: {
        Row: { id: string; owner_id: string; name: string; slug: string; description: string | null; genre: string | null; foundation: Json; status: 'draft' | 'published' | 'archived'; thumbnail_url: string | null; cover_image_url: string | null; metadata: Json; created_at: string; updated_at: string }
        Insert: { id?: string; owner_id: string; name: string; slug: string; description?: string | null; genre?: string | null; foundation?: Json; status?: 'draft' | 'published' | 'archived'; thumbnail_url?: string | null; cover_image_url?: string | null; metadata?: Json; created_at?: string; updated_at?: string }
        Update: { id?: string; owner_id?: string; name?: string; slug?: string; description?: string | null; genre?: string | null; foundation?: Json; status?: 'draft' | 'published' | 'archived'; thumbnail_url?: string | null; cover_image_url?: string | null; metadata?: Json; created_at?: string; updated_at?: string }
        Relationships: []
      }
      game_project_versions: {
        Row: { id: string; project_id: string; version_number: number; label: string | null; data: Json; created_by: string; created_at: string }
        Insert: { id?: string; project_id: string; version_number: number; label?: string | null; data: Json; created_by: string; created_at?: string }
        Update: { id?: string; project_id?: string; version_number?: number; label?: string | null; data?: Json; created_by?: string; created_at?: string }
        Relationships: []
      }
      game_assets: {
        Row: { id: string; project_id: string; owner_id: string; name: string; description: string | null; asset_type: 'image' | 'sprite' | 'audio'; kind: string; storage_path: string; mime_type: string; size_bytes: number; width: number | null; height: number | null; duration_seconds: number | null; visibility: 'public' | 'private'; source_type: 'upload' | 'generated' | 'imported'; source_url: string | null; license: string | null; tags: string[]; classification_status: 'unclassified' | 'pending' | 'classified'; metadata: Json; created_at: string; updated_at: string }
        Insert: { id?: string; project_id: string; owner_id: string; name: string; description?: string | null; asset_type: 'image' | 'sprite' | 'audio'; kind?: string; storage_path: string; mime_type: string; size_bytes: number; width?: number | null; height?: number | null; duration_seconds?: number | null; visibility?: 'public' | 'private'; source_type?: 'upload' | 'generated' | 'imported'; source_url?: string | null; license?: string | null; tags?: string[]; classification_status?: 'unclassified' | 'pending' | 'classified'; metadata?: Json; created_at?: string; updated_at?: string }
        Update: { id?: string; project_id?: string; owner_id?: string; name?: string; description?: string | null; asset_type?: 'image' | 'sprite' | 'audio'; kind?: string; storage_path?: string; mime_type?: string; size_bytes?: number; width?: number | null; height?: number | null; duration_seconds?: number | null; visibility?: 'public' | 'private'; source_type?: 'upload' | 'generated' | 'imported'; source_url?: string | null; license?: string | null; tags?: string[]; classification_status?: 'unclassified' | 'pending' | 'classified'; metadata?: Json; created_at?: string; updated_at?: string }
        Relationships: []
      }
      game_asset_favorites: {
        Row: { asset_id: string; user_id: string; created_at: string }
        Insert: { asset_id: string; user_id: string; created_at?: string }
        Update: { asset_id?: string; user_id?: string; created_at?: string }
        Relationships: []
      }
      game_asset_reports: {
        Row: { id: string; asset_id: string; reporter_id: string; reason: string; created_at: string }
        Insert: { id?: string; asset_id: string; reporter_id: string; reason: string; created_at?: string }
        Update: { id?: string; asset_id?: string; reporter_id?: string; reason?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
