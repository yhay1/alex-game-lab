'use client'

import { useEffect, useRef, useState } from 'react'
import { Runtime } from '@/lib/runtime/core'
import type { RuntimeProject, RuntimeState } from '@/lib/runtime/types'

export function RuntimeHost({ project }: { project: RuntimeProject }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<Runtime | null>(null)
  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)
  useEffect(() => { if (!canvasRef.current) return; const runtime = new Runtime(canvasRef.current, project, (state: RuntimeState) => setScore(state.score)); runtimeRef.current = runtime; runtime.start(); return () => runtime.stop() }, [project])
  return <div className="flex min-h-screen flex-col bg-[#0b1020] text-white"><header className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Alex Game Lab runtime</p><p className="text-sm text-white/60">Browser playtest foundation</p></div><div className="flex items-center gap-3 text-xs text-white/60"><span>Score {score}</span><button className="rounded-md border border-white/15 px-3 py-1.5 text-white hover:bg-white/10" onClick={() => { if (!runtimeRef.current) return; if (running) runtimeRef.current.stop(); else runtimeRef.current.start(); setRunning(!running) }}>{running ? 'Pause' : 'Resume'}</button><button className="rounded-md bg-cyan-300 px-3 py-1.5 font-medium text-slate-950 hover:bg-cyan-200" onClick={() => runtimeRef.current?.reset()}>Reset</button></div></header><main className="flex flex-1 items-center justify-center p-4"><div className="w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 shadow-2xl"><canvas ref={canvasRef} className="mx-auto block h-auto w-full max-w-full rounded-lg [image-rendering:pixelated]" /></div></main><p className="pb-5 text-center text-xs text-white/40">Use arrow keys or WASD to move the test entity.</p></div>
}
