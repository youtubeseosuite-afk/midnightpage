// Path: components/dashboard/project-card.tsx
// Status: NY
// Formål: Ét kort i Project Grid. Genre og completion er placeholder-felter for
// nu (findes ikke i databasen endnu) — kobles til rigtige data senere.

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  id: string
  title: string
  genre: string
  language: 'DA' | 'EN' | 'ES'
  completion: number
}

export function ProjectCard({ id, title, genre, language, completion }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/60 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{genre}</p>
        </div>
        <Badge variant="outline">{language}</Badge>
      </div>

      <div className="mt-4">
        <Progress value={completion} />
        <p className="mt-1 text-xs text-muted-foreground">{completion}% færdig</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button asChild size="sm" variant="secondary" className="flex-1">
          <Link href={`/projects/${id}/books`}>Editor</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link href={`/projects/${id}/characters`}>Karakterer</Link>
        </Button>
      </div>
    </div>
  )
}
