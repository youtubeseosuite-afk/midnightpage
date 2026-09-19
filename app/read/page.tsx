// Path: app/read/page.tsx
// Status: OPDATERET (tom-tilstanden er nu læser-rettet info om Midnight Page
// — ingen forfatter-CTA, det hører til på /writer-landingsiden)
// Formål: Bibliotekets forside. Genre kommer fra projects (books har den
// ikke direkte), så vi slår projekt-genre op separat og grupperer i JS —
// undgår embedded/join-selects, som vores Relationships-typer ikke
// understøtter pænt.

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { AppLanguage, Book } from '@/lib/types/database'

const LANGS: { code: AppLanguage; label: string }[] = [
  { code: 'da', label: 'Dansk' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
]

const SPINE_ACCENTS = ['#E4A44C', '#7A2B32']

export default async function ReadHomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams
  const activeLang = (LANGS.some((l) => l.code === lang) ? lang : 'da') as AppLanguage

  const supabase = await createClient()
  const { data: books } = await supabase
    .from('books')
    .select('id, title, description, slug, language, project_id, published_at')
    .eq('status', 'published')
    .eq('language', activeLang)
    .order('published_at', { ascending: false })

  const projectIds = [...new Set((books ?? []).map((b) => b.project_id))]

  const { data: projects } = projectIds.length
    ? await supabase.from('projects').select('id, genre').in('id', projectIds)
    : { data: [] }

  const genreByProjectId = new Map(projects?.map((p) => [p.id, p.genre]))

  const featured = books?.[0] ?? null
  const rest = books?.slice(1) ?? []

  type ShelfBook = Pick<Book, 'id' | 'title' | 'slug'>
  const shelves = new Map<string, ShelfBook[]>()
  for (const book of rest) {
    const genre = genreByProjectId.get(book.project_id) ?? 'Andet'
    if (!shelves.has(genre)) shelves.set(genre, [])
    shelves.get(genre)!.push(book)
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-6">
        <span className="font-display text-lg text-[#F2E8D5]">Midnight Page</span>
        <div className="flex gap-4 text-sm">
          {LANGS.map((l) => (
            <Link
              key={l.code}
              href={`/read?lang=${l.code}`}
              className={
                activeLang === l.code
                  ? 'text-[#E4A44C]'
                  : 'text-[#8B90AD] transition-colors hover:text-[#F2E8D5]'
              }
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {featured ? (
        <section className="border-b border-[#2A2D40] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-ui text-sm text-[#8B90AD]">På natbordet</p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-[#F2E8D5] md:text-6xl">
              {featured.title}
            </h1>
            {featured.description && (
              <p className="mx-auto mt-6 max-w-xl font-reading text-lg leading-relaxed text-[#B8BAD1]">
                {featured.description}
              </p>
            )}
            <Link
              href={`/read/${featured.slug}`}
              className="mt-8 inline-block rounded-full bg-[#E4A44C] px-8 py-3 font-ui text-sm font-medium text-[#13141F] transition-transform hover:scale-105"
            >
              Læs nu
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-medium leading-tight text-[#F2E8D5] md:text-5xl">
            Historier født med en forfatter og en AI-partner
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-reading text-lg leading-relaxed text-[#B8BAD1]">
            Midnight Page samler original skønlitteratur på dansk, engelsk og spansk —
            skrevet af rigtige forfattere med hjælp fra AI. Der er endnu ingen bøger
            udgivet på dette sprog, men de første historier er på vej. Kig forbi igen
            snart.
          </p>
        </section>
      )}

      {Array.from(shelves.entries()).map(([genre, shelfBooks], shelfIndex) => (
        <section key={genre} className="px-6 py-10">
          <h2 className="font-display text-xl text-[#F2E8D5]">{genre}</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {shelfBooks.map((book, i) => (
              <Link
                key={book.id}
                href={`/read/${book.slug}`}
                className="group flex h-64 w-24 flex-shrink-0 flex-col justify-end rounded-sm border-l-2 bg-[#1C1E2C] p-3 transition-transform hover:-translate-y-1"
                style={{
                  borderLeftColor: SPINE_ACCENTS[(shelfIndex + i) % SPINE_ACCENTS.length],
                }}
              >
                <span className="font-display text-sm leading-snug text-[#E8E1CE] [writing-mode:vertical-rl]">
                  {book.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
