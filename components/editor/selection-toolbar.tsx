// Path: components/editor/selection-toolbar.tsx
// Status: OPDATERET (tilføjet billed-knap)
// Formål: Floating toolbar for markeret tekst. Billed-knappen sender den
// markerede tekst som prompt til /api/ai/generate-image og indsætter
// resultatet direkte via UpdatedImage-nodens setImage-kommando. Skal
// renderes som barn af <EditorContent>, ligesom EditorCommand.

'use client'

import { useState } from 'react'
import { EditorBubble, EditorBubbleItem, useEditor, type EditorInstance } from 'novel'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkButton {
  name: string
  label: string
  icon: typeof Bold
  toggle: (editor: EditorInstance) => void
}

const MARK_BUTTONS: MarkButton[] = [
  {
    name: 'bold',
    label: 'Fed',
    icon: Bold,
    toggle: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    label: 'Kursiv',
    icon: Italic,
    toggle: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    name: 'underline',
    label: 'Understreget',
    icon: UnderlineIcon,
    toggle: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    name: 'strike',
    label: 'Overstreget',
    icon: Strikethrough,
    toggle: (editor) => editor.chain().focus().toggleStrike().run(),
  },
]

interface SelectionToolbarProps {
  projectId: string
}

export function SelectionToolbar({ projectId }: SelectionToolbarProps) {
  const { editor } = useEditor()
  const [generatingImage, setGeneratingImage] = useState(false)

  if (!editor) return null

  async function generateImage(ed: EditorInstance) {
    const { from, to } = ed.state.selection
    const prompt = ed.state.doc.textBetween(from, to, ' ').trim()
    if (!prompt || generatingImage) return

    setGeneratingImage(true)
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, projectId }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        ed.chain().focus().setImage({ src: data.url, alt: prompt }).run()
      }
    } finally {
      setGeneratingImage(false)
    }
  }

  return (
    <EditorBubble className="flex gap-0.5 rounded-md border border-border/50 bg-popover/95 p-1 shadow-md backdrop-blur-md">
      {MARK_BUTTONS.map((mark) => {
        const Icon = mark.icon
        const active = editor.isActive(mark.name)
        return (
          <EditorBubbleItem
            key={mark.name}
            onSelect={(ed) => mark.toggle(ed)}
            className={cn(
              'flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-accent',
              active && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
          </EditorBubbleItem>
        )
      })}

      <EditorBubbleItem
        onSelect={(ed) => generateImage(ed)}
        className={cn(
          'flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm hover:bg-accent',
          generatingImage && 'pointer-events-none opacity-50'
        )}
      >
        {generatingImage ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
      </EditorBubbleItem>
    </EditorBubble>
  )
}
