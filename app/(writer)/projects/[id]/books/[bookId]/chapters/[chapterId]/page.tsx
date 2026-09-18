// Path: app/(writer)/projects/[id]/books/[bookId]/chapters/[chapterId]/page.tsx
// Status: OPDATERET (redirect-mål rettet fra /login til /writer/login)
// Formål: Henter kapitlet (kun ejer, via RLS) + bogens project_id, og renderer
// klient-editoren med Co-writer-panelet, som skal kende projectId.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChapterEditor } from '@/components/editor/chapter-editor'
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

  const initialContent = (chapter.content ?? { type: 'doc', content: [] }) as JSONContent

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{chapter.title}</h1>
      <div className="mt-6">
        <ChapterEditor
          chapterId={chapter.id}
          projectId={book.project_id}
          initialContent={initialContent}
        />
      </div>
    </div>
  )
}
