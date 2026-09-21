// Path: components/editor/chapter-editor.tsx
// Status: OPDATERET (Co-writer er nu en flydende knap/popup i stedet for en
// fast blok — giver den også kapitlets skrevne tekst som kontekst)
// Formål: Titel autosaves separat fra content (samme PATCH-endpoint, forskellige
// felter). Bruger Source Serif 4 til selve teksten — en seriff designet til
// læsning — og .chapter-editor-content (globals.css) til at style overskrifter/
// lister/citater/kode, som ellers var helt ustylede.

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
import {
  Command,
  renderItems,
  handleCommandNavigation,
  TiptapUnderline,
  UpdatedImage,
  ImageResizer,
  Placeholder,
} from 'novel/extensions'
import StarterKit from '@tiptap/starter-kit'
import { Source_Serif_4 } from 'next/font/google'
import { useCallback, useMemo, useRef, useState } from 'react'
import { CowriterPanel } from './cowriter-panel'
import { SelectionToolbar } from './selection-toolbar'
import { getSlashCommandItems } from '@/lib/editor/slash-commands'

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-chapter',
  display: 'swap',
})

interface ChapterEditorProps {
  chapterId: string
  projectId: string
  initialTitle: string
  initialContent: JSONContent
}

export function ChapterEditor({
  chapterId,
  projectId,
  initialTitle,
  initialContent,
}: ChapterEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const contentDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const editorRef = useRef<EditorInstance | null>(null)

  const slashItems = useMemo(() => getSlashCommandItems(projectId), [projectId])

  const extensions = useMemo(
    () => [
      StarterKit,
      TiptapUnderline,
      UpdatedImage,
      Placeholder.configure({ placeholder: 'Skriv løs …' }),
      Command.configure({
        suggestion: {
          items: () => slashItems,
          render: renderItems,
        },
      }),
    ],
    [slashItems]
  )

  const save = useCallback(
    (payload: { content?: JSONContent; title?: string }) => {
      setStatus('saving')
      fetch(`/api/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => setStatus(res.ok ? 'saved' : 'error'))
        .catch(() => setStatus('error'))
    },
    [chapterId]
  )

  const saveContent = useCallback(
    (content: JSONContent) => {
      if (contentDebounceRef.current) clearTimeout(contentDebounceRef.current)
      contentDebounceRef.current = setTimeout(() => save({ content }), 1000)
    },
    [save]
  )

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current)
      titleDebounceRef.current = setTimeout(() => save({ title: value }), 800)
    },
    [save]
  )

  const insertText = useCallback((text: string) => {
    const editor = editorRef.current
    if (!editor) return
    const end = editor.state.doc.content.size
    editor.chain().focus().insertContentAt(end, `\n${text}`).run()
  }, [])

  const getContextText = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return ''
    return editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n')
  }, [])

  return (
    <div className={sourceSerif.variable}>
      <div className="mb-2 text-xs text-muted-foreground">
        {status === 'saving' && 'Gemmer…'}
        {status === 'saved' && 'Gemt'}
        {status === 'error' && 'Fejl ved gemning — prøver igen ved næste ændring'}
      </div>

      <div className="rounded-xl border border-border/60 bg-card shadow-sm">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Kapitlets navn"
          className="w-full border-b border-border/40 bg-transparent px-6 pb-4 pt-6 font-chapter text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/50 md:px-10 md:text-3xl"
        />

        <EditorRoot>
          <EditorContent
            initialContent={initialContent}
            extensions={extensions}
            className="chapter-editor-content min-h-[500px] px-6 py-8 font-chapter text-[17px] leading-[1.8] md:px-10"
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
            <SelectionToolbar projectId={projectId} />
            <ImageResizer />
          </EditorContent>
        </EditorRoot>
      </div>

      <CowriterPanel
        projectId={projectId}
        getContextText={getContextText}
        onInsert={insertText}
      />
    </div>
  )
}
