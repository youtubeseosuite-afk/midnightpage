// Path: app/(writer)/projects/page.tsx
// Status: OPDATERET (genre er nu en dropdown med faste genre-navne, ikke fritekst)
// Formål: Liste over brugerens projekter (Story Bibles) + form til at oprette nyt projekt.
// RLS sikrer at kun ejerens egne projekter hentes.

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { AppLanguage } from '@/lib/types/database'

async function createProject(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const title = formData.get('title') as string
  const synopsis = formData.get('synopsis') as string
  const genre = (formData.get('genre') as string) || null
  const language = formData.get('language') as AppLanguage

  const { data, error } = await supabase
    .from('projects')
    .insert({ title, synopsis, genre, language, user_id: user.id })
    .select('id')
    .single()

  if (error) {
    console.error(error)
    return
  }

  redirect(`/projects/${data.id}`)
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, synopsis, genre, language, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Mine projekter</h1>

      <ul className="mt-6 space-y-3">
        {projects?.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="block rounded-lg border p-4 hover:bg-muted"
            >
              <div className="font-medium">{project.title}</div>
              {project.genre && (
                <span className="text-xs text-muted-foreground">{project.genre}</span>
              )}
              {project.synopsis && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.synopsis}
                </p>
              )}
            </Link>
          </li>
        ))}
        {projects?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen projekter endnu — opret dit første nedenfor.
          </p>
        )}
      </ul>

      <form action={createProject} className="mt-10 space-y-4 border-t pt-6">
        <h2 className="text-lg font-medium">Nyt projekt</h2>

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
          <label className="block text-sm font-medium" htmlFor="genre">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            defaultValue=""
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="" disabled>
              Vælg en genre
            </option>
            <optgroup label="Klassiske hovedgenrer">
              <option value="Action">Action</option>
              <option value="Adventure (Eventyr)">Adventure (Eventyr)</option>
              <option value="Komedie">Komedie</option>
              <option value="Drama">Drama</option>
              <option value="Gyser (Horror)">Gyser (Horror)</option>
              <option value="Science Fiction (Sci-Fi)">Science Fiction (Sci-Fi)</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Thriller">Thriller</option>
              <option value="Krimi/Mystery">Krimi/Mystery</option>
              <option value="Romantik">Romantik</option>
              <option value="Western">Western</option>
              <option value="Historisk fiktion">Historisk fiktion</option>
            </optgroup>
            <optgroup label="Særlige nicher og stilarter">
              <option value="Satire">Satire</option>
              <option value="Gothic">Gothic</option>
              <option value="Steampunk">Steampunk</option>
              <option value="Dystopi">Dystopi</option>
              <option value="Utopi">Utopi</option>
              <option value="Biografi/Memoir">Biografi/Memoir</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="synopsis">
            Synopsis (Story Bible-kontekst)
          </label>
          <textarea
            id="synopsis"
            name="synopsis"
            rows={4}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="language">
            Sprog
          </label>
          <select
            id="language"
            name="language"
            defaultValue="da"
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="da">Dansk</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Opret projekt
        </button>
      </form>
    </div>
  )
}
