// Path: app/(writer)/projects/[id]/books/page.tsx
// Status: OPDATERET (sprog-dropdown fjernet — hardcoder til dansk)
// Formål: Liste over bøger i et projekt + opret ny bog. Ved oprettelse genereres en
// unik slug, og der oprettes automatisk et første kapitel, så forfatteren kan gå
// direkte i gang med at skrive.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { slugify } from '@/lib/utils/slugify'

async function createBook(projectId: string, formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || null
  const language = 'da' as const
  const slug = slugify(title)

  const { data: book, error } = await supabase
    .from('books')
    .insert({
      project_id: projectId,
      user_id: user.id,
      title,
      description,
      language,
      slug,
    })
    .select('id')
    .single()

  if (error || !book) {
    console.error(error)
    return
  }

  const { data: chapter } = await supabase
    .from('chapters')
    .insert({ book_id: book.id, title: 'Kapitel 1', order_index: 0 })
    .select('id')
    .single()

  if (chapter) {
    redirect(`/projects/${projectId}/books/${book.id}/chapters/${chapter.id}`)
  }

  redirect(`/projects/${projectId}/books/${book.id}`)
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', projectId)
    .single()

  if (!project) notFound()

  const { data: books } = await supabase
    .from('books')
    .select('id, title, status, slug, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const createBookWithProject = createBook.bind(null, projectId)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Bøger — {project.title}</h1>

      <ul className="mt-6 space-y-3">
        {books?.map((book) => (
          <li key={book.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{book.title}</div>
              <span className="text-xs text-muted-foreground">{book.status}</span>
            </div>
            <Link
              href={`/projects/${projectId}/books/${book.id}`}
              className="mt-1 inline-block text-sm text-primary underline"
            >
              Åbn bog
            </Link>
          </li>
        ))}
        {books?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen bøger endnu — opret den første nedenfor.
          </p>
        )}
      </ul>

      <form action={createBookWithProject} className="mt-10 space-y-4 border-t pt-6">
        <h2 className="text-lg font-medium">Ny bog</h2>

        <div>
          <label className="block text-sm font-medium" htmlFor="title">
            Titel
          </label>
          <input
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Beskrivelse
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Opret bog
        </button>
      </form>
    </div>
  )
}
