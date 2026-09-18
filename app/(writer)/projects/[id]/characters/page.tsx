// Path: app/(writer)/projects/[id]/characters/page.tsx
// Status: OPDATERET (redirect-mål rettet fra /login til /writer/login)
// Formål: Karakter-generator for et givent projekt. Navn og Alder er
// obligatoriske, resten er valgfrit og gemmes i separate kolonner til AI-kontekst.
// Formularen er nu udliftet til CharacterForm (client) med "Foreslå"-knapper.

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CharacterForm } from '@/components/characters/character-form'

async function createCharacter(projectId: string, formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

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
  if (!user) redirect('/writer/login')

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

      <CharacterForm projectId={projectId} action={createCharacterWithProject} />
    </div>
  )
}
