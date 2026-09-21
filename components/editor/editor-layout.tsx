// Path: components/editor/editor-layout.tsx
// Status: OPDATERET (Zen mode er nu rigtig "skrivetilstand" — et fuldskærms-
// overlay der visuelt dækker topbaren, ikke bare skjuler Outline/Story Bible)
// Formål: I skrivetilstand renderes children i et fixed inset-0-overlay med
// z-50 (over Topbarens z-30), så intet andet er synligt. Outline og Story
// Bible modtages som allerede-renderede elementer (kan være Server
// Components med egen data-hentning) — denne komponent kender ikke deres data.

'use client'

import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface EditorLayoutProps {
  outline: React.ReactNode
  storyBible: React.ReactNode
  children: React.ReactNode
}

export function EditorLayout({ outline, storyBible, children }: EditorLayoutProps) {
  const [writingMode, setWritingMode] = useState(false)

  if (writingMode) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">{children}</div>

        <button
          onClick={() => setWritingMode(false)}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/90 text-muted-foreground shadow-md backdrop-blur-md hover:bg-accent"
          aria-label="Afslut skrivetilstand"
          title="Afslut skrivetilstand"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex gap-6 px-4 py-10 md:px-8">
      {outline}

      <div className="mx-auto max-w-3xl flex-1">{children}</div>

      {storyBible}

      <button
        onClick={() => setWritingMode(true)}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground shadow-md backdrop-blur-md hover:bg-accent"
        aria-label="Aktiver skrivetilstand"
        title="Skrivetilstand"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    </div>
  )
}
