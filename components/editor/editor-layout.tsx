// Path: components/editor/editor-layout.tsx
// Status: NY
// Formål: Ejer Zen mode-tilstanden for three-pane-layoutet. outline og
// storyBible modtages som allerede-renderede elementer (kan være Server
// Components med egen data-hentning) — denne komponent skal ikke selv kende
// deres data, kun om de skal vises.

'use client'

import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface EditorLayoutProps {
  outline: React.ReactNode
  storyBible: React.ReactNode
  children: React.ReactNode
}

export function EditorLayout({ outline, storyBible, children }: EditorLayoutProps) {
  const [zenMode, setZenMode] = useState(false)

  return (
    <div className="relative flex gap-6 px-4 py-10 md:px-8">
      {!zenMode && outline}

      <div className="mx-auto max-w-3xl flex-1">{children}</div>

      {!zenMode && storyBible}

      <button
        onClick={() => setZenMode((z) => !z)}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-muted-foreground shadow-md backdrop-blur-md hover:bg-accent"
        aria-label={zenMode ? 'Afslut Zen mode' : 'Aktiver Zen mode'}
        title={zenMode ? 'Afslut Zen mode' : 'Zen mode'}
      >
        {zenMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
