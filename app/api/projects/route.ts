import { NextResponse } from 'next/server'
import { createProject, listProjects } from '@/lib/data/game-lab'
import { GAME_GENRES } from '@/lib/data/game-lab-types'

export async function GET() { try { return NextResponse.json(await listProjects()) } catch { return NextResponse.json({ error: 'Unable to load projects' }, { status: 500 }) } }
export async function POST(request: Request) { try { const body = await request.json(); const validGenre = typeof body?.genre === 'string' && GAME_GENRES.includes(body.genre as (typeof GAME_GENRES)[number]); if (typeof body?.name !== 'string' || !body.name.trim() || body.name.length > 80 || !validGenre || (body.description !== undefined && (typeof body.description !== 'string' || body.description.length > 500))) return NextResponse.json({ error: 'Invalid project details' }, { status: 400 }); return NextResponse.json(await createProject({ name: body.name, description: body.description, genre: body.genre }), { status: 201 }) } catch { return NextResponse.json({ error: 'Unable to create project' }, { status: 400 }) } }
