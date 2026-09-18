// Path: app/(writer)/projects/[id]/books/[bookId]/page.tsx
// Status: OPDATERET (redirect-mål rettet fra /login til /writer/login)
// Formål: Bogens oversigt — liste over kapitler, opret nyt kapitel, og
// udgivelses-flow (draft <-> published). Del af trin 6 (publiceringsflow).

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import type { BookStatus } from '@/lib/types/database'

async function createChapter(
  bookId: string,
  projectId: string,
  nextOrderIndex: number,
  formData: FormData
) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const title = formData.get('title') as string

  const { data: chapter, error } = await supabase
    .from('chapters')
    .insert({ book_id: bookId, title, order_index: nextOrderIndex })
    .select('id')
    .single()

  if (error || !chapter) {
    console.error(error)
    return
  }

  redirect(`/projects/${projectId}/books/${bookId}/chapters/${chapter.id}`)
}

async function togglePublish(
  bookId: string,
  projectId: string,
  currentStatus: BookStatus
) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const nextStatus: BookStatus = currentStatus === 'published' ? 'draft' : 'published'

  await supabase
    .from('books')
    .update({
      status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', bookId)

  redirect(`/projects/${projectId}/books/${bookId}`)
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string; bookId: string }>
}) {
  const { id: projectId, bookId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: book } = await supabase
    .from('books')
    .select('id, title, description, status, slug, language')
    .eq('id', bookId)
    .single()

  if (!book) notFound()

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index, status')
    .eq('book_id', bookId)
    .order('order_index', { ascending: true })

  const nextOrderIndex = chapters?.length ?? 0
  const createChapterAction = createChapter.bind(null, bookId, projectId, nextOrderIndex)
  const togglePublishAction = togglePublish.bind(null, bookId, projectId, book.status)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{book.title}</h1>
        <form action={togglePublishAction}>
          <button type="submit" className="rounded-md border px-3 py-1.5 text-sm">
            {book.status === 'published' ? 'Sæt tilbage til kladde' : 'Udgiv'}
          </button>
        </form>
      </div>

      {book.status === 'published' && (
        <p className="mt-1 text-sm text-muted-foreground">
          Offentlig URL (kræver Reader&apos;s Portal — bygges i trin 7): /read/{book.slug}
        </p>
      )}

      {book.description && (
        <p className="mt-3 text-sm text-muted-foreground">{book.description}</p>
      )}

      <h2 className="mt-8 text-lg font-medium">Kapitler</h2>
      <ul className="mt-3 space-y-2">
        {chapters?.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/projects/${projectId}/books/${bookId}/chapters/${chapter.id}`}
              className="block rounded-lg border p-3 hover:bg-muted"
            >
              {chapter.order_index + 1}. {chapter.title}
            </Link>
          </li>
        ))}
        {chapters?.length === 0 && (
          <p className="text-sm text-muted-foreground">Ingen kapitler endnu.</p>
        )}
      </ul>

      <form action={createChapterAction} className="mt-6 flex gap-2 border-t pt-6">
        <input
          name="title"
          required
          placeholder={`Kapitel ${nextOrderIndex + 1}`}
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          Nyt kapitel
        </button>
      </form>
    </div>
  )
}
