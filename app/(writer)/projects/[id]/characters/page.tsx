// Path: app/(writer)/projects/[id]/characters/page.tsx
// Status: NY
// Formål: Karakter-generator for et givent projekt. Navn og Alder er
// obligatoriske, resten er valgfrit og gemmes i separate kolonner til AI-kontekst.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

async function createCharacter(projectId: string, formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const age = Number(formData.get('age'))
  const body_language = (formData.get('body_language') as string) || null
  const build = (formData.get('build') as string) || null
  const backstory = (formData.get('backstory') as string) || null
  const family_relations = (formData.get('family_relations') as string) || null
  const motivation = (formData.get('motivation') as string) || null

  const { error } = await supabase.from('characters').insert({
    project_id: projectId,
    name,
    age,
    body_language,
    build,
    backstory,
    family_relations,
    motivation,
  })

  if (error) {
    console.error(error)
    return
  }

  redirect(`/projects/${projectId}/characters`)
}

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: projectId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', projectId)
    .single()

  if (!project) notFound()

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, age, motivation')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  const createCharacterWithProject = createCharacter.bind(null, projectId)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Karakterer — {project.title}</h1>

      <ul className="mt-6 space-y-3">
        {characters?.map((c) => (
          <li key={c.id} className="rounded-lg border p-4">
            <div className="font-medium">
              {c.name} <span className="text-muted-foreground">({c.age})</span>
            </div>
            {c.motivation && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {c.motivation}
              </p>
            )}
          </li>
        ))}
        {characters?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen karakterer endnu — opret den første nedenfor.
          </p>
        )}
      </ul>

      <form
        action={createCharacterWithProject}
        className="mt-10 space-y-4 border-t pt-6"
      >
        <h2 className="text-lg font-medium">Ny karakter</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="name">
              Navn *
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="age">
              Alder *
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min={0}
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="body_language">
            Kropssprog
          </label>
          <input
            id="body_language"
            name="body_language"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="build">
            Kropsbygning
          </label>
          <input
            id="build"
            name="build"
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="backstory">
            Baggrundshistorie
          </label>
          <textarea
            id="backstory"
            name="backstory"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="family_relations">
            Familierelationer
          </label>
          <textarea
            id="family_relations"
            name="family_relations"
            rows={2}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="motivation">
            Motivation
          </label>
          <textarea
            id="motivation"
            name="motivation"
            rows={2}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Opret karakter
        </button>
      </form>
    </div>
  )
}
