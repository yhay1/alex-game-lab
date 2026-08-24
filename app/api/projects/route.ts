import { NextResponse } from 'next/server'
import { createProject, listProjects } from '@/lib/data/game-lab'

export async function GET() { try { return NextResponse.json(await listProjects()) } catch { return NextResponse.json({ error: 'Unable to load projects' }, { status: 500 }) } }
export async function POST(request: Request) { try { const body = await request.json(); return NextResponse.json(await createProject(body), { status: 201 }) } catch { return NextResponse.json({ error: 'Unable to create project' }, { status: 400 }) } }
