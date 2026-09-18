// Path: app/(writer)/projects/[id]/books/[bookId]/chapters/[chapterId]/page.tsx
// Status: OPDATERET (tilføjet Outline sidebar — første del af three-pane-layoutet)
// Formål: Henter kapitlet + alle bogens kapitler (til Outline) + bogens
// project_id, og renderer Outline sidebar + editoren side om side.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChapterEditor } from '@/components/editor/chapter-editor'
import { OutlineSidebar } from '@/components/editor/outline-sidebar'
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

  const initialContent = (chapter.content ?? { type: 'doc', content: [] }) as JSONContent

  return (
    <div className="flex gap-6 px-4 py-10 md:px-8">
      <OutlineSidebar
        projectId={book.project_id}
        bookId={chapter.book_id}
        chapters={allChapters ?? []}
      />

      <div className="mx-auto max-w-3xl flex-1">
        <h1 className="text-2xl font-semibold">{chapter.title}</h1>
        <div className="mt-6">
          <ChapterEditor
            chapterId={chapter.id}
            projectId={book.project_id}
            initialContent={initialContent}
          />
        </div>
      </div>
    </div>
  )
}
