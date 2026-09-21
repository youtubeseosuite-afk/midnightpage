// Path: components/editor/cowriter-panel.tsx
// Status: OPDATERET (fra fast blok under editoren til en flydende knap/popup —
// virker nu også i skrivetilstand, da den er fixed-positioneret uafhængigt af
// resten af layoutet)
// Formål: Floating Co-writer-knap. Sender instruktionen + kapitlets skrevne
// tekst (via getContextText) + projectId til /api/ai/cowriter, splitter svaret
// i variationer, og lader forfatteren indsætte præcis den, de vil have.

'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

interface CowriterPanelProps {
  projectId: string
  getContextText: () => string
  onInsert: (text: string) => void
}

interface Variant {
  label: string
  text: string
}

function parseVariants(raw: string): Variant[] {
  const parts = raw
    .split(/\n\s*---\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const usable = parts.length > 0 ? parts : [raw.trim()]

  return usable.map((part, i) => {
    const headingMatch = part.match(/^\*\*(.+?)\*\*\s*\n?/)
    if (headingMatch) {
      return {
        label: headingMatch[1].trim(),
        text: part.slice(headingMatch[0].length).trim(),
      }
    }
    return { label: `Variant ${i + 1}`, text: part }
  })
}

export function CowriterPanel({ projectId, getContextText, onInsert }: CowriterPanelProps) {
  const [open, setOpen] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [variants, setVariants] = useState<Variant[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask() {
    if (!instruction.trim()) return
    setLoading(true)
    setError(null)
    setVariants(null)

    try {
      const res = await fetch('/api/ai/cowriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt: instruction,
          contextText: getContextText(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Noget gik galt')
        return
      }
      setVariants(parseVariants(data.text ?? ''))
    } catch {
      setError('Kunne ikke kontakte Co-writer')
    } finally {
      setLoading(false)
    }
  }

  function insert(text: string) {
    onInsert(text)
    setVariants(null)
    setInstruction('')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-20 z-40 flex h-10 items-center gap-2 rounded-full border border-border/50 bg-background/90 px-4 text-sm font-medium shadow-md backdrop-blur-md hover:bg-accent"
      >
        <Sparkles className="h-4 w-4" />
        Co-writer
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-40 max-h-[70vh] w-96 overflow-y-auto rounded-lg border border-border/50 bg-popover p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Co-writer</h2>
            <button onClick={() => setOpen(false)} aria-label="Luk">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Bed Co-writeren om et forslag, fx 'Skriv en dramatisk version af den næste replik'"
            rows={3}
            className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
          />

          <button
            onClick={ask}
            disabled={loading || !instruction.trim()}
            className="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
          >
            {loading ? 'Tænker…' : 'Spørg Co-writer'}
          </button>

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          {variants && (
            <div className="mt-4 space-y-3 border-t pt-3">
              {variants.map((variant, i) => (
                <div key={i} className="rounded-md border p-3">
                  <p className="text-xs font-medium text-muted-foreground">{variant.label}</p>
                  <div className="mt-1 whitespace-pre-wrap text-sm">{variant.text}</div>
                  <button
                    onClick={() => insert(variant.text)}
                    className="mt-2 rounded-md border px-3 py-1.5 text-xs"
                  >
                    Indsæt denne version
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
