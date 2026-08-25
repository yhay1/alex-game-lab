import type { GameDefinition } from './game-definition'

export const sampleGameDefinition: GameDefinition = {
  schemaVersion: '0.1',
  metadata: { id: 'starter-game', name: 'Neon Rooftop Run', description: 'A compact platforming starter scene.', genre: 'Platformer', version: '0.1.0', startingSceneId: 'main-scene' },
  settings: { viewport: { width: 960, height: 540 }, background: '#101827', gravity: { x: 0, y: 980 } },
  assets: [
    { id: 'player-sprite', type: 'sprite', path: 'assets/player.png', width: 48, height: 48 },
    { id: 'platform-sprite', type: 'sprite', path: 'assets/platform.png', width: 256, height: 32 },
  ],
  scenes: [{
    id: 'main-scene', name: 'Main Scene', entities: [
      { id: 'player', name: 'Player', components: { transform: { position: { x: 160, y: 240 } }, sprite: { assetId: 'player-sprite', layer: 2 }, collider: { shape: 'rectangle', size: { x: 40, y: 44 } } } },
      { id: 'starting-platform', name: 'Starting Platform', components: { transform: { position: { x: 120, y: 400 } }, sprite: { assetId: 'platform-sprite', layer: 1 }, collider: { shape: 'rectangle', size: { x: 720, y: 32 }, isStatic: true } } },
      { id: 'goal-platform', name: 'Goal Platform', components: { transform: { position: { x: 680, y: 300 } }, sprite: { assetId: 'platform-sprite', layer: 1 }, collider: { shape: 'rectangle', size: { x: 180, y: 32 }, isStatic: true } } },
      { id: 'energy-cell', name: 'Energy Cell', components: { transform: { position: { x: 740, y: 250 } }, sprite: { assetId: 'player-sprite', layer: 3 }, tags: ['collectible'], collectible: { value: 10, once: true } } },
    ],
  }],
}
