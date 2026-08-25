import { NextResponse } from 'next/server'
import { createProject, listProjects } from '@/lib/data/game-lab'

export async function GET() { try { return NextResponse.json(await listProjects()) } catch { return NextResponse.json({ error: 'Unable to load projects' }, { status: 500 }) } }
export async function POST(request: Request) { try { const body = await request.json(); if (typeof body?.name !== 'string' || !body.name.trim() || body.name.length > 80 || typeof body?.genre !== 'string') return NextResponse.json({ error: 'Invalid project details' }, { status: 400 }); return NextResponse.json(await createProject({ name: body.name, description: typeof body.description === 'string' ? body.description : undefined, genre: body.genre }), { status: 201 }) } catch { return NextResponse.json({ error: 'Unable to create project' }, { status: 400 }) } }
