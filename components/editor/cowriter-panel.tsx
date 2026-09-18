// Path: components/editor/cowriter-panel.tsx
// Status: NY
// Formål: UI til AI Co-writer. Sender en instruktion + projectId til
// /api/ai/cowriter, viser svaret, og lader forfatteren indsætte det i teksten
// via onInsert (kaldt med editor-instansen fra ChapterEditor).

'use client'

import { useState } from 'react'

interface CowriterPanelProps {
  projectId: string
  onInsert: (text: string) => void
}

export function CowriterPanel({ projectId, onInsert }: CowriterPanelProps) {
  const [instruction, setInstruction] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function ask() {
    if (!instruction.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

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
      setResult(data.text)
    } catch {
      setError('Kunne ikke kontakte Co-writer')
    } finally {
      setLoading(false)
    }
  }

  function insert() {
    if (!result) return
    onInsert(result)
    setResult(null)
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

      {result && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">{result}</div>
          <button onClick={insert} className="rounded-md border px-3 py-1.5 text-sm">
            Indsæt i teksten
          </button>
        </div>
      )}
    </div>
  )
}
