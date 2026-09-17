// Path: app/(writer)/projects/[id]/books/[bookId]/chapters/[chapterId]/page.tsx
// Status: NY
// Formål: Henter kapitlet (kun ejer, via RLS) og renderer klient-editoren med det
// eksisterende indhold som udgangspunkt.

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
  if (!user) redirect('/login')

  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, title, content')
    .eq('id', chapterId)
    .single()

  if (!chapter) notFound()

  const initialContent = (chapter.content ?? { type: 'doc', content: [] }) as JSONContent

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{chapter.title}</h1>
      <div className="mt-6">
        <ChapterEditor chapterId={chapter.id} initialContent={initialContent} />
      </div>
    </div>
  )
}
