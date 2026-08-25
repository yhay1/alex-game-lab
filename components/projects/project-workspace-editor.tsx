'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Layers3, Play, RotateCcw, Save, Trash2, Copy } from 'lucide-react'
import { GameCanvas } from '@/components/runtime/game-canvas'
import type { GameProject } from '@/lib/data/game-lab-types'
import { projectToGameDefinition } from '@/lib/runtime/project-definition'

type EditorObject = { id: string; name: string; type: string; visible: boolean; position?: { x?: number; y?: number } }

export function ProjectWorkspaceEditor({ project }: { project: GameProject }) {
  const definition = useMemo(() => projectToGameDefinition(project), [project])
  const [sceneIndex, setSceneIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(definition.scenes[0]?.entities[0]?.id ?? null)
  const [objects, setObjects] = useState<EditorObject[]>(() => definition.scenes[0]?.entities.map((entity) => ({ id: entity.id, name: entity.name, type: Object.keys(entity.components)[0] ?? 'entity', visible: true, position: entity.components.transform?.position })) ?? [])
  const selected = objects.find((object) => object.id === selectedId)
  const scene = definition.scenes[sceneIndex]
  const changeScene = (index: number) => { setSceneIndex(index); setSelectedId(definition.scenes[index]?.entities[0]?.id ?? null) }
  const toggle = () => selected && setObjects((current) => current.map((object) => object.id === selected.id ? { ...object, visible: !object.visible } : object))
  const duplicate = () => selected && setObjects((current) => [...current, { ...selected, id: `${selected.id}-copy`, name: `${selected.name} Copy` }])
  const remove = () => selected && setObjects((current) => current.filter((object) => object.id !== selected.id))

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Workspace</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Build your scene</h2><p className="mt-2 max-w-2xl text-muted-foreground">Select an object, inspect its foundation data, and preview the current game without leaving the project.</p></div><div className="flex gap-2"><Link href={`/play/${project.id}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><Play className="size-4" />Playtest</Link><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><Save className="size-4" />Draft saved</button></div></div>
    <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_240px]">
      <aside className="rounded-xl border border-border bg-card p-3"><div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Layers3 className="size-4" />Scenes</div><div className="space-y-1">{definition.scenes.map((item, index) => <button key={item.id} onClick={() => changeScene(index)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${sceneIndex === index ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>{item.name}</button>)}</div></aside>
      <section className="min-w-0 rounded-xl border border-border bg-card p-3"><div className="mb-3 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Live preview</p><p className="text-sm font-medium">{scene?.name ?? 'Scene'}</p></div><button onClick={() => changeScene(sceneIndex)} className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Reset scene selection"><RotateCcw className="size-4" /></button></div><div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted"><GameCanvas definition={definition} /></div><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>Foundation preview</span><span>{objects.length} objects</span></div></section>
      <aside className="rounded-xl border border-border bg-card p-3"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Objects</p><span className="font-mono text-[10px] text-muted-foreground">{objects.length}</span></div><div className="space-y-1">{objects.map((object) => <button key={object.id} onClick={() => setSelectedId(object.id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selectedId === object.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><span className="truncate">{object.name}</span>{!object.visible && <EyeOff className="size-3.5" />}</button>)}</div>{selected && <div className="mt-5 border-t border-border pt-4"><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Inspector</p><h3 className="mt-2 font-medium">{selected.name}</h3><p className="mt-1 text-xs text-muted-foreground">{selected.type} · {selected.id}</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-md bg-muted p-2"><span className="text-muted-foreground">X</span><p>{selected.position?.x ?? 0}</p></div><div className="rounded-md bg-muted p-2"><span className="text-muted-foreground">Y</span><p>{selected.position?.y ?? 0}</p></div></div><div className="mt-4 flex gap-2"><button onClick={toggle} className="flex-1 rounded-md border border-border p-2" aria-label="Toggle visibility">{selected.visible ? <Eye className="mx-auto size-4" /> : <EyeOff className="mx-auto size-4" />}</button><button onClick={duplicate} className="flex-1 rounded-md border border-border p-2" aria-label="Duplicate object"><Copy className="mx-auto size-4" /></button><button onClick={remove} className="flex-1 rounded-md border border-destructive/40 p-2 text-destructive" aria-label="Delete object"><Trash2 className="mx-auto size-4" /></button></div></div>}</aside>
    </div>
  </div>
}
