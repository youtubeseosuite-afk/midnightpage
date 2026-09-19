// Path: app/read/[slug]/page.tsx
// Status: OPDATERET (bogomslag-stil — matcher Reader's Portals nye visuelle
// identitet fra /read: genre som jacket-label, kapitel-listen som et rigtigt
// indholdsfortegnelse med nummerering i stedet for kort)
// Formål: Offentlig bogside. Arver den mørke baggrund fra app/read/layout.tsx.

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
    .select('id, title, description, language, project_id')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!book) notFound()

  const { data: project } = await supabase
    .from('projects')
    .select('genre')
    .eq('id', book.project_id)
    .single()

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index')
    .eq('book_id', book.id)
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  return (
    <div>
      <div className="px-6 py-6">
        <Link href="/read" className="font-ui text-sm text-[#8B90AD] hover:text-[#F2E8D5]">
          ← Bibliotek
        </Link>
      </div>

      <section className="mx-auto max-w-2xl px-6 pb-16 pt-8 text-center">
        {project?.genre && <p className="font-ui text-sm text-[#E4A44C]">{project.genre}</p>}
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-[#F2E8D5] md:text-5xl">
          {book.title}
        </h1>
        {book.description && (
          <p className="mx-auto mt-6 max-w-xl font-reading text-lg leading-relaxed text-[#B8BAD1]">
            {book.description}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-xl border-t border-[#2A2D40] px-6 py-12">
        <h2 className="font-ui text-sm text-[#8B90AD]">Indhold</h2>
        <ol className="mt-6 space-y-1">
          {chapters?.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/read/${slug}/${chapter.id}`}
                className="flex items-baseline justify-between gap-4 border-b border-[#2A2D40]/60 py-3 font-reading text-lg text-[#E8E1CE] transition-colors hover:text-[#E4A44C]"
              >
                <span>{chapter.title}</span>
                <span className="font-ui text-xs text-[#5A5E7A]">
                  {String(chapter.order_index + 1).padStart(2, '0')}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {chapters?.length === 0 && (
          <p className="mt-6 font-reading text-[#8B90AD]">Ingen kapitler publiceret endnu.</p>
        )}
      </section>
    </div>
  )
}
