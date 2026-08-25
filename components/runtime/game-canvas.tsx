'use client'

import { useEffect, useRef } from 'react'
import { CanvasRenderer } from '@/lib/runtime/canvas-renderer'
import { GameRuntime } from '@/lib/game-runtime'
import type { GameDefinition } from '@/lib/game-definition'

export function GameCanvas({ definition }: { definition: GameDefinition }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const runtime = new GameRuntime(definition)
    const renderer = new CanvasRenderer(canvas, runtime.definition)
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width * ratio))
      const height = Math.max(1, Math.floor(rect.height * ratio))
      canvas.width = width
      canvas.height = height
      renderer.render(runtime)
    }
    const loop = (time: number) => {
      runtime.update(1 / 60)
      renderer.render(runtime)
      frameRef.current = requestAnimationFrame(loop)
      void time
    }
    runtime.initialize()
    resize()
    window.addEventListener('resize', resize)
    frameRef.current = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      runtime.destroy()
    }
  }, [definition])

  return <canvas ref={canvasRef} aria-label={`${definition.metadata.name} game preview`} className="h-full w-full" />
}
