'use client'

export default function ProjectsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="min-h-screen px-5 py-16"><div className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-card p-8 text-center"><h1 className="text-xl font-semibold">Projects could not load</h1><p className="mt-2 text-sm text-muted-foreground">Something went wrong while loading your projects.</p><button onClick={reset} className="mt-6 h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Try again</button></div></main> }
