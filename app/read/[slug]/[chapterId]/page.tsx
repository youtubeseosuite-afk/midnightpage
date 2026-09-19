// Path: app/read/[slug]/[chapterId]/page.tsx
// Status: OPDATERET ("den lysende side" — en varm papir-flade med et sagte
// rav-skær omkring sig, midt i det mørke bibliotek. Det er kernebilledet i
// Reader's Portals visuelle identitet, direkte fra navnet Midnight Page)
// Formål: Selve læsevisningen. Arver den mørke baggrund fra
// app/read/layout.tsx; selve teksten sidder på en lys parchment-flade.

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
    <div className="px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/read/${slug}`}
          className="font-ui text-sm text-[#8B90AD] hover:text-[#F2E8D5]"
        >
          ← {book.title}
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-sm bg-[#F2E8D5] px-8 py-12 shadow-[0_0_80px_rgba(228,164,76,0.1)] md:px-16 md:py-20">
        <h1 className="font-display text-2xl font-medium text-[#2A1F14] md:text-3xl">
          {chapter.title}
        </h1>
        <div className="mt-8 font-reading text-[#2A1F14]">
          <RenderTiptapContent content={content} />
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between font-ui text-sm">
        {prevChapter ? (
          <Link
            href={`/read/${slug}/${prevChapter.id}`}
            className="text-[#8B90AD] transition-colors hover:text-[#E4A44C]"
          >
            ← Forrige kapitel
          </Link>
        ) : (
          <span />
        )}
        {nextChapter ? (
          <Link
            href={`/read/${slug}/${nextChapter.id}`}
            className="text-[#8B90AD] transition-colors hover:text-[#E4A44C]"
          >
            Næste kapitel →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
