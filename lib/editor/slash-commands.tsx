// Path: lib/editor/slash-commands.tsx
// Status: NY
// Formål: Definerer "/"-kommandolisten. Selve trigger-mekanikken kommer fra
// novels indbyggede Command-extension (novel/extensions) — her er kun listen
// af kommandoer og hvad hver af dem gør. "AI: Fortsæt skrivning" kalder det
// eksisterende Co-writer-endpoint og indsætter svaret hvor cursoren stod.

import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Text,
  Sparkles,
} from 'lucide-react'
import { createSuggestionItems, type SuggestionItem } from 'novel/extensions'

export function getSlashCommandItems(projectId: string): SuggestionItem[] {
  return createSuggestionItems([
    {
      title: 'Tekst',
      description: 'Almindeligt afsnit.',
      searchTerms: ['paragraph', 'text', 'afsnit'],
      icon: <Text size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('paragraph').run()
      },
    },
    {
      title: 'Overskrift 1',
      description: 'Stor sektionsoverskrift.',
      searchTerms: ['heading', 'h1', 'overskrift'],
      icon: <Heading1 size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
      },
    },
    {
      title: 'Overskrift 2',
      description: 'Mellemstor sektionsoverskrift.',
      searchTerms: ['heading', 'h2', 'overskrift'],
      icon: <Heading2 size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
      },
    },
    {
      title: 'Overskrift 3',
      description: 'Lille sektionsoverskrift.',
      searchTerms: ['heading', 'h3', 'overskrift'],
      icon: <Heading3 size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
      },
    },
    {
      title: 'Punktliste',
      description: 'Uordnet liste.',
      searchTerms: ['bullet', 'list', 'liste'],
      icon: <List size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run()
      },
    },
    {
      title: 'Nummereret liste',
      description: 'Ordnet liste.',
      searchTerms: ['ordered', 'list', 'nummereret'],
      icon: <ListOrdered size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run()
      },
    },
    {
      title: 'Citat',
      description: 'Blockquote til dialog eller citater.',
      searchTerms: ['quote', 'blockquote', 'citat'],
      icon: <Quote size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run()
      },
    },
    {
      title: 'Kodeblok',
      description: 'Formateret kodeblok.',
      searchTerms: ['code', 'kode'],
      icon: <Code size={16} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
      },
    },
    {
      title: 'AI: Fortsæt skrivning',
      description: 'Lad Co-writeren fortsætte teksten fra cursoren.',
      searchTerms: ['ai', 'continue', 'fortsæt', 'co-writer'],
      icon: <Sparkles size={16} />,
      command: ({ editor, range }) => {
        const from = range.from
        const placeholder = '⏳ AI skriver…'

        editor.chain().focus().deleteRange(range).insertContentAt(from, placeholder).run()

        const textBefore = editor.state.doc.textBetween(0, from, '\n\n').slice(-1500)

        fetch('/api/ai/cowriter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            prompt: `Fortsæt teksten naturligt i samme stil og stemme, uden at introducere eller kommentere den. Skriv kun den fortsatte tekst. Her er de sidste linjer:\n\n${textBefore}`,
          }),
        })
          .then((res) => res.json())
          .then((data: { text?: string }) => {
            editor
              .chain()
              .focus()
              .deleteRange({ from, to: from + placeholder.length })
              .insertContentAt(from, data.text ?? '(Co-writer kunne ikke svare)')
              .run()
          })
          .catch(() => {
            editor
              .chain()
              .focus()
              .deleteRange({ from, to: from + placeholder.length })
              .insertContentAt(from, '(Co-writer kunne ikke svare)')
              .run()
          })
      },
    },
  ])
}
