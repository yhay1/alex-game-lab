'use client'

import { useEffect, useRef, useState } from 'react'
import { Runtime } from '@/lib/runtime/core'
import type { RuntimeProject, RuntimeState } from '@/lib/runtime/types'

export function RuntimeHost({ project }: { project: RuntimeProject }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runtimeRef = useRef<Runtime | null>(null)
  const [state, setState] = useState<RuntimeState>({ score: 0, time: 0, flags: {}, status: 'loading' })
  useEffect(() => { if (!canvasRef.current) return; const runtime = new Runtime(canvasRef.current, project, (next) => setState({ ...next })); runtimeRef.current = runtime; runtime.start(); return () => { runtime.destroy(); runtimeRef.current = null } }, [project])
  const restart = () => { runtimeRef.current?.reset(); setState((current) => ({ ...current, status: 'playing', score: 0, time: 0 })) }
  const toggle = () => { const runtime = runtimeRef.current; if (!runtime) return; if (state.status === 'playing') runtime.pause(); else runtime.setStatus('playing') }
  return <div className="flex min-h-screen flex-col bg-[#0b1020] text-white"><header className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Alex Game Lab runtime</p><p className="text-sm text-white/60">Canonical project playtest</p></div><div className="flex items-center gap-3 text-xs text-white/60"><span>Score {state.score}</span><button className="rounded-md border border-white/15 px-3 py-1.5 text-white hover:bg-white/10" onClick={toggle}>{state.status === 'playing' ? 'Pause' : 'Resume'}</button><button className="rounded-md bg-cyan-300 px-3 py-1.5 font-medium text-slate-950 hover:bg-cyan-200" onClick={restart}>Restart</button></div></header><main className="relative flex flex-1 items-center justify-center p-4"><div className="w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 shadow-2xl"><canvas ref={canvasRef} className="mx-auto block h-auto w-full max-w-full rounded-lg [image-rendering:pixelated]" /></div>{state.status !== 'playing' && <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-xl border border-white/15 bg-slate-950/90 p-6 text-center shadow-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{state.status.replace('-', ' ')}</p><h2 className="mt-2 text-2xl font-semibold">{state.status === 'paused' ? 'Game paused' : state.status === 'game-over' ? 'Game over' : state.status === 'level-complete' ? 'Level complete' : 'Loading game'}</h2><button className="mt-4 rounded-md bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950" onClick={state.status === 'paused' ? toggle : restart}>{state.status === 'paused' ? 'Resume' : 'Restart'}</button></div></div>}</main></div>
}
