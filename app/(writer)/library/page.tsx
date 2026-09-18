// Path: app/(writer)/library/page.tsx
// Status: NY
// Formål: "My Library"-sidebar-linket. Samlet liste over alle brugerens bøger,
// tværs af projekter (books har user_id direkte, så ingen join nødvendig).

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LibraryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: books } = await supabase
    .from('books')
    .select('id, title, status, language, project_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">My Library</h1>

      <ul className="mt-6 space-y-3">
        {books?.map((book) => (
          <li key={book.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/projects/${book.project_id}/books/${book.id}`}
                className="font-medium hover:underline"
              >
                {book.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                {book.status} · {book.language.toUpperCase()}
              </span>
            </div>
          </li>
        ))}
        {books?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen bøger endnu. Opret et projekt og din første bog fra dashboardet.
          </p>
        )}
      </ul>
    </div>
  )
}
