// Path: components/dashboard/project-grid.tsx
// Status: NY
// Formål: "My Projects"-sektionen. Viser EmptyState når projects er tom,
// ellers et grid af ProjectCard + et afsluttende "+"-kort. Begge veje til
// oprettelse deler samme CreateProjectDialog-instans.

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ProjectCard } from '@/components/dashboard/project-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'

interface GridProject {
  id: string
  title: string
  genre: string
  language: 'DA' | 'EN' | 'ES'
  completion: number
}

interface ProjectGridProps {
  projects: GridProject[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <h2 className="text-lg font-medium">My Projects</h2>

      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState onCreateClick={() => setDialogOpen(true)} />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}

          <button
            onClick={() => setDialogOpen(true)}
            className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-background/40 text-muted-foreground backdrop-blur-md hover:bg-background/60"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Create New Project</span>
          </button>
        </div>
      )}

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
