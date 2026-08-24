import { NextResponse } from 'next/server'
import { deleteProject, getProject, updateProject } from '@/lib/data/game-lab'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { return NextResponse.json(await getProject((await params).id)) } catch { return NextResponse.json({ error: 'Not found' }, { status: 404 }) } }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { return NextResponse.json(await updateProject((await params).id, await request.json())) } catch { return NextResponse.json({ error: 'Unable to update project' }, { status: 400 }) } }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { try { await deleteProject((await params).id); return new NextResponse(null, { status: 204 }) } catch { return NextResponse.json({ error: 'Unable to delete project' }, { status: 400 }) } }
