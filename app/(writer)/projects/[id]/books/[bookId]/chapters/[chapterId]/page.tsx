// Path: app/(writer)/projects/[id]/books/[bookId]/chapters/[chapterId]/page.tsx
// Status: OPDATERET (tilføjet Zen mode via EditorLayout)
// Formål: Henter kapitlet + alle bogens kapitler (Outline) + projektets
// karakterer og plot-noter (Story Bible). EditorLayout ejer Zen mode-
// tilstanden og skjuler Outline/Story Bible helt når den er aktiv.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChapterEditor } from '@/components/editor/chapter-editor'
import { OutlineSidebar } from '@/components/editor/outline-sidebar'
import { StoryBible } from '@/components/editor/story-bible'
import { EditorLayout } from '@/components/editor/editor-layout'
import type { JSONContent } from '@tiptap/core'

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, title, content, book_id')
    .eq('id', chapterId)
    .single()

  if (!chapter) notFound()

  const { data: book } = await supabase
    .from('books')
    .select('project_id')
    .eq('id', chapter.book_id)
    .single()

  if (!book) notFound()

  const { data: allChapters } = await supabase
    .from('chapters')
    .select('id, title, order_index')
    .eq('book_id', chapter.book_id)
    .order('order_index', { ascending: true })

  const { data: project } = await supabase
    .from('projects')
    .select('plot_notes')
    .eq('id', book.project_id)
    .single()

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, age, motivation, backstory')
    .eq('project_id', book.project_id)
    .order('created_at', { ascending: true })

  const initialContent = (chapter.content ?? { type: 'doc', content: [] }) as JSONContent

  return (
    <EditorLayout
      outline={
        <OutlineSidebar
          projectId={book.project_id}
          bookId={chapter.book_id}
          chapters={allChapters ?? []}
        />
      }
      storyBible={
        <StoryBible
          projectId={book.project_id}
          characters={characters ?? []}
          initialPlotNotes={project?.plot_notes ?? null}
        />
      }
    >
      <h1 className="text-2xl font-semibold">{chapter.title}</h1>
      <div className="mt-6">
        <ChapterEditor
          chapterId={chapter.id}
          projectId={book.project_id}
          initialContent={initialContent}
        />
      </div>
    </EditorLayout>
  )
}
