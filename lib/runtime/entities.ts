import type { RuntimeEntity, RuntimeInput, RuntimeState } from './types'

export type EntityConfig = Omit<RuntimeEntity, 'kind'> & { kind: NonNullable<RuntimeEntity['kind']> }

export const createEntity = (config: EntityConfig): RuntimeEntity => ({
  ...config,
  health: config.health ?? 1,
  speed: config.speed ?? 0,
  damage: config.damage ?? 0,
  behavior: config.behavior ?? 'static',
})

export const overlaps = (a: RuntimeEntity, b: RuntimeEntity) =>
  a.position.x < b.position.x + b.size.x && a.position.x + a.size.x > b.position.x &&
  a.position.y < b.position.y + b.size.y && a.position.y + a.size.y > b.position.y

const findPlayer = (entities: RuntimeEntity[]) => entities.find((entity) => entity.kind === 'player' || Boolean(entity.player))

export function updateEnemy(entity: RuntimeEntity, entities: RuntimeEntity[], dt: number) {
  if (entity.kind !== 'enemy') return
  const player = findPlayer(entities)
  if (entity.behavior === 'chase' && player) {
    const direction = Math.sign(player.position.x - entity.position.x)
    entity.position.x += direction * (entity.speed ?? 0) * dt
  }
  if (entity.behavior === 'patrol' && entity.patrol) {
    const patrol = entity.patrol
    const direction = patrol.direction ?? 1
    entity.position.x += direction * (entity.speed ?? 0) * dt
    if (entity.position.x <= patrol.from || entity.position.x + entity.size.x >= patrol.to) patrol.direction = direction === 1 ? -1 : 1
  }
}

export function updateEntities(entities: RuntimeEntity[], input: RuntimeInput, state: RuntimeState, dt: number) {
  const player = findPlayer(entities)
  for (const entity of entities) {
    if (entity.kind === 'enemy') updateEnemy(entity, entities, dt)
    if (entity.kind === 'collectible' && entity.collectible && player && overlaps(entity, player)) {
      state.score += entity.collectible.value
      state.flags[`collected:${entity.id}`] = true
      if (entity.collectible.once !== false) entity.position = { x: -10000, y: -10000 }
    }
    entity.update?.(entity, { dt, input, state })
  }
}

export function applyContactDamage(entities: RuntimeEntity[], state: RuntimeState) {
  const player = findPlayer(entities)
  if (!player) return
  for (const enemy of entities.filter((entity) => entity.kind === 'enemy' && (entity.damage ?? 0) > 0)) {
    if (overlaps(player, enemy)) {
      const cooldownKey = `damageCooldown:${enemy.id}`
      const availableAt = typeof state.flags[cooldownKey] === 'number' ? state.flags[cooldownKey] as number : 0
      if (state.time >= availableAt) {
        player.health = Math.max(0, (player.health ?? 1) - (enemy.damage ?? 0))
        state.flags.playerHealth = player.health
        state.flags[cooldownKey] = state.time + 0.75
      }
    }
  }
}
