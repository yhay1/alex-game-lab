import type { RuntimeEntity, RuntimeInput, RuntimeState } from './types'
import { integrate, resolveHorizontal, resolveVertical } from './physics'

export type PlayerConfig = {
  speed: number
  jumpForce: number
  gravity: number
  groundY?: number
  controls?: { left?: string[]; right?: string[]; jump?: string[] }
}

export type PlayerEntity = RuntimeEntity & { player?: PlayerConfig & { velocity?: { x: number; y: number }; grounded?: boolean } }

const pressed = (input: RuntimeInput, values: string[]) => values.some((key) => input.keys.has(key) || input.touch[key as keyof typeof input.touch])

export function createPlayer(config: PlayerConfig, entity: Omit<RuntimeEntity, 'update'>): PlayerEntity {
  const player = { ...entity, player: { ...config, velocity: { x: 0, y: 0 }, grounded: false } } as PlayerEntity
  player.update = (current, context) => updatePlayer(current as PlayerEntity, context.input, context.dt)
  return player
}

export function updatePlayer(entity: PlayerEntity, input: RuntimeInput, dt: number, platforms: RuntimeEntity[] = []) {
  const config = entity.player
  if (!config) return
  const controls = { left: ['ArrowLeft', 'a'], right: ['ArrowRight', 'd'], jump: ['ArrowUp', 'w', ' '], ...config.controls }
  const left = pressed(input, controls.left ?? []); const right = pressed(input, controls.right ?? [])
  config.velocity ??= { x: 0, y: 0 }; config.grounded ??= false
  entity.physics ??= { velocity: config.velocity, gravity: config.gravity, maxFallSpeed: 1200, friction: 0.82, grounded: config.grounded }
  entity.physics.velocity = config.velocity
  entity.physics.gravity = config.gravity
  entity.physics.velocity.x = (right ? 1 : 0) * config.speed - (left ? 1 : 0) * config.speed
  if (pressed(input, controls.jump ?? []) && config.grounded) { entity.physics.velocity.y = -config.jumpForce; config.grounded = false }
  const previous = integrate(entity, dt)
  const hitSide = resolveHorizontal(entity, platforms, previous)
  const collision = resolveVertical(entity, platforms, previous)
  if (hitSide) entity.physics.velocity.x = 0
  if (config.groundY !== undefined && entity.position.y + entity.size.y >= config.groundY && entity.physics.velocity.y >= 0) { entity.position.y = config.groundY - entity.size.y; collision.grounded = true }
  if (collision.vertical || collision.grounded) entity.physics.velocity.y = 0
  config.grounded = collision.grounded
  entity.physics.grounded = collision.grounded
}

export function playerState(entity: PlayerEntity, state: RuntimeState) { state.flags.playerGrounded = entity.player?.grounded ?? false }
