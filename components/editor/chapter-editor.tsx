// Path: components/editor/chapter-editor.tsx
// Status: OPDATERET
// Formål: Rettet til novels nuværende API — pakken eksporterer ikke længere
// et samlet <Editor>-component, kun headless byggesten (EditorRoot/EditorContent).
// Bruger StarterKit som minimum extension-sæt; slash-commands kan bygges oven på senere.

'use client'

import { EditorRoot, EditorContent, type JSONContent } from 'novel'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useRef, useState } from 'react'

interface ChapterEditorProps {
  chapterId: string
  initialContent: JSONContent
}

const extensions = [StarterKit]

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

      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="min-h-[500px] rounded-md border p-4"
          onUpdate={({ editor }) => {
            saveContent(editor.getJSON())
          }}
        />
      </EditorRoot>
    </div>
  )
}
