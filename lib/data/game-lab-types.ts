export const GAME_GENRES = ['Platformer', 'Racing', 'Fighting', 'Survival', 'Puzzle', 'Strategy'] as const
export type GameGenre = (typeof GAME_GENRES)[number]
export type ProjectFoundation = { levels: unknown[]; entities: unknown[]; items: unknown[]; abilities: unknown[]; rules: unknown[]; assets: unknown[] }
export type GameProject = { id: string; owner_id: string; name: string; slug: string; description: string | null; genre: GameGenre | null; foundation: ProjectFoundation; status: 'draft' | 'published' | 'archived'; thumbnail_url: string | null; created_at: string; updated_at: string }
