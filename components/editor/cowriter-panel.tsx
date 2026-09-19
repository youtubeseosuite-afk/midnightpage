// Path: components/editor/cowriter-panel.tsx
// Status: OPDATERET (viser nu hver variant for sig med egen indsæt-knap, i
// stedet for at indsætte hele svaret som én klump)
// Formål: UI til AI Co-writer. Sender en instruktion + projectId til
// /api/ai/cowriter, splitter svaret i variationer (adskilt med "---" af
// system-prompten), og lader forfatteren indsætte præcis den variant de vil
// have via onInsert. Faldback til ét samlet svar, hvis modellen ikke bruger
// separatoren.

'use client'

import { useState } from 'react'

interface CowriterPanelProps {
  projectId: string
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

export function CowriterPanel({ projectId, onInsert }: CowriterPanelProps) {
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
        body: JSON.stringify({ projectId, prompt: instruction }),
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
  }

  return (
    <div className="mt-6 rounded-md border p-4">
      <h2 className="text-sm font-medium">Co-writer</h2>

      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Bed Co-writeren om et forslag, fx 'Skriv en dramatisk version af den næste replik'"
        rows={3}
        className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
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
        <div className="mt-4 space-y-4 border-t pt-4">
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
  )
}
