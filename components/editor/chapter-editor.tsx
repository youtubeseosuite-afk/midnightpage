// Path: components/editor/chapter-editor.tsx
// Status: OPDATERET
// Formål: Tilføjet slash-commands ("/"). Bruger novels indbyggede Command-
// extension (novel/extensions) — se lib/editor/slash-commands.tsx for selve
// kommandolisten. handleCommandNavigation skal wrappes, fordi ProseMirrors
// handleKeyDown tager (view, event), mens novels helper kun forventer (event)
// — ellers fejler typen.

'use client'

import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
  type EditorInstance,
  type JSONContent,
} from 'novel'
import { Command, renderItems, handleCommandNavigation } from 'novel/extensions'
import StarterKit from '@tiptap/starter-kit'
import { useCallback, useMemo, useRef, useState } from 'react'
import { CowriterPanel } from './cowriter-panel'
import { getSlashCommandItems } from '@/lib/editor/slash-commands'

interface ChapterEditorProps {
  chapterId: string
  projectId: string
  initialContent: JSONContent
}

export function ChapterEditor({ chapterId, projectId, initialContent }: ChapterEditorProps) {
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const editorRef = useRef<EditorInstance | null>(null)

  const slashItems = useMemo(() => getSlashCommandItems(projectId), [projectId])

  const extensions = useMemo(
    () => [
      StarterKit,
      Command.configure({
        suggestion: {
          items: () => slashItems,
          render: renderItems(),
        },
      }),
    ],
    [slashItems]
  )

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
          editorProps={{
            handleKeyDown: (_view, event) => handleCommandNavigation(event) ?? false,
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor
          }}
          onUpdate={({ editor }) => {
            saveContent(editor.getJSON())
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-border/50 bg-popover/95 px-1 py-2 shadow-md backdrop-blur-md">
            <EditorCommandEmpty className="px-2 py-1 text-sm text-muted-foreground">
              Ingen resultater
            </EditorCommandEmpty>
            <EditorCommandList>
              {slashItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent aria-selected:bg-accent"
                >
                  {item.icon}
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>

      <CowriterPanel projectId={projectId} onInsert={insertText} />
    </div>
  )
}
