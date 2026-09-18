// Path: components/editor/selection-toolbar.tsx
// Status: NY
// Formål: Floating toolbar der vises, når tekst markeres. Skal renderes som
// barn af <EditorContent> (ligesom EditorCommand), da useEditor()-context kun
// virker der. EditorBubble håndterer selv positionering/visning (skjules
// automatisk ved tom markering eller på billeder).

'use client'

import { EditorBubble, EditorBubbleItem, useEditor, type EditorInstance } from 'novel'
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough } from 'lucide-react'
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

export function SelectionToolbar() {
  const { editor } = useEditor()
  if (!editor) return null

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
    </EditorBubble>
  )
}
