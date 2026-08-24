export type NavItem = {
  label: string
  icon: string
  active?: boolean
  badge?: string
}

export type Project = {
  id: string
  name: string
  description: string
  status: 'In progress' | 'Draft'
  updatedAt: string
  color: 'violet' | 'coral' | 'blue'
  progress: number
}

export type Activity = {
  title: string
  detail: string
  time: string
  icon: string
}

export type PlatformModule = {
  title: string
  description: string
  icon: string
  status: 'Coming soon' | 'Foundation ready'
}

export const navigation: { label: string; items: NavItem[] }[] = [
  { label: 'Build', items: [{ label: 'Dashboard', icon: 'layout-dashboard', active: true }, { label: 'Projects', icon: 'folder-kanban' }, { label: 'Workspace', icon: 'blocks' }] },
  { label: 'Platform', items: [{ label: 'Assets', icon: 'images' }, { label: 'AI Studio', icon: 'sparkles', badge: 'Soon' }, { label: 'Publish', icon: 'send', badge: 'Soon' }] },
  { label: 'Grow', items: [{ label: 'Community', icon: 'users', badge: 'Soon' }, { label: 'Progression', icon: 'trophy', badge: 'Soon' }, { label: 'Analytics', icon: 'chart-no-axes-combined', badge: 'Soon' }] },
]

export const projects: Project[] = [
  { id: 'neon-drift', name: 'Neon Drift', description: 'A fast-paced arcade racer through a glowing city.', status: 'In progress', updatedAt: 'Edited 2 hours ago', color: 'violet', progress: 68 },
  { id: 'garden-guardians', name: 'Garden Guardians', description: 'Tiny heroes defend their backyard kingdom.', status: 'In progress', updatedAt: 'Edited yesterday', color: 'coral', progress: 34 },
  { id: 'orbit-echo', name: 'Orbit Echo', description: 'A quiet puzzle adventure among the stars.', status: 'Draft', updatedAt: 'Edited 4 days ago', color: 'blue', progress: 12 },
]

export const recentActivity: Activity[] = [
  { title: 'Neon Drift', detail: 'Project updated', time: '2h', icon: 'pencil' },
  { title: 'Garden Guardians', detail: 'New project created', time: '1d', icon: 'plus' },
  { title: 'Orbit Echo', detail: 'Project opened', time: '4d', icon: 'play' },
]

export const platformModules: PlatformModule[] = [
  { title: 'Game Workspace', description: 'A visual home for building scenes, rules, and play loops.', icon: 'blocks', status: 'Foundation ready' },
  { title: 'AI Studio', description: 'Turn an idea into a playable starting point with natural language.', icon: 'sparkles', status: 'Coming soon' },
  { title: 'Asset Library', description: 'Keep sprites, sounds, backgrounds, and creations organized.', icon: 'images', status: 'Foundation ready' },
  { title: 'Publishing', description: 'Share games with a player-ready page when you are ready.', icon: 'send', status: 'Coming soon' },
  { title: 'Community', description: 'Discover what other creators are making and share feedback.', icon: 'users', status: 'Coming soon' },
  { title: 'Progression & Analytics', description: 'Understand your creative momentum and how games perform.', icon: 'chart-no-axes-combined', status: 'Coming soon' },
]

export const quickActions = [
  { label: 'Start from scratch', icon: 'plus', detail: 'Create an empty game project' },
  { label: 'Explore the workspace', icon: 'blocks', detail: 'See where your game will come together' },
]
