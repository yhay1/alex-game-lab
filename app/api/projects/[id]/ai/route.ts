import { streamText } from 'ai'
import { getProject, updateProject } from '@/lib/data/game-lab'
import { validateAiGameDefinition } from '@/lib/ai-game-definition'
import { createClient } from '@/lib/supabase/server'
import { resolveUserAssetReferences } from '@/lib/data/asset-references-server'

export const runtime = 'nodejs'

const MODEL = 'openai/gpt-5-mini'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  const body = await request.json() as { messages?: Array<{ role: string; content: string }>; assetReferences?: Array<{ id?: string }> }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
  const assetIds = Array.isArray(body.assetReferences) ? body.assetReferences.map((reference) => reference.id).filter((id): id is string => typeof id === 'string').slice(0, 12) : []
  const assetReferences = await resolveUserAssetReferences(user.id, assetIds)
  const prompt = messages.map((message) => `${message.role}: ${message.content}`).join('\n')
  const result = streamText({
    model: MODEL,
    system: `You are Game Lab AI for the private project ${project.name}. Help with game design and explain concrete next steps. The project currently uses ${project.genre}. You may suggest changes, but never claim a mutation happened unless the app performs it. Keep responses concise and actionable.\nProject foundation summary: ${JSON.stringify(project.foundation).slice(0, 12000)}\nAuthoritative asset references: ${JSON.stringify(assetReferences).slice(0, 6000)}`,
    prompt,
    temperature: 0.4,
    onFinish: async ({ text }) => {
      const match = text.match(/```json\s*([\s\S]*?)```/)
      if (!match) return
      try {
        const candidate = JSON.parse(match[1])
        const checked = validateAiGameDefinition(candidate)
        if (checked.ok) await updateProject(id, { foundation: checked.definition as unknown as typeof project.foundation })
      } catch { /* AI suggestions remain advisory when not valid JSON */ }
    },
  })
  return result.toTextStreamResponse()
}
