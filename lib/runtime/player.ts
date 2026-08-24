import type { RuntimeEntity, RuntimeInput, RuntimeState } from './types'

export type PlayerConfig = {
  speed: number
  jumpForce: number
  gravity: number
  groundY: number
  controls?: { left?: string[]; right?: string[]; jump?: string[] }
}

export type PlayerEntity = RuntimeEntity & { player?: PlayerConfig & { velocity?: { x: number; y: number }; grounded?: boolean } }

const pressed = (input: RuntimeInput, values: string[]) => values.some((key) => input.keys.has(key) || input.touch[key as keyof typeof input.touch])

export function createPlayer(config: PlayerConfig, entity: Omit<RuntimeEntity, 'update'>): PlayerEntity {
  const player = { ...entity, player: { ...config, velocity: { x: 0, y: 0 }, grounded: false } } as PlayerEntity
  player.update = (current, context) => updatePlayer(current as PlayerEntity, context.input, context.dt)
  return player
}

export function updatePlayer(entity: PlayerEntity, input: RuntimeInput, dt: number) {
  const config = entity.player
  if (!config) return
  const controls = { left: ['ArrowLeft', 'a'], right: ['ArrowRight', 'd'], jump: ['ArrowUp', 'w', ' '], ...config.controls }
  const left = pressed(input, controls.left ?? []); const right = pressed(input, controls.right ?? [])
  config.velocity ??= { x: 0, y: 0 }; config.grounded ??= false
  config.velocity.x = (right ? 1 : 0) * config.speed - (left ? 1 : 0) * config.speed
  if (pressed(input, controls.jump ?? []) && config.grounded) { config.velocity.y = -config.jumpForce; config.grounded = false }
  config.velocity.y += config.gravity * dt
  entity.position.x += config.velocity.x * dt; entity.position.y += config.velocity.y * dt
  if (entity.position.y + entity.size.y >= config.groundY) { entity.position.y = config.groundY - entity.size.y; config.velocity.y = 0; config.grounded = true }
}

export function playerState(entity: PlayerEntity, state: RuntimeState) { state.flags.playerGrounded = entity.player?.grounded ?? false }
