// Path: components/editor/chapter-editor.tsx
// Status: NY
// Formål: Novel (Tiptap)-editor med slash-commands for et kapitel.
// Gemmer indholdet som JSONB via PATCH-kald, debounced 1 sekund efter sidste tastetryk.

'use client'

import { Editor as NovelEditor } from 'novel'
import type { JSONContent } from '@tiptap/core'
import { useCallback, useRef, useState } from 'react'

interface ChapterEditorProps {
  chapterId: string
  initialContent: JSONContent
}

export function ChapterEditor({ chapterId, initialContent }: ChapterEditorProps) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveContent = useCallback(
    (content: JSONContent) => {
      setStatus('saving')
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/chapters/${chapterId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          })
          setStatus(res.ok ? 'saved' : 'error')
        } catch {
          setStatus('error')
        }
      }, 1000)
    },
    [chapterId]
  )

  return (
    <div>
      <div className="mb-2 text-xs text-muted-foreground">
        {status === 'saving' && 'Gemmer…'}
        {status === 'saved' && 'Gemt'}
        {status === 'error' && 'Fejl ved gemning — prøver igen ved næste ændring'}
      </div>

      <NovelEditor
        defaultValue={initialContent}
        disableLocalStorage
        onUpdate={(editor) => {
          if (!editor) return
          saveContent(editor.getJSON())
        }}
        className="min-h-[500px] rounded-md border p-4"
      />
    </div>
  )
}
