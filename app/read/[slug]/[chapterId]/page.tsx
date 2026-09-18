// Path: app/read/[slug]/[chapterId]/page.tsx
// Status: NY
// Formål: Selve læsevisningen af et publiceret kapitel. Kræver at både bogen og
// kapitlet har status 'published' (RLS tillader det for alle, ingen login krævet).

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RenderTiptapContent } from '@/lib/tiptap/render-content'
import type { JSONContent } from '@tiptap/core'

export default async function PublicChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>
}) {
  const { slug, chapterId } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!book) notFound()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, title, content, order_index')
    .eq('id', chapterId)
    .eq('book_id', book.id)
    .eq('status', 'published')
    .single()

  if (!chapter) notFound()

  const { data: siblingChapters } = await supabase
    .from('chapters')
    .select('id, order_index')
    .eq('book_id', book.id)
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  const currentIndex = siblingChapters?.findIndex((c) => c.id === chapter.id) ?? -1
  const prevChapter = currentIndex > 0 ? siblingChapters?.[currentIndex - 1] : null
  const nextChapter =
    currentIndex >= 0 && currentIndex < (siblingChapters?.length ?? 0) - 1
      ? siblingChapters?.[currentIndex + 1]
      : null

  const content = (chapter.content ?? { type: 'doc', content: [] }) as JSONContent

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/read/${slug}`} className="text-sm text-muted-foreground hover:underline">
        ← {book.title}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">{chapter.title}</h1>

      <div className="mt-8">
        <RenderTiptapContent content={content} />
      </div>

      <div className="mt-12 flex items-center justify-between border-t pt-6 text-sm">
        {prevChapter ? (
          <Link href={`/read/${slug}/${prevChapter.id}`} className="hover:underline">
            ← Forrige kapitel
          </Link>
        ) : (
          <span />
        )}
        {nextChapter ? (
          <Link href={`/read/${slug}/${nextChapter.id}`} className="hover:underline">
            Næste kapitel →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
