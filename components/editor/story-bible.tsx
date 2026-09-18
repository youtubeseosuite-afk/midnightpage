// Path: components/editor/story-bible.tsx
// Status: NY
// Formål: Højre panel i three-pane-layoutet. Karakter-listen er ren visning
// (data hentes af den kaldende side); plot-noter har samme debounced-autosave
// mønster som ChapterEditor. AI-chatten (Co-writer) flyttes ind i dette panel
// i en senere oprydning — den ligger stadig under selve editoren for nu.

'use client'

import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryBibleCharacter {
  id: string
  name: string
  age: number
  motivation: string | null
  backstory: string | null
}

interface StoryBibleProps {
  projectId: string
  characters: StoryBibleCharacter[]
  initialPlotNotes: string | null
}

export function StoryBible({ projectId, characters, initialPlotNotes }: StoryBibleProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [plotNotes, setPlotNotes] = useState(initialPlotNotes ?? '')
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveNotes = useCallback(
    (value: string) => {
      setStatus('saving')
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/projects/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plot_notes: value }),
          })
          setStatus(res.ok ? 'saved' : 'error')
        } catch {
          setStatus('error')
        }
      }, 1000)
    },
    [projectId]
  )

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:bg-accent"
        aria-label="Vis Story Bible"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="w-72 shrink-0 space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Story Bible</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          aria-label="Skjul Story Bible"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h3 className="px-1 text-xs font-medium uppercase text-muted-foreground">Karakterer</h3>
        <ul className="mt-2 space-y-2">
          {characters.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-border/50 bg-background/60 p-2 text-sm"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {c.name} <span className="text-muted-foreground">({c.age})</span>
              </div>
              {(c.motivation || c.backstory) && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {c.motivation || c.backstory}
                </p>
              )}
            </li>
          ))}
          {characters.length === 0 && (
            <p className="px-1 text-xs text-muted-foreground">Ingen karakterer endnu.</p>
          )}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-medium uppercase text-muted-foreground">Plot-noter</h3>
          <span
            className={cn(
              'text-xs text-muted-foreground',
              status === 'error' && 'text-destructive'
            )}
          >
            {status === 'saving' && 'Gemmer…'}
            {status === 'saved' && 'Gemt'}
            {status === 'error' && 'Fejl'}
          </span>
        </div>
        <textarea
          value={plotNotes}
          onChange={(e) => {
            setPlotNotes(e.target.value)
            saveNotes(e.target.value)
          }}
          rows={10}
          placeholder="Løse tråde, foreshadowing, ting der skal huskes senere…"
          className="mt-2 w-full rounded-md border border-border/50 bg-background/60 px-3 py-2 text-sm"
        />
      </div>
    </div>
  )
}
