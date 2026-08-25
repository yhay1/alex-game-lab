import type { GameDefinition } from './game-definition'

const base = (id: string, name: string, genre: string, description: string): Pick<GameDefinition, 'schemaVersion' | 'metadata' | 'settings' | 'assets'> => ({ schemaVersion: '0.1', metadata: { id, name, genre, version: '0.1.0', description, startingSceneId: 'main' }, settings: { viewport: { width: 960, height: 540 }, background: '#101827', gravity: { x: 0, y: 980 } }, assets: [] })

export const aiGameExamples: Record<'platformer' | 'topDown' | 'collectible', GameDefinition> = {
  platformer: { ...base('ai-platformer', 'Skyline Hop', 'Platformer', 'Jump across platforms.'), scenes: [{ id: 'main', name: 'Main', entities: [{ id: 'player', name: 'Player', components: { transform: { position: { x: 80, y: 120 } }, collider: { shape: 'rectangle', size: { x: 32, y: 40 } } } }, { id: 'ground', name: 'Ground', components: { transform: { position: { x: 0, y: 420 } }, collider: { shape: 'rectangle', size: { x: 960, y: 40 }, isStatic: true } } }] }] },
  topDown: { ...base('ai-top-down', 'Garden Quest', 'Top-down', 'Move through a small garden.'), scenes: [{ id: 'main', name: 'Garden', entities: [{ id: 'player', name: 'Player', components: { transform: { position: { x: 120, y: 120 } }, collider: { shape: 'rectangle', size: { x: 32, y: 32 } } } }] }] },
  collectible: { ...base('ai-collectible', 'Star Sweep', 'Collectible', 'Collect every star in the room.'), scenes: [{ id: 'main', name: 'Room', entities: [{ id: 'player', name: 'Player', components: { transform: { position: { x: 120, y: 120 } } } }, { id: 'star', name: 'Star', components: { transform: { position: { x: 300, y: 160 } }, collectible: { value: 1 } } }] }] },
}
