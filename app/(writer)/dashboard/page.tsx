// Path: app/(writer)/dashboard/page.tsx
// Status: NY
// Formål: Dashboardets hovedside. Bruger placeholder-data, som ønsket, indtil
// den kobles til rigtige Supabase-data (projekter, karakterer, seneste kapitel).

import { HeroContinueWriting } from '@/components/dashboard/hero-continue-writing'
import { ProjectGrid } from '@/components/dashboard/project-grid'
import { CharacterForge } from '@/components/dashboard/character-forge'

const PLACEHOLDER_PROJECTS = [
  { id: '1', title: 'Kronens Grænse', genre: 'Fantasy', language: 'DA' as const, completion: 62 },
  { id: '2', title: 'Midnight Signals', genre: 'Sci-fi thriller', language: 'EN' as const, completion: 24 },
  { id: '3', title: 'El Último Faro', genre: 'Drama', language: 'ES' as const, completion: 88 },
]

const PLACEHOLDER_CHARACTERS = [
  { id: 'a', name: 'Elin Vang', role: 'Protagonist', avatarUrl: null },
  { id: 'b', name: 'Marcus Reyes', role: 'Antagonist', avatarUrl: null },
  { id: 'c', name: 'Ida Storm', role: 'Bipersonage', avatarUrl: null },
  { id: 'd', name: 'Tomás Reyes', role: 'Mentor', avatarUrl: null },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 md:px-8">
      <HeroContinueWriting
        projectTitle="Kronens Grænse"
        chapterTitle="Kapitel 4: Belejringen"
        lastEditedAt="for 2 timer siden"
        resumeHref="/projects/1/books"
      />

      <ProjectGrid projects={PLACEHOLDER_PROJECTS} />

      <CharacterForge characters={PLACEHOLDER_CHARACTERS} />
    </div>
  )
}
