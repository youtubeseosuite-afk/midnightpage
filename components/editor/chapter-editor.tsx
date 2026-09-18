// Path: components/editor/chapter-editor.tsx
// Status: OPDATERET
// Formål: Tilføjet Co-writer-panelet. Editor-instansen fanges via onCreate og gemmes
// i en ref, så CowriterPanel kan indsætte AI-forslag direkte i teksten uden at skulle
// være barn af <EditorContent> (novels useEditor-context virker kun der, ikke som
// sideordnet komponent i <EditorRoot>).

'use client'

import { EditorRoot, EditorContent, type EditorInstance, type JSONContent } from 'novel'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useRef, useState } from 'react'
import { CowriterPanel } from './cowriter-panel'

interface ChapterEditorProps {
  chapterId: string
  projectId: string
  initialContent: JSONContent
}

const extensions = [StarterKit]

export function ChapterEditor({ chapterId, projectId, initialContent }: ChapterEditorProps) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const editorRef = useRef<EditorInstance | null>(null)

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

  const insertText = useCallback((text: string) => {
    editorRef.current?.chain().focus().insertContent(text).run()
  }, [])

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
          onCreate={({ editor }) => {
            editorRef.current = editor
          }}
          onUpdate={({ editor }) => {
            saveContent(editor.getJSON())
          }}
        />
      </EditorRoot>

      <CowriterPanel projectId={projectId} onInsert={insertText} />
    </div>
  )
}
