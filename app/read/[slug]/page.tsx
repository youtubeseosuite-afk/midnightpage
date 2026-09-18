// Path: app/read/[slug]/page.tsx
// Status: NY
// Formål: Offentlig bogside. Selve kapitel-læsevisningen (/read/[slug]/[chapterId])
// bygges i næste tur.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PublicBookPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: book } = await supabase
    .from('books')
    .select('id, title, description, language')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!book) notFound()

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index')
    .eq('book_id', book.id)
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/read" className="text-sm text-muted-foreground hover:underline">
        ← Bibliotek
      </Link>

      <h1 className="mt-4 text-3xl font-semibold">{book.title}</h1>
      {book.description && <p className="mt-2 text-muted-foreground">{book.description}</p>}

      <ul className="mt-8 space-y-2">
        {chapters?.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/read/${slug}/${chapter.id}`}
              className="block rounded-lg border p-3 hover:bg-muted"
            >
              {chapter.order_index + 1}. {chapter.title}
            </Link>
          </li>
        ))}
        {chapters?.length === 0 && (
          <p className="text-sm text-muted-foreground">Ingen kapitler publiceret endnu.</p>
        )}
      </ul>
    </div>
  )
}
