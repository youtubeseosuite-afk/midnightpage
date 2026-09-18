// Path: components/dashboard/hero-continue-writing.tsx
// Status: NY
// Formål: Fremtrædende kort i toppen af dashboardet. Placeholder-props for nu.

import Link from 'next/link'
import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroContinueWritingProps {
  projectTitle: string
  chapterTitle: string
  lastEditedAt: string
  resumeHref: string
}

export function HeroContinueWriting({
  projectTitle,
  chapterTitle,
  lastEditedAt,
  resumeHref,
}: HeroContinueWritingProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-background/60 to-background/60 p-8 backdrop-blur-xl">
      <p className="text-sm font-medium text-muted-foreground">Fortsæt hvor du slap</p>
      <h2 className="mt-2 text-2xl font-semibold">{projectTitle}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {chapterTitle} · redigeret {lastEditedAt}
      </p>

      <Button asChild className="mt-6 gap-2">
        <Link href={resumeHref}>
          <PenLine className="h-4 w-4" />
          Genoptag skrivning
        </Link>
      </Button>
    </div>
  )
}
