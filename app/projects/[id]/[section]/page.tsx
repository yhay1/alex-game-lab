import { notFound } from 'next/navigation'
import { WorkspacePlaceholder } from '@/components/game-lab-shell'
import { ProjectAiChat } from '@/components/projects/project-ai-chat'
import { getProject } from '@/lib/data/game-lab'
import { ProjectWorkspaceEditor } from '@/components/projects/project-workspace-editor'
import { projectSections } from '@/components/projects/project-workspace-shell'

const descriptions: Record<string, { title: string; description: string; icon: 'sparkles' | 'box' | 'layers' | 'sliders' | 'settings' | 'crosshair' | 'controls' }> = {
  ai: { title: 'AI creation', description: 'Turn a clear game idea into a validated foundation. The generation surface will live here.', icon: 'sparkles' },
  workspace: { title: 'Workspace', description: 'Compose the project foundation with a focused editor surface for scenes and entities.', icon: 'box' },
  assets: { title: 'Assets', description: 'Manage sprites, sounds, fonts, and future asset types for this project.', icon: 'box' },
  scenes: { title: 'Scenes', description: 'Arrange levels, entities, and gameplay rules into a playable sequence.', icon: 'layers' },
  customize: { title: 'Customize', description: 'Tune the visual identity, camera, controls, and runtime behavior.', icon: 'sliders' },
  settings: { title: 'Project settings', description: 'Manage project metadata, access, and workspace preferences.', icon: 'settings' },
  versions: { title: 'Versions', description: 'Review saved foundations and restore an earlier project direction.', icon: 'crosshair' },
  publish: { title: 'Publish', description: 'Prepare a stable build for sharing when the project is ready.', icon: 'controls' },
}

export default async function ProjectSection({ params }: { params: Promise<{ id: string; section: string }> }) {
  const { id, section } = await params
  const content = descriptions[section]
  if (!content || !projectSections.some((item) => item.slug === section)) notFound()
  const project = await getProject(id)
  if (section === 'ai') return <ProjectAiChat projectId={id} projectName={project.name} />
  if (section === 'workspace') return <ProjectWorkspaceEditor project={project} />
  return <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Project section</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{content.title}</h2><p className="mt-2 max-w-xl text-muted-foreground">{content.description}</p><div className="mt-8 max-w-2xl"><WorkspacePlaceholder icon={content.icon} title="Foundation ready" description="This section is connected to the project shell and ready for its focused V0.4 editor surface." className="min-h-40" /></div></div>
}
