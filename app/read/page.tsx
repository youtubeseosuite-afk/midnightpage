// Path: app/read/page.tsx
// Status: NY
// Formål: Reader's Portal-forsiden. Offentlig, kræver ikke login — RLS tillader
// SELECT på published rows for alle. Filtrerbar på sprog via ?lang=da/en/es.

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { AppLanguage } from '@/lib/types/database'

const LANGS: { code: AppLanguage; label: string }[] = [
  { code: 'da', label: 'Dansk' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
]

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
    .select('id, title, description, slug, language')
    .eq('status', 'published')
    .eq('language', activeLang)
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Bibliotek</h1>

      <div className="mt-4 flex gap-2">
        {LANGS.map((l) => (
          <Link
            key={l.code}
            href={`/read?lang=${l.code}`}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              activeLang === l.code ? 'bg-primary text-primary-foreground' : ''
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {books?.map((book) => (
          <li key={book.id} className="rounded-lg border p-4">
            <Link href={`/read/${book.slug}`} className="font-medium hover:underline">
              {book.title}
            </Link>
            {book.description && (
              <p className="mt-1 text-sm text-muted-foreground">{book.description}</p>
            )}
          </li>
        ))}
        {books?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen publicerede bøger på dette sprog endnu.
          </p>
        )}
      </ul>
    </div>
  )
}
