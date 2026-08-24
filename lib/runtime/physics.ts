import type { RuntimeEntity, Vec2 } from './types'

export type PhysicsConfig = {
  gravity?: number
  maxFallSpeed?: number
  friction?: number
}

export type Collision = { horizontal: boolean; vertical: boolean; grounded: boolean }

export function overlaps(a: RuntimeEntity, b: RuntimeEntity) {
  return a.position.x < b.position.x + b.size.x && a.position.x + a.size.x > b.position.x && a.position.y < b.position.y + b.size.y && a.position.y + a.size.y > b.position.y
}

export function resolveVertical(entity: RuntimeEntity, platforms: RuntimeEntity[], previous: Vec2): Collision {
  const result: Collision = { horizontal: false, vertical: false, grounded: false }
  for (const platform of platforms) {
    if (platform.id === entity.id || !platform.solid) continue
    const horizontal = entity.position.x < platform.position.x + platform.size.x && entity.position.x + entity.size.x > platform.position.x
    if (!horizontal) continue
    const wasAbove = previous.y + entity.size.y <= platform.position.y
    const wasBelow = previous.y >= platform.position.y + platform.size.y
    if (entity.position.y + entity.size.y >= platform.position.y && wasAbove) {
      entity.position.y = platform.position.y - entity.size.y
      result.vertical = true
      result.grounded = true
    } else if (entity.position.y <= platform.position.y + platform.size.y && wasBelow) {
      entity.position.y = platform.position.y + platform.size.y
      result.vertical = true
    }
  }
  return result
}

export function integrate(entity: RuntimeEntity, dt: number, config: PhysicsConfig = {}) {
  const body = entity.physics ??= { velocity: { x: 0, y: 0 }, gravity: config.gravity ?? 980, maxFallSpeed: config.maxFallSpeed ?? 1200, friction: config.friction ?? 0.8, grounded: false }
  const previous = { ...entity.position }
  body.velocity.y = Math.min(body.velocity.y + body.gravity * dt, body.maxFallSpeed)
  entity.position.x += body.velocity.x * dt
  entity.position.y += body.velocity.y * dt
  body.velocity.x *= Math.pow(body.friction, dt * 60)
  return previous
}

export function resolveHorizontal(entity: RuntimeEntity, platforms: RuntimeEntity[], previous: Vec2): boolean {
  for (const platform of platforms) {
    if (platform.id === entity.id || !platform.solid) continue
    const vertical = entity.position.y < platform.position.y + platform.size.y && entity.position.y + entity.size.y > platform.position.y
    if (!vertical || !overlaps(entity, platform)) continue
    if (previous.x + entity.size.x <= platform.position.x) entity.position.x = platform.position.x - entity.size.x
    else if (previous.x >= platform.position.x + platform.size.x) entity.position.x = platform.position.x + platform.size.x
    else continue
    return true
  }
  return false
}

export function simulatePhysics(entities: RuntimeEntity[], dt: number, config?: PhysicsConfig) {
  const solids = entities.filter((entity) => entity.solid)
  for (const entity of entities) {
    if (!entity.physics || entity.player) continue
    const previous = integrate(entity, dt, config)
    const collision = resolveVertical(entity, solids, previous)
    entity.physics.grounded = collision.grounded
    if (collision.vertical) entity.physics.velocity.y = 0
  }
}
